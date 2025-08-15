import { Link, useNavigate } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function DashboardNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate()

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
    navigate("/login");
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0f0c29]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="text-white text-2xl font-bold tracking-tight">
          Smart<span className="text-indigo-400">Library</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6 text-white text-sm font-medium">
          <Link to="/dashboard" className="hover:text-indigo-400 transition">Home</Link>
          <Link to="/bookings" className="hover:text-indigo-400 transition">Book Seat</Link>
          <Link to="/my-bookings" className="hover:text-indigo-400 transition">My Bookings</Link>
          <Link to="/renew" className="hover:text-indigo-400 transition">Renew Booking</Link>
        </nav>

        {/* User Section */}
        <div className="relative flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-white cursor-pointer hidden md:inline-flex"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <UserCircle className="w-6 h-6" />
          </motion.div>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-16 top-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-lg py-2 w-40 text-sm text-white"
            >
              <Link
                to="/my-profile"
                className="block px-4 py-2 hover:bg-white/20 transition"
                onClick={() => setShowDropdown(false)}
              >
                My Profile
              </Link>
            </motion.div>
          )}

          <button
            onClick={handleLogOut} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition shadow"
          >
            <LogOut    className="w-4 h-4"  />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
