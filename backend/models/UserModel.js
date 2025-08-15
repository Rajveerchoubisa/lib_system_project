import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // allows email to be optional if using phone
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // allows phone to be optional if using email
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    resetPasswordToken: { 
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    resetOtp: {
      type: String,
    },
    resetOtpExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("[UserModel] Password hashed for:", this.email || this.phone);
    next();
  } catch (err) {
    return next(err); // 👈 important to pass error to next
  }
});

//comparing entered password with hashed

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
