import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import LoginNavbar from "../components/LoginNavbar.jsx";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page refresh
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      toast.success("You have successfully logged in!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <LoginNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
        <motion.div
          className="bg-white/5 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-wide">
            Welcome Back
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="relative">
              <FaEnvelope className="absolute top-3.5 left-3 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/50"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FaLock className="absolute top-3.5 left-3 text-white/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/50"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition shadow-md"
            >
              Login
            </motion.button>
          </form>

          {/* Auth Switch */}
          <p className="text-center text-white/60 text-sm mt-6">
            Not registered yet?{" "}
            <Link to="/register" className="text-indigo-400 hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
