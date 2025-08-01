import { Link } from "react-router-dom";
import { CheckCircle2, Home, BookOpen } from "lucide-react"; // Icons

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4">
      <div className="bg-[#1e293b]/90 p-8 rounded-3xl shadow-2xl text-center border border-green-500/30 max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-400 animate-pulse" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-extrabold text-green-400 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-300 mb-8 text-lg">
          Your booking has been confirmed. Thank you for choosing our library.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/my-bookings"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
          >
            <BookOpen className="w-5 h-5" /> View My Bookings
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
          >
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
