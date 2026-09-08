import Booking, { RESERVATION_STATUS } from "../models/booking.js";
import Seat from "../models/seat.js";
import { addMonths } from "./reservationState.js";

export const PRICE_PER_MONTH = 750;
export const HOLD_MINUTES = 5;

function holdDurationMinutes() {
  return Number(process.env.SEAT_HOLD_MINUTES || HOLD_MINUTES);
}

export async function listSeats(now = new Date()) {
  const seats = await Seat.find({ isActive: true }).sort({ section: 1, seatNumber: 1 }).lean();
  return seats.map((seat) => ({
    ...seat,
    availability:
      seat.state === "available" ||
      (seat.state === "held" && seat.holdExpiresAt && seat.holdExpiresAt <= now)
        ? "available"
        : seat.state,
  }));
}

export async function createSeatHold({ seatId, userId, joiningDate, months, idempotencyKey, now = new Date() }) {
  const parsedMonths = Number(months);
  const start = new Date(joiningDate);
  if (!seatId || !Number.isInteger(parsedMonths) || parsedMonths < 1 || parsedMonths > 12) {
    const error = new Error("Choose a seat and a duration between 1 and 12 months");
    error.statusCode = 400;
    throw error;
  }
  if (Number.isNaN(start.getTime())) {
    const error = new Error("Joining date is invalid");
    error.statusCode = 400;
    throw error;
  }

  if (idempotencyKey) {
    const existing = await Booking.findOne({ userId, idempotencyKey }).populate("seatId");
    if (existing) return existing;
  }

  const existingReservation = await Booking.findOne({
    userId,
    status: { $in: [RESERVATION_STATUS.HELD, RESERVATION_STATUS.PAYMENT_PENDING, RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.LEGACY_ACTIVE] },
    $or: [{ holdExpiresAt: null }, { holdExpiresAt: { $gt: now } }],
  });
  if (existingReservation) {
    const error = new Error("You already have an active reservation or seat hold");
    error.statusCode = 409;
    throw error;
  }

  const holdExpiresAt = new Date(now.getTime() + holdDurationMinutes() * 60 * 1000);
  const seat = await Seat.findOneAndUpdate(
    {
      _id: seatId,
      isActive: true,
      $or: [{ state: "available" }, { state: "held", holdExpiresAt: { $lte: now } }],
    },
    { $set: { state: "held", heldBy: userId, holdExpiresAt, reservationId: null, occupiedUntil: null } },
    { new: true }
  );

  if (!seat) {
    const error = new Error("That seat was just taken. Please choose another seat.");
    error.statusCode = 409;
    throw error;
  }

  try {
    const booking = await Booking.create({
      userId,
      seatId: seat._id,
      seatNumber: seat.seatNumber,
      section: seat.section,
      joiningDate: start,
      months: parsedMonths,
      price: parsedMonths * PRICE_PER_MONTH,
      expiryDate: addMonths(start, parsedMonths),
      holdExpiresAt,
      status: RESERVATION_STATUS.HELD,
      paymentStatus: "pending",
      idempotencyKey,
    });
    const linked = await Seat.updateOne(
      { _id: seat._id, heldBy: userId, holdExpiresAt },
      { $set: { reservationId: booking._id } }
    );
    if (!linked.modifiedCount) {
      booking.status = RESERVATION_STATUS.EXPIRED;
      await booking.save();
      const error = new Error("The seat hold expired before it could be attached");
      error.statusCode = 409;
      throw error;
    }
    return booking.populate("seatId");
  } catch (error) {
    await Seat.updateOne(
      { _id: seat._id, heldBy: userId, holdExpiresAt },
      { $set: { state: "available" }, $unset: { heldBy: 1, holdExpiresAt: 1, reservationId: 1, occupiedUntil: 1 } }
    );
    if (error?.code === 11000 && idempotencyKey) {
      return Booking.findOne({ userId, idempotencyKey }).populate("seatId");
    }
    throw error;
  }
}

export async function releaseHold({ bookingId, userId, now = new Date() }) {
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, userId, status: { $in: [RESERVATION_STATUS.HELD, RESERVATION_STATUS.PAYMENT_FAILED] } },
    { $set: { status: RESERVATION_STATUS.CANCELLED, cancelledAt: now } },
    { new: true }
  );
  if (!booking) return null;
  await Seat.updateOne(
    { _id: booking.seatId, reservationId: booking._id, state: "held" },
    { $set: { state: "available" }, $unset: { heldBy: 1, holdExpiresAt: 1, reservationId: 1, occupiedUntil: 1 } }
  );
  return booking;
}
