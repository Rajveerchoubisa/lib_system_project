import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

export default function ResetPasswordPhone() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const phone = queryParams.get("phone");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleReset = async () => {
    try {
      const res = await axios.post(
        `${API}/api/auth/reset-password-phone`,
        {
          phone,
          otp,
          newPassword,
        }
      );
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <PageWrapper>
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#0f172a] to-gray-800 p-4">
  <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
    {/* Title */}
    <h2 className="text-3xl font-bold text-center text-white mb-6">
      🔒 Reset Password
    </h2>
    <p className="text-gray-300 text-center text-sm mb-8">
      Enter the OTP sent to your phone and set a new password.
    </p>

    {/* OTP Field */}
    <div className="mb-5">
      <label className="block text-gray-300 mb-2 text-sm">OTP</label>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
      />
    </div>

    {/* New Password Field */}
    <div className="mb-6">
      <label className="block text-gray-300 mb-2 text-sm">New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
        className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
      />
    </div>

    {/* Reset Button */}
    <button
      onClick={handleReset}
      className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-white transition-all duration-200 shadow-lg"
    >
      Reset Password
    </button>

    {/* Back to login */}
    <p className="text-gray-400 text-sm text-center mt-6">
      Remember your password?{" "}
      <a href="/login" className="text-indigo-400 hover:text-indigo-300 underline">
        Login here
      </a>
    </p>
  </div>
</div>
</PageWrapper>
</>

  );
}
