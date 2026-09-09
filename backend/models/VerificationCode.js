import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, unique: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    verifiedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("VerificationCode", verificationCodeSchema);
