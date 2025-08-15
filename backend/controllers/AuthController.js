import User from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmailOTP } from "../utils/emailService.js";
import { sendSMSOTP } from "../utils/smsService.js";

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

    // Store OTP in session
    req.session.otp = otp;
    console.log("Session after setting OTP:", req.session);
    req.session.email = email;
    req.session.phone = phone;
    req.session.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    return res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("OTP send error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req, res) => {
  console.log("Session in verify:", req.session);
  const { otp } = req.body;

  // Check if OTP is provided
  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }

  // Check if session and stored OTP exist
  if (!req.session || !req.session.otp || !req.session.otpExpiresAt) {
    return res.status(400).json({ message: "No OTP session found" });
  }

  // Check if OTP has expired
  if (Date.now() > req.session.otpExpiresAt) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  // Validate OTP
  if (req.session.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Mark OTP as verified
  req.session.otpVerified = true;

  return res.status(200).json({ success: true, message: "OTP verified" });
};

//register

export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!req.session?.otpVerified) {
    return res.status(401).json({ message: "OTP verification required" });
  }

  if (email && req.session.email && req.session.email !== email) {
    return res.status(401).json({ message: "Email mismatch" });
  }

  if (phone && req.session.phone && req.session.phone !== phone) {
    return res.status(401).json({ message: "Phone mismatch" });
  }

  try {
    if (email && (await User.findOne({ email }))) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (phone && (await User.findOne({ phone }))) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    const user = await User.create({ name, email, phone, password });

    // Clear session
    req.session.otp = null;
    req.session.otpVerified = false;

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
