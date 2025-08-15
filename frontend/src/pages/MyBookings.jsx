// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { CalendarCheck, Clock, MapPin } from "lucide-react";
// import Navbar from "../components/Navbar";

// const dummyBookings = [
//   {
//     id: 1,
//     seat: "A12",
//     room: "Room 1",
//     date: "2025-07-01",
//     time: "10:00 AM - 1:00 PM",
//     status: "active",
//   },
//   {
//     id: 2,
//     seat: "B7",
//     room: "Room 2",
//     date: "2025-06-25",
//     time: "2:00 PM - 5:00 PM",
//     status: "past",
//   },
//   {
//     id: 3,
//     seat: "A4",
//     room: "Room 1",
//     date: "2025-06-20",
//     time: "9:00 AM - 12:00 PM",
//     status: "past",
//   },
// ];

// export default function MyBookings() {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     // Later replace this with actual backend call
//     setBookings(dummyBookings);
//   }, []);

//   return (
//     <>
//     <Navbar />
//     <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-20">
//       <h1 className="text-4xl mt-5 font-bold text-center mb-10">My Bookings</h1>

//       <div className="max-w-4xl mx-auto space-y-6">
//         {bookings.length === 0 ? (
//           <p className="text-center text-white/70">You have no bookings yet.</p>
//         ) : (
//           bookings.map((booking) => (
//             <motion.div
//               key={booking.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className={`p-6 rounded-xl border border-white/10 shadow-md backdrop-blur-md bg-white/5 flex flex-col gap-2 ${
//                 booking.status === "past" ? "opacity-60" : ""
//               }`}
//             >
//               <div className="flex justify-between items-center">
//                 <div className="text-lg font-semibold">
//                   {booking.room} - Seat {booking.seat}
//                 </div>
//                 <span
//                   className={`text-xs font-medium px-2 py-1 rounded-full ${
//                     booking.status === "active"
//                       ? "bg-green-500/20 text-green-400"
//                       : "bg-gray-500/20 text-gray-400"
//                   }`}
//                 >
//                   {booking.status === "active" ? "Upcoming" : "Past"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-4 text-sm text-white/80">
//                 <div className="flex items-center gap-1">
//                   <CalendarCheck className="w-4 h-4" /> {booking.date}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Clock className="w-4 h-4" /> {booking.time}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <MapPin className="w-4 h-4" /> {booking.room}
//                 </div>
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </div>
//     </>
//   );
// }



import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API}/api/bookings/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(data.bookings || []);
      } catch (error) {
        //toast.error((error.response?.data?.message || "Unknown error"));
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-20">
        <h1 className="text-4xl mt-5 font-bold text-center mb-10">My Bookings</h1>

        <div className="max-w-4xl mx-auto space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-center text-white/70">Loading your bookings...</p>
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-center justify-center items-center text-lg text-gray-200">You have no bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-6 rounded-xl border border-white/10 shadow-md backdrop-blur-md bg-white/5 flex flex-col gap-2 ${
                  booking.status === "past" ? "opacity-60" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">
                    Seat {booking.seatNumber || "N/A"}
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      booking.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {booking.status === "active" ? "Upcoming" : "Past"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <CalendarCheck className="w-4 h-4" />{" "}
                    {new Date(booking.joiningDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {booking.months} month(s)
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {booking.room || "Library"}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarCheck className="w-4 h-4" />{" "}
                    {new Date(booking.expiryDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
