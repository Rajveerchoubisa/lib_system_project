import User from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmailOTP } from "../utils/emailService.js";
import { sendSMSOTP } from "../utils/smsService.js";
import VerificationCode from "../models/VerificationCode.js";
import crypto from "crypto";

const normalizeIdentifier = (email, phone) => (email || phone || "").trim().toLowerCase();
const hashCode = (identifier, otp) =>
  crypto.createHash("sha256").update(`${identifier}:${otp}`).digest("hex");

export const sendOTP = async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: "Email or phone is required" });
  }

  if (email && (await User.findOne({ email }))) {
    return res.status(400).json({ message: "Email already exists" });
  }
  if (phone && (await User.findOne({ phone }))) {
    return res.status(400).json({ message: "Phone already exists" });
  }

  const otp = generateOTP();

  try {
    if (email) await sendEmailOTP(email, otp);

    if (phone) {
      let phoneNumber = phone;

      // Convert to E.164 format if it's an Indian number
      if (!phoneNumber.startsWith("+91")) {
        phoneNumber = "+91" + phoneNumber;
      }

      await sendSMSOTP(phoneNumber, otp);
    }

    const identifier = normalizeIdentifier(email, phone);
    await VerificationCode.findOneAndUpdate(
      { identifier },
      {
        codeHash: hashCode(identifier, otp),
        expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRY_MIN || 5) * 60 * 1000),
        $unset: { verifiedAt: 1 },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("OTP send error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req, res) => {
  const { otp, email, phone } = req.body;
  const identifier = normalizeIdentifier(email, phone);

  // Check if OTP is provided
  if (!otp || !identifier) {
    return res.status(400).json({ message: "OTP and email or phone are required" });
  }

  const record = await VerificationCode.findOne({
    identifier,
    codeHash: hashCode(identifier, otp),
    expiresAt: { $gt: new Date() },
  });
  if (!record) return res.status(400).json({ message: "Invalid or expired OTP" });
  record.verifiedAt = new Date();
  await record.save();

  return res.status(200).json({ success: true, message: "OTP verified" });
};

//register

export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const identifier = normalizeIdentifier(email, phone);
    const verification = await VerificationCode.findOne({
      identifier,
      verifiedAt: { $exists: true },
      expiresAt: { $gt: new Date() },
    });
    if (!verification) return res.status(401).json({ message: "OTP verification required" });
    if (email && (await User.findOne({ email }))) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (phone && (await User.findOne({ phone }))) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    const user = await User.create({ name, email, phone, password });

    await verification.deleteOne();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email || null,
      phone: user.phone || null,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//login

export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!user) {
      return res.status(401).json({ message: "User Not found" });
    }
    if (!(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ message: "Please Enter the Correct Password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Please log in to access the profile" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "No Profile Found" });
    }

    res.status(200).json(user);
  } catch (error) {
    // console.error("Error fetching profile:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
