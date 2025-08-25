// import { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import LoginNavbar from "../components/LoginNavbar.jsx"

// export default function ForgotPassword() {
//   const [method, setMethod] = useState("email");
//   const [contact, setContact] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSend = async () => {
//     if (!contact.trim()) {
//       toast.error(`Please enter your ${method}`);
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = method === "email" ? { email: contact } : { phone: contact };
//       const res = await axios.post("http://localhost:5000/api/auth/forgot-password", payload);
//       toast.success(res.data.message || "If account exists, a reset was sent");

//       if(method == "email"){
//         navigate(`/reset-password?token=${res.data.token}`);
//       }
//       if (method === "phone") {
//         // go to phone OTP reset page
//         navigate(`/reset-password-phone?phone=${encodeURIComponent(contact)}`);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//     <LoginNavbar />
//    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
//   <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
//     <h2 className="text-3xl font-bold text-center text-white mb-2">
//       Forgot Password
//     </h2>
//     <p className="text-gray-400 text-center mb-6 text-sm">
//       Choose your method and we’ll send you a reset link or OTP
//     </p>

//     {/* Method Switch */}
//     <div className="flex justify-center gap-3 mb-6">
//       <button
//         onClick={() => setMethod("email")}
//         className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//           method === "email"
//             ? "bg-indigo-500 text-white shadow-md"
//             : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//         }`}
//       >
//         Email
//       </button>
//       <button
//         onClick={() => setMethod("phone")}
//         className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//           method === "phone"
//             ? "bg-indigo-500 text-white shadow-md"
//             : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//         }`}
//       >
//         Phone
//       </button>
//     </div>

//     {/* Input Field */}
//     <div className="mb-5">
//       <label className="block text-sm text-gray-300 mb-2">
//         {method === "email" ? "Email Address" : "Phone Number"}
//       </label>
//       <input
//         value={contact}
//         onChange={(e) => setContact(e.target.value)}
//         placeholder={method === "email" ? "you@example.com" : "+91 9999999999"}
//         className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//       />
//     </div>

//     {/* Action Button */}
//     <button
//       onClick={handleSend}
//       disabled={loading}
//       className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg disabled:opacity-50"
//     >
//       {loading ? "Sending..." : "Send Reset"}
//     </button>
//   </div>
// </div>
// </>

//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";

const ForgotPassword = () => {
  const [method, setMethod] = useState("email"); // email or phone
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contact.trim()) {
      toast.error(`Please enter your ${method}`);
      return;
    }

    try {
      setLoading(true);

      const payload =
        method === "email" ? { email: contact } : { phone: contact };

      const res = await axios.post(
        `${API}/api/auth/forgot-password`,
        payload
      );

      if (method === "email") {
        toast.success(
          "If the account exists, a password reset link has been sent to your email."
        );
        // Optionally redirect to a 'check your email' info page
      } else {
        toast.success("OTP sent to your phone.");
        navigate(`/reset-password-phone?phone=${encodeURIComponent(contact)}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <PageWrapper >
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <div className="bg-white/5 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Forgot Password
        </h1>

        {/* Method selector */}
        <div className="flex mb-6 bg-gray-100 rounded-lg overflow-hidden border border-gray-500">
          <button
            type="button"
            className={`w-1/2 py-2 font-semibold transition-all duration-200 ${
              method === "email"
                ? "bg-blue-900 text-white shadow-inner"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setMethod("email")}
          >
            📧 Email
          </button>
          <button
            type="button"
            className={`w-1/2 py-2 font-semibold transition-all duration-200 ${
              method === "phone"
                ? "bg-blue-900 text-white shadow-inner"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setMethod("phone")}
          >
            📱 Phone
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type={method === "email" ? "email" : "tel"}
            placeholder={
              method === "email"
                ? "Enter your email"
                : "Enter your phone number"
            }
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 transform ${
              loading
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-700 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {loading ? "⏳ Please wait..." : "🔑 Send Reset Instructions"}
          </button>
        </form>

        {/* Back to login */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Remembered your password?{" "}
          <a
            href="/login"
            className="text-blue-700 hover:underline hover:text-blue-800"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
    </PageWrapper>
    </>
  );
};

export default ForgotPassword;
