import crypto from "crypto";
import User from "../models/UserModel.js";
import ResetToken from "../models/ResetTokenModel.js";
import { sendResetEmail } from "../utils/emailService2.js";
import { sendSMSOTP } from "../utils/smsService.js";

const normalizePhone = (phone) =>
  phone?.startsWith("+") ? phone : `+91${phone}`;

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  console.log("[REQ BODY]", req.body);

  try {
    const { email, phone } = req.body;

    // Normalize inputs
    const cleanEmail = email?.toString().trim().toLowerCase() || null;
    const cleanPhoneRaw = phone?.toString().trim() || null;
    const normalizedPhone = cleanPhoneRaw ? normalizePhone(cleanPhoneRaw) : null;

    console.log("[SEARCH INPUTS] email:", cleanEmail, "phone:", cleanPhoneRaw, "normalizedPhone:", normalizedPhone);

    if (!cleanEmail && !cleanPhoneRaw) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    // Find user: search by email first, then fallback to phone
    let user = null;
    if (cleanEmail) {
      user = await User.findOne({ email: cleanEmail });
      console.log("[FIND] searched by email:", cleanEmail, "->", !!user);
    }

    if (!user && cleanPhoneRaw) {
      // search by either exact phone or normalized phone (if different)
      const phoneQuery = normalizedPhone && normalizedPhone !== cleanPhoneRaw
        ? { $or: [{ phone: cleanPhoneRaw }, { phone: normalizedPhone }] }
        : { phone: cleanPhoneRaw };

      user = await User.findOne(phoneQuery);
      console.log("[FIND] searched by phone:", phoneQuery, "->", !!user);
    }

    // EMAIL RESET FLOW
    if (cleanEmail) {
      if (user) {
        // 1) Invalidate previous tokens for this user (defensive)
        await ResetToken.deleteMany({ userId: user._id });

        // 2) Create a new token (send raw token to user via email, store hash in DB)
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        await ResetToken.create({
          userId: user._id,
          token: hashedToken,
          expireAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        });

        // 3) Email should link to FRONTEND, which will POST new password to backend
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
        const html = `
          <p>Click the link below to reset your password (valid for 15 minutes):</p>
          <a href="${resetUrl}">${resetUrl}</a>
        `;

        try {
          await sendResetEmail(user.email, "Reset your SmartLibrary password", html);
          console.log("[FORGOT] Token generated for:", user.email);
        } catch (err) {
          console.error("Email send failed:", err);
          // still return generic success to avoid enumeration
        }
      }

      // Always generic to avoid account enumeration
      return res.status(200).json({ message: "If the account exists, a reset was sent." });
    }

    // PHONE RESET FLOW (unchanged logic but with cleaned phone)
    if (cleanPhoneRaw) {
      if (user) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 min
        await user.save({ validateBeforeSave: false });

        try {
          await sendSMSOTP(normalizedPhone, `Your reset OTP: ${otp}`);
        } catch (err) {
          console.error("SMS send failed:", err);
        }
      }

      return res.status(200).json({ message: "If the account exists, a reset was sent." });
    }

  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/reset-password/:token
export const resetPasswordWithToken = async (req, res) => {
  try {
    const { token } = req.params; // raw token from URL
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 1) Hash the incoming token to find it in DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2) Find valid token doc
    const tokenDoc = await ResetToken.findOne({
      token: hashedToken,
      expireAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 3) Resolve the exact user the token belongs to
    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      // Clean up token if user not found
      await tokenDoc.deleteOne();
      return res.status(400).json({ message: "Invalid token/user" });
    }

    // 4) Update password (pre-save hook will hash)
    user.password = newPassword;
    await user.save();
    console.log(`[UserModel] Password hashed for: ${user.email || user.phone}`);

    // 5) One-time use: delete the token
    await tokenDoc.deleteOne();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("resetPasswordWithToken error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/reset-password-otp (unchanged)
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ message: "Phone, OTP, and new password are required" });
    }

    const normalizedPhone = normalizePhone(phone.trim());

    const user = await User.findOne({
      phone: { $in: [phone.trim(), normalizedPhone] },
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    console.log(`[UserModel] Password hashed for: ${user.email || user.phone}`);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("resetPasswordWithOtp error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
