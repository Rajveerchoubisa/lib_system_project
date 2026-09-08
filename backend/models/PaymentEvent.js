import mongoose from "mongoose";

const paymentEventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true },
    eventType: { type: String, required: true },
    orderId: String,
    paymentId: String,
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentEvent", paymentEventSchema);
