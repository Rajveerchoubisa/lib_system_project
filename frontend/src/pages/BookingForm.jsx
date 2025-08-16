import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BookingForm() {
  const [joiningDate, setJoiningDate] = useState("");
  const [months, setMonths] = useState(1);
  const [price, setPrice] = useState(500);
  const [bookingId, setBookingId] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(null);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setPrice(months * 750);
  }, [months]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const { data } = await axios.get(`${API}/api/bookings/seats-left`);
        if (data.success) {
          setAvailableSeats(data.availableSeats);
        }
      } catch (err) {
        console.error("Error fetching seats:", err);
      }
    };

    fetchSeats();

    // optional: auto-refresh every 5s
    const interval = setInterval(fetchSeats, 5000);
    return () => clearInterval(interval);
  }, [API]);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    if (!joiningDate) {
      toast.error("Please select a joining date.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API}/api/bookings/book`,
        { joiningDate, months },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setBookingId(data.booking._id);
        setPrice(data.booking.price);
        toast.success(`Booking created. Proceed to pay ₹${data.booking.price}`);
      } else {
        toast.error(data.message || "Booking failed.");
      }
    } catch (err) {
      console.error("Booking Error:", err);
      const msg = err.response?.data?.message || "Booking failed";
      toast.error(msg);
    }
  };

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    try {
      const { data } = await axios.post(`${API}/api/payment/create-order`, {
        amount: price,
      });

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      const options = {
        key,
        amount: data.amount,
        currency: data.currency,
        name: "Library Seat Booking",
        description: "Monthly Seat Reservation",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await axios.post(`${API}/api/payment/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            });

            toast.success("Payment successful!");
            setTimeout(() => navigate("/success"), 1500);
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "Rajveer",
          email: "rajveer@example.com",
        },
        theme: {
          color: "#1d4ed8",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Payment initiation failed");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center px-4">
        <div className="bg-[#1e293b]/90 p-8 rounded-3xl shadow-2xl w-full max-w-md text-white border border-blue-900/40">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-300">
            Book Your Seat
          </h2>

          {/* Joining Date */}
          <div className="mb-5">
            <label className="block mb-1 text-lg font-medium text-blue-200">
              Joining Date
            </label>
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0f172a]/60 text-white border border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Months */}
          <div className="mb-5">
            <label className="block mb-1 text-lg font-medium text-blue-200">
              Number of Months
            </label>
            <input
              type="number"
              min={1}
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
              className="w-full p-3 rounded-lg bg-[#0f172a]/60 text-white border border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Seats Left */}
          <p className="text-lg text-center mb-3">
            Seats Left:{" "}
            <span
              className={`font-bold ${
                availableSeats <= 5 ? "text-red-500" : "text-green-400"
              }`}
            >
              {availableSeats !== null ? availableSeats : "Loading..."}
            </span>
          </p>

          {/* Price */}
          <p className="text-lg font-semibold text-center mb-5">
            Total Price:{" "}
            <span className="text-blue-400 text-2xl">₹{price}</span>
          </p>

          {/* Booking Button */}
          <button
            onClick={handleBooking}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform"
          >
            Proceed to Booking
          </button>

          {/* Payment Button */}
          {bookingId && (
            <button
              onClick={handlePayment}
              className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform"
            >
              Pay Now (UPI/Card/Netbanking)
            </button>
          )}
        </div>
      </div>
    </>
  );
}
