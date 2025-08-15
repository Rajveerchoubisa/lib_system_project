// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function RenewForm() {
//   const [bookingId, setBookingId] = useState(null);
//   const [months, setMonths] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Fetch user's latest booking
//   useEffect(() => {
//     const fetchBooking = async () => {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//         const userId = userInfo?._id;
//         if (!userId) return setMessage("User not logged in!");

//         const { data } = await axios.get(
//           `http://localhost:5000/api/bookings/user/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${userInfo?.token}`,
//             },
//           }
//         );
//         setBookingId(data.bookings._id);
//         console.log(data.bookings._id); // pick latest booking
//       } catch (error) {
//         console.error(error);
//         setMessage("Failed to fetch bookings.");
//       }
//     };

//     fetchBooking();
//   }, []);

//   const handleRenew = async () => {
//     if (!bookingId) return setMessage("Booking ID not found!");

//     try {
//       setLoading(true);
//       setMessage("");

//       // Renew booking
//       const { data } = await axios.post(
//         `http://localhost:5000/api/bookings/renew/${bookingId}`,
//         { months: Number(months) }
//       );

//       // Mark payment as success
//       await axios.post(
//         `http://localhost:5000/api/bookings/payment-success/${bookingId}`
//       );

//       setMessage(
//         `Booking renewed! New expiry: ${new Date(
//           data.booking.expiryDate
//         ).toLocaleDateString()}`
//       );
//     } catch (error) {
//       console.error(error);
//       setMessage(error.response?.data?.message || "Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-yellow-100 rounded-lg max-w-sm">
//       <h3 className="font-semibold mb-2">Renew Booking</h3>

//       <input
//         type="number"
//         min={1}
//         value={months}
//         onChange={(e) => setMonths(Number(e.target.value))}
//         className="border p-2 w-full mb-2"
//       />

//       <button
//         onClick={handleRenew}
//         disabled={loading || !bookingId}
//         className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
//       >
//         {loading ? "Processing..." : "Renew"}
//       </button>

//       {message && <p className="mt-2 text-green-700">{message}</p>}
//     </div>
//   );
// }

// RenewForm.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"

export default function RenewForm() {
  const [booking, setBooking] = useState(null);
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userInfo = (() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo"));
    } catch {
      return null;
    }
  })();

  const headers = userInfo?.token
    ? { Authorization: `Bearer ${userInfo.token}` }
    : {};

  // Fetch user's booking (assumes 1 booking per user)
  useEffect(() => {
    const load = async () => {
      try {
        setMessage("");
        if (!headers.Authorization) {
          setMessage("Please log in first.");
          return;
        }

        const { data } = await axios.get(
          "http://localhost:5000/api/bookings/my",
          { headers }
        );

        const bookings = data.bookings || data; // support either shape
        if (Array.isArray(bookings) && bookings.length > 0) {
          setBooking(bookings[0]);
        } else if (bookings && bookings._id) {
          setBooking(bookings);
        } else {
          setMessage("No booking found for this account.");
        
        }
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || "Failed to load booking.");
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRenew = async () => {
    if (!booking?._id) return setMessage("Booking not loaded.");
    if (!months || months < 1) return setMessage("Enter months ≥ 1");

    try {
      setLoading(true);
      setMessage("");

      // 1) Ask backend to create Razorpay order for the renewal
      const orderRes = await axios.post(
        `http://localhost:5000/api/bookings/renew/${booking._id}/order`,
        { months: Number(months) },
        { headers }
      );

      const { success, orderId, amount, currency, keyId } = orderRes.data;
      if (!success) {
        setLoading(false);
        return setMessage("Failed to start payment.");
      }

      // 2) Open Razorpay Checkout
      if (!window.Razorpay) {
        setLoading(false);
        return setMessage("Razorpay SDK not loaded.");
      }

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "SmartLibrary",
        description: "Booking Renewal",
        order_id: orderId,
        prefill: {
          name: userInfo?.name || "",
          email: userInfo?.email || "",
          contact: userInfo?.phone || "",
        },
        handler: async (response) => {
          // 3) Verify payment + extend booking on server
          try {
            const verifyRes = await axios.post(
              `http://localhost:5000/api/bookings/renew/${booking._id}/verify`,
              {
                months: Number(months),
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers }
            );

            if (verifyRes.data.success) {
              const updated = verifyRes.data.booking;
              setBooking(updated);
              setMessage(
                `Booking renewed! New expiry: ${new Date(
                  updated.expiryDate
                ).toLocaleDateString()}`
              );
            } else {
              setMessage(verifyRes.data.message || "Verification failed.");
            }
          } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Verification error.");
          } finally {
            setLoading(false);
          }
        },
        theme: { color: "#2563eb" },
      });

      rzp.on("payment.failed", (resp) => {
        console.warn("Payment failed:", resp.error);
        setLoading(false);
        setMessage(resp.error?.description || "Payment failed.");
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Could not start renewal.");
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full">
      <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
        🔄 Renew Booking
      </h3>

      {booking ? (
        <>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-4">
            <p className="text-sm text-blue-600">Current expiry date:</p>
            <p className="text-lg font-semibold text-blue-900">
              {new Date(booking.expiryDate).toLocaleDateString()}
            </p>
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-blue-800">Months to Add</span>
            <input
              type="number"
              min={1}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="mt-1 block w-full rounded-lg border border-blue-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
            />
          </label>

          <button
            onClick={handleRenew}
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow"
            }`}
          >
            {loading ? "Processing..." : "💳 Pay & Renew"}
          </button>
        </>
      ) : (
        <p className="text-blue-200 text-sm">{message || "Loading booking..."}</p>
      )}

      {message && (
        <div className="mt-4 text-center">
          <p
            className={`text-sm font-medium mb-3 ${
              message.toLowerCase().includes("error")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>

          {/* Show "Go to My Booking" only if renewal success */}
          {message.toLowerCase().includes("booking renewed") && (
            <a
              href="/my-booking"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              📚 Go to My Booking
            </a>
          )}
        </div>
      )}
    </div>
  </div>
  </>
  );
}
