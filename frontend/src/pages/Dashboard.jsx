import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpenCheck, CalendarCheck, ReceiptText, Users } from "lucide-react";
import Navbar from "../components/Navbar.jsx";


export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen  bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-6 py-12 text-white">
        <div className="mt-16">
          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16">
            <Card
              title="Live Seat Booking"
              icon={<BookOpenCheck />}
              desc="Book seats in real-time."
              color="indigo"
            />
            <Card
              title="Multi-Room Access"
              icon={<Users />}
              desc="Choose between study zones."
              color="violet"
            />
            <Card
              title="Booking Receipts"
              icon={<ReceiptText />}
              desc="Download your receipts."
              color="pink"
            />
            <Card
              title="My Reservations"
              icon={<CalendarCheck />}
              desc="Manage upcoming bookings."
              color="purple"
            />
          </div>

          {/* Seat Booking Preview */}
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-3">Book Your Seat</h2>
              <p className="text-white/70 mb-6">
                Easily browse and select your preferred seat.
              </p>
              <Link
                to="/bookings"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md transition"
              >
                Proceed to Booking
              </Link>
            </motion.div>

            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-64 rounded-xl overflow-hidden shadow-xl border border-white/10"
            >
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"
                alt="Bookshelves in Library"
                className="object-cover w-full h-full opacity-80"
              />
              
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Link
                  to="/books"
                  className="text-2xl font-semibold text-white backdrop-blur-sm px-4 py-2 rounded-lg hover:underline hover:text-indigo-300 transition"
                >
                  📚 Books Coming Soon
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

function Card({ title, icon, desc, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-md shadow-md flex flex-col items-start"
    >
      <div
        className={`p-3 bg-${color}-500/20 text-${color}-400 rounded-full mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-white/70 text-sm">{desc}</p>
    </motion.div>
  );
}
