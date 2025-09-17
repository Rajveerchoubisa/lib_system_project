import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import axios from "axios";
import LoginNavbar from "../components/LoginNavbar.jsx";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper.jsx";

export default function Register() {
  const [method, setMethod] = useState("email"); // 'email' or 'phone'
  const [name, setName] = useState("");
  const [contact, setContact] = useState(""); // phone or email
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleSendOtp = async () => {
    try {
      const res = await axios.post(
        `${API}/api/auth/send-otp`,
        {
          [method]: contact,
        },
        { withCredentials: true }
      );
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. Verify OTP
      await axios.post(
        `${API}/api/auth/verify-otp`,
        {
          // [method]: contact,
          otp,
        },
        { withCredentials: true }
      );

      // 2. Register user
      const res = await axios.post(
        `${API}/api/auth/register`,
        {
          name,
          password,
          // [method]: contact,
            ...(method === "email" ? { email: contact } : { phone: contact }),
        },
        { withCredentials: true }
      );

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      toast.success("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <PageWrapper>
      <LoginNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
        <motion.div
          className="bg-white/5 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-wide">
            Create Your Account
          </h2>

          <form onSubmit={handleVerifyOtpAndRegister} className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <FaUser className="absolute top-3.5 left-3 text-white/50" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full pl-10 pr-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/50"
              />
            </div>

            {/* Switch Method */}
            <div className="flex justify-center gap-4 mb-2">
              <button
                type="button"
                className={`px-3 py-1 rounded-md ${
                  method === "email"
                    ? "bg-indigo-500 text-white"
                    : "bg-white/20 text-white/70"
                }`}
                onClick={() => {
                  setMethod("email");
                  setContact("");
                }}
              >
                Email
              </button>
              <button
                disabled // button is disabled because phone otp is not working currently as there is no sms service provider
                type="button"
                className={`px-3 py-1  rounded-md ${
                  method === "phone"
                    ? "bg-indigo-500 text-white"
                    : "bg-white/20 text-white/70"
                }`}
                onClick={() => {
                  setMethod("phone");
                  setContact("");
                }}
              >
                Phone(Unavailable)
              </button>
            </div>

            {/* Email or Phone */}
            <div className="relative">
              {method === "email" ? (
                <FaEnvelope className="absolute top-3.5 left-3 text-white/50" />
              ) : (
                <FaPhone className="absolute top-3.5 left-3 text-white/50" />
              )}
              <input
                type={method === "email" ? "email" : "tel"}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={
                  method === "email" ? "you@example.com" : "+91 1234567890"
                }
                required
                className="w-full pl-10 pr-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/50"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-3.5 left-3 text-white/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/50"
              />
            </div>

            {/* OTP Input */}
            {otpSent && (
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/50"
              />
            )}

            {/* Action Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition shadow-md"
              onClick={otpSent ? handleVerifyOtpAndRegister : handleSendOtp}
            >
              {otpSent ? "Verify OTP & Register" : "Send OTP"}
            </motion.button>
          </form>

          {/* Switch to Login */}
          <p className="text-center text-white/60 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
      </PageWrapper>
    </>
  );
}
