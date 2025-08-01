import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  months: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  }
}, { timestamps: true })

export default mongoose.model("Booking", bookingSchema)
