import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
  token: { type: String, required: true, unique: true }, // store SHA-256 hash
  expireAt: { type: Date, required: true, index: true },
}, { timestamps: true });

// Optional: TTL index via expireAt if you want Mongo to auto-delete expired docs
// resetTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const ResetToken = mongoose.model("ResetToken", resetTokenSchema);
export default ResetToken;
