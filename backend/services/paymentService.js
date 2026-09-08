import crypto from "crypto";
import Razorpay from "razorpay";
import Booking, { RESERVATION_STATUS } from "../models/booking.js";
import PaymentEvent from "../models/PaymentEvent.js";
import Seat from "../models/seat.js";
import { addMonths, assertTransition } from "./reservationState.js";
import { PRICE_PER_MONTH } from "./seatService.js";

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const error = new Error("Razorpay credentials are not configured");
    error.statusCode = 503;
    throw error;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export function signaturesMatch(payload, signature, secret) {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const actualBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function createReservationOrder({ bookingId, userId, purpose = "reservation", months }) {
  const now = new Date();
  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) {
    const error = new Error("Reservation not found");
    error.statusCode = 404;
    throw error;
  }

  const isRenewal = purpose === "renewal";
  if (isRenewal) {
    if (![RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.LEGACY_ACTIVE].includes(booking.status)) {
      const error = new Error("Only a confirmed reservation can be renewed");
      error.statusCode = 409;
      throw error;
    }
  } else if (![RESERVATION_STATUS.HELD, RESERVATION_STATUS.PAYMENT_FAILED, RESERVATION_STATUS.PAYMENT_PENDING].includes(booking.status)) {
    const error = new Error("This reservation is not awaiting payment");
    error.statusCode = 409;
    throw error;
  } else if (!booking.holdExpiresAt || booking.holdExpiresAt <= now) {
    const error = new Error("Your seat hold expired. Please select the seat again.");
    error.statusCode = 409;
    throw error;
  }

  if (booking.payment?.orderId && booking.payment.status === "created") {
    return orderResponse(booking);
  }

  const renewalMonths = isRenewal ? Number(months) : 0;
  if (isRenewal && (!Number.isInteger(renewalMonths) || renewalMonths < 1 || renewalMonths > 12)) {
    const error = new Error("Renewal duration must be between 1 and 12 months");
    error.statusCode = 400;
    throw error;
  }

  const amount = isRenewal ? renewalMonths * PRICE_PER_MONTH : booking.price;
  const order = await getRazorpay().orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `${purpose.slice(0, 3)}_${booking._id}_${Date.now()}`.slice(0, 40),
    notes: {
      bookingId: booking._id.toString(),
      userId: userId.toString(),
      purpose,
      months: String(isRenewal ? renewalMonths : booking.months),
    },
  });

  booking.payment = {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    purpose,
    status: "created",
  };
  booking.pendingRenewalMonths = renewalMonths;
  booking.paymentStatus = "pending";
  if (!isRenewal && booking.status !== RESERVATION_STATUS.PAYMENT_PENDING) {
    assertTransition(booking.status, RESERVATION_STATUS.PAYMENT_PENDING);
    booking.status = RESERVATION_STATUS.PAYMENT_PENDING;
  }
  await booking.save();
  return orderResponse(booking);
}

function orderResponse(booking) {
  return {
    success: true,
    bookingId: booking._id,
    orderId: booking.payment.orderId,
    amount: booking.payment.amount,
    currency: booking.payment.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    holdExpiresAt: booking.holdExpiresAt,
  };
}

export async function processSuccessfulPayment({ orderId, paymentId, eventId, eventType }) {
  const duplicate = eventId ? await PaymentEvent.findOne({ eventId }) : null;
  if (duplicate) {
    const booking = await Booking.findById(duplicate.bookingId).populate("seatId");
    return { duplicate: true, bookingId: duplicate.bookingId, booking };
  }

  const booking = await Booking.findOne({ "payment.orderId": orderId });
  if (!booking) {
    const error = new Error("No reservation matches this Razorpay order");
    error.statusCode = 404;
    throw error;
  }
  if (booking.payment?.paymentId === paymentId && booking.payment?.status === "captured") {
    return { duplicate: true, bookingId: booking._id, booking: await booking.populate("seatId") };
  }

  const now = new Date();
  if (booking.payment.purpose === "renewal") {
    const extension = booking.pendingRenewalMonths;
    booking.expiryDate = addMonths(booking.expiryDate, extension);
    booking.months += extension;
    booking.price += extension * PRICE_PER_MONTH;
    booking.pendingRenewalMonths = 0;
  } else {
    const seat = await Seat.findOneAndUpdate(
      { _id: booking.seatId, reservationId: booking._id, state: "held" },
      {
        $set: { state: "reserved", occupiedUntil: booking.expiryDate },
        $unset: { heldBy: 1, holdExpiresAt: 1 },
      },
      { new: true }
    );
    if (!seat && booking.status !== RESERVATION_STATUS.CONFIRMED) {
      booking.paymentStatus = "refund_required";
      booking.payment.paymentId = paymentId;
      booking.payment.status = "captured";
      booking.payment.processedAt = now;
      await booking.save();
      const error = new Error("Payment captured after the seat was released; manual refund required");
      error.statusCode = 409;
      throw error;
    }
    assertTransition(booking.status, RESERVATION_STATUS.CONFIRMED);
    booking.status = RESERVATION_STATUS.CONFIRMED;
    booking.confirmedAt = now;
  }

  booking.paymentStatus = "completed";
  booking.payment.paymentId = paymentId;
  booking.payment.status = "captured";
  booking.payment.processedAt = now;
  await booking.save();

  if (eventId) {
    await PaymentEvent.updateOne(
      { eventId },
      { $setOnInsert: { eventId, eventType, orderId, paymentId, bookingId: booking._id, processedAt: now } },
      { upsert: true }
    );
  }
  return { duplicate: false, bookingId: booking._id, booking: await booking.populate("seatId") };
}

export async function verifyCheckoutPayment({ orderId, paymentId, signature }) {
  if (!signaturesMatch(`${orderId}|${paymentId}`, signature, process.env.RAZORPAY_KEY_SECRET)) {
    const error = new Error("Invalid payment signature");
    error.statusCode = 400;
    throw error;
  }
  return processSuccessfulPayment({
    orderId,
    paymentId,
    eventId: `checkout:${paymentId}`,
    eventType: "checkout.signature_verified",
  });
}
