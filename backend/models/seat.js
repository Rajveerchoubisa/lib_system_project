import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true, unique: true },
    section: { type: String, required: true, index: true },
    floor: { type: Number, default: 1 },
    amenities: [String],
    isActive: { type: Boolean, default: true, index: true },
    state: {
      type: String,
      enum: ["available", "held", "reserved", "maintenance"],
      default: "available",
      index: true,
    },
    heldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    holdExpiresAt: { type: Date, default: null, index: true },
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
    occupiedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Seat", seatSchema);
