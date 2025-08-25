import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";


export default function RenewForm() {
  const [booking, setBooking] = useState(null);
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API = import.meta.env.VITE_API_URL;

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

  // Fetch user's booking
  useEffect(() => {
    const load = async () => {
      try {
        setMessage("");
        if (!headers.Authorization) {
          setMessage("Please log in first.");
          return;
        }

        const { data } = await axios.get(`${API}/api/bookings/my`, { headers });

        const bookings = data.bookings || data;
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

      // 1) Ask backend to create Razorpay order
      const orderRes = await axios.post(
        `${API}/api/bookings/renew/${booking._id}/order`,
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
          try {
            const verifyRes = await axios.post(
              `${API}/api/bookings/renew/${booking._id}/verify`,
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
                `✅ Booking renewed! New expiry: ${new Date(
                  updated.expiryDate
                ).toLocaleDateString()} Check on the My Booking page`
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
      <PageWrapper>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-8">
        
        {/* Info box */}
        <div className="border bg-white/10 backdrop-blur-md border-white/10 rounded-xl p-4 sm:p-6 max-w-lg w-full text-center shadow mb-6">
          <p className="text-white/80 text-sm sm:text-base font-medium">
            🔔 Renew your library seating access here. <br />
            Pay securely and extend before expiry.
          </p>
        </div>

        {/* Form box */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg p-6 sm:p-8 max-w-sm w-full">
          <h3 className="text-lg sm:text-xl font-bold text-indigo-400 mb-5 flex items-center gap-2 justify-center">
            🔄 Renew Booking
          </h3>

          {booking ? (
            <>
              <div className="p-4 bg-white/10 rounded-lg shadow-sm mb-5 text-center">
                <p className="text-xs sm:text-sm text-white/70">Current Expiry</p>
                <p className="text-lg sm:text-xl font-semibold text-white mt-1">
                  {new Date(booking.expiryDate).toLocaleDateString()}
                </p>
              </div>

              <label className="block mb-5">
                <span className="text-xs sm:text-sm font-medium text-white">
                  Months to Add
                </span>
                <input
                  type="number"
                  min={1}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="mt-2 block w-full text-white rounded-lg border border-blue-400 bg-transparent shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-400 focus:ring-opacity-50 p-2 sm:p-3 text-sm sm:text-base"
                />
              </label>

              <button
                onClick={handleRenew}
                disabled={loading}
                className={`w-full py-2 sm:py-3 rounded-lg text-white font-semibold transition ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow"
                }`}
              >
                {loading ? "Processing..." : "💳 Pay & Renew"}
              </button>
            </>
          ) : (
            <p className="text-blue-400 text-sm">{message || "Loading booking..."}</p>
          )}

          {message && (
            <div className="mt-5 text-center">
              <p
                className={`text-sm sm:text-base font-medium mb-3 ${
                  message.includes("✅")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
      </PageWrapper>
    </>
  );
}
