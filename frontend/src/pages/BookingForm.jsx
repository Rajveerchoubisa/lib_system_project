import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx"

export default function BookingForm() {
  const [joiningDate, setJoiningDate] = useState('');
  const [months, setMonths] = useState(1);
  const [price, setPrice] = useState(500); 
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const PRICE_PER_MONTH = 500;
    setPrice(months * PRICE_PER_MONTH);
  }, [months]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/bookings/book',
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
        alert(`✅ Booking Created. Proceed to pay ₹${data.booking.price}`);
      } else {
        alert("❌ Booking failed");
      }
    } catch (err) {
      console.error('Booking Error:', err);
      alert('❌ Booking failed');
    }
  };

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: price,
      });

      const options = {
        key: "rzp_test_K5ZFACcn9npVuG",
        amount: data.amount,
        currency: data.currency,
        name: "Library Seat Booking",
        description: "Monthly Seat Reservation",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await axios.post("http://localhost:5000/api/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            });

            alert("✅ Payment Verified & Booking Confirmed!");
            navigate("/success");  // Redirect to success page
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("❌ Payment verification failed");
          }
        },
        prefill: {
          name: "Rajveer",
          email: "rajveer@example.com"
        },
        theme: {
          color: "#1d4ed8"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('Payment Error:', err);
      alert('❌ Payment initiation failed');
    }
  };

return (
  <>
  <Navbar />
  <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center px-4">
    <div className="bg-[#1e293b]/90 p-8 rounded-3xl shadow-2xl w-full max-w-md text-white border border-blue-900/40">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-300">
        Book Your Seat
      </h2>

      {/* Joining Date */}
      <div className="mb-5">
        <label className="block mb-1 text-lg font-medium text-blue-200">Joining Date</label>
        <input
          type="date"
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#0f172a]/60 text-white placeholder-gray-400 border border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />
      </div>

      {/* Months */}
      <div className="mb-5">
        <label className="block mb-1 text-lg font-medium text-blue-200">Number of Months</label>
        <input
          type="number"
          min={1}
          value={months}
          onChange={(e) => setMonths(parseInt(e.target.value))}
          className="w-full p-3 rounded-lg bg-[#0f172a]/60 text-white placeholder-gray-400 border border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />
      </div>

      {/* Price */}
      <p className="text-lg font-semibold text-center mb-5">
        Total Price: <span className="text-blue-400 text-2xl">₹{price}</span>
      </p>

      {/* Proceed to Booking */}
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
