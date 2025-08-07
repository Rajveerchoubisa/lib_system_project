import { motion } from "framer-motion";
import { BookOpenCheck, LogIn, Users } from "lucide-react";
import { Link } from "react-router-dom";
import LoginNavbar from "../components/LoginNavbar";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      <LoginNavbar />

      <div className="pt-35 max-w-7xl mx-auto px-6 pb-20 flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Hero Section */}
        <motion.div
          className="max-w-2xl"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Reserve. Relax. Read.
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
            Discover a smarter way to manage your library time. Seamlessly{" "}
            <span className="text-orange-400 font-semibold">
              book your seat 
            </span>
            , explore your favorite{" "}
            <span className="text-orange-400 font-semibold">books</span>, make
            quick payments, and easily download receipts – all from one
            intuitive platform.
          </p>

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-700 text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
            >
              Get Started →
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature Illustration */}
        <motion.div
          className="w-full lg:w-[480px] bg-white/10 rounded-2xl p-8 backdrop-blur-lg border border-white/20 shadow-xl"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-white text-center">
            Why SmartLibrary?
          </h3>
          <div className="space-y-6">
            <Feature
              icon={<BookOpenCheck className="w-6 h-6" />}
              title="Live Seat Booking"
              desc="Instant access to real-time availability across all rooms."
            />
            <Feature
              icon={<Users className="w-6 h-6" />}
              title="Multi-Room Zones"
              desc="Explore & book seats in different quiet/study rooms easily."
            />
            <Feature
              icon={<LogIn className="w-6 h-6" />}
              title="Fast Login & Receipt"
              desc="Quick sign-in and downloadable booking confirmation."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <motion.div
      className="flex items-start gap-4"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white text-indigo-600 p-2 rounded-md shadow-sm">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-white text-lg">{title}</h4>
        <p className="text-white/70 text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}
