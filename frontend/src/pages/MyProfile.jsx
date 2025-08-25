import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { UserCircle2, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API}/api/auth/my-profile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data);
      } catch (error) {
        toast.error(
          "Error fetching user profile: " +
            (error.response?.data?.message || "Unknown error")
        );
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white text-lg font-medium">
        <div className="mb-4">Loading your profile...</div>
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <PageWrapper>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl hover:shadow-indigo-600/30 transition-all duration-300"
        >
          <div className="flex flex-col items-center">
            <UserCircle2 className="w-20 h-20 text-indigo-400 mb-4" />
            <h2 className="text-2xl font-bold mb-1 text-indigo-300">
              {user.name}
            </h2>
            <p className="text-white/70 text-sm mb-8">Library Member</p>

            <div className="w-full space-y-5 text-white/90 text-lg">
              {user.email ? (
                <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-lg hover:bg-white/10 transition">
                  <Mail className="w-5 h-5 text-indigo-300" />
                  <p>{user.email}</p>
                </div>
              ) : user.phone ? (
                <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-lg hover:bg-white/10 transition">
                  <span className="text-indigo-300 font-medium">📱</span>
                  <p>{user.phone}</p>
                </div>
              ) : (
                <p className="text-red-400">No contact information available</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      </PageWrapper>
    </>
  );
}
