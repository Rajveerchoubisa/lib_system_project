import cron from "node-cron";
import Booking, { RESERVATION_STATUS } from "../models/booking.js";
import Seat from "../models/seat.js";

export async function expireReservations(now = new Date()) {
  const expiredHolds = await Booking.find({
    status: { $in: [RESERVATION_STATUS.HELD, RESERVATION_STATUS.PAYMENT_PENDING, RESERVATION_STATUS.PAYMENT_FAILED] },
    holdExpiresAt: { $lte: now },
  }).select("_id");
  if (expiredHolds.length) {
    const ids = expiredHolds.map(({ _id }) => _id);
    await Booking.updateMany({ _id: { $in: ids } }, { $set: { status: RESERVATION_STATUS.EXPIRED } });
    await Seat.updateMany(
      { reservationId: { $in: ids }, state: "held" },
      { $set: { state: "available" }, $unset: { heldBy: 1, holdExpiresAt: 1, reservationId: 1, occupiedUntil: 1 } }
    );
  }

  const expiredReservations = await Booking.find({
    status: { $in: [RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.LEGACY_ACTIVE] },
    expiryDate: { $lte: now },
  }).select("_id");
  if (expiredReservations.length) {
    const ids = expiredReservations.map(({ _id }) => _id);
    await Booking.updateMany({ _id: { $in: ids } }, { $set: { status: RESERVATION_STATUS.EXPIRED } });
    await Seat.updateMany(
      { reservationId: { $in: ids }, state: "reserved" },
      { $set: { state: "available" }, $unset: { heldBy: 1, holdExpiresAt: 1, reservationId: 1, occupiedUntil: 1 } }
    );
  }
  return { expiredHolds: expiredHolds.length, expiredReservations: expiredReservations.length };
}

export function startBookingExpiryJob() {
  return cron.schedule("* * * * *", async () => {
    try {
      const result = await expireReservations();
      if (result.expiredHolds || result.expiredReservations) console.log("Reservation expiry:", result);
    } catch (error) {
      console.error("Reservation expiry failed:", error);
    }
  });
}
