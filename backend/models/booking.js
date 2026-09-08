import mongoose from "mongoose";

export const RESERVATION_STATUS = Object.freeze({
  HELD: "held",
  PAYMENT_PENDING: "payment_pending",
  CONFIRMED: "confirmed",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  PAYMENT_FAILED: "payment_failed",
  LEGACY_ACTIVE: "active",
});

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, index: true },
    paymentId: String,
    amount: Number,
    currency: { type: String, default: "INR" },
    purpose: { type: String, enum: ["reservation", "renewal"] },
    status: { type: String, enum: ["created", "captured", "failed"], default: "created" },
    processedAt: Date,
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    seatId: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", index: true },
    seatNumber: String,
    section: String,
    joiningDate: { type: Date, required: true },
    months: { type: Number, required: true, min: 1, max: 12 },
    price: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    holdExpiresAt: { type: Date, index: true },
    status: {
      type: String,
      enum: Object.values(RESERVATION_STATUS),
      default: RESERVATION_STATUS.HELD,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refund_required", "refunded"],
      default: "pending",
    },
    payment: paymentSchema,
    pendingRenewalMonths: { type: Number, default: 0 },
    idempotencyKey: String,
    confirmedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

bookingSchema.index(
  { userId: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } }
);

export default mongoose.model("Booking", bookingSchema);
