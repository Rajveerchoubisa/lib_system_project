import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import LoginNavbar from "../components/LoginNavbar.jsx";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });


      localStorage.setItem("userInfo", JSON.stringify(res.data));
      toast.success("Registration successful! You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
            Create Your Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">
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

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-3.5 left-3 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition shadow-md"
            >
              Register
            </motion.button>
          </form>

          {/* Auth Switch Link */}
          <p className="text-center text-white/60 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
