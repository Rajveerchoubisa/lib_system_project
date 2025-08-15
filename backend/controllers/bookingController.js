// import Booking from "../models/booking.js";
// import mongoose from "mongoose";

// import dotenv from "dotenv";
// dotenv.config();
// import Razorpay from "razorpay";


// const createBooking = async (req, res) => {
//   try {
//     const { joiningDate } = req.body;
//      const months = parseInt(req.body.months);
//     const userId = req.user._id;
//   //   console.log("👉 Body:", req.body);
//   //  console.log("👉 User:", req.user);

//     if (!joiningDate || !months) {
//       return res.status(400).json({ success: false, message: "Please enter the required fields" });
//     }

//     if (isNaN(months) || !Date.parse(joiningDate)) {
//       return res.status(400).json({ success: false, message: "Invalid input data" });
//     }

//     const existingBooking = await Booking.findOne({ userId });
//     console.log("👉 Existing Booking:", existingBooking);
//     if (existingBooking) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User already has a booking" });
//     }

//     const PRICE_PER_MONTH = 750;
//     const price = months * PRICE_PER_MONTH;

//     const booking = new Booking({
//       joiningDate,
//       expiryDate: new Date(new Date(joiningDate).setMonth(new Date(joiningDate).getMonth() + parseInt(months))),
//       months,
//       price,
//       userId,
//       paymentStatus: "pending",
//       status: "active"
//     });

//     await booking.save();

//     return res.status(201).json({
//       success: true,
//       booking,
//     });

//   } catch (error) {
//     console.log("Booking error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };







// export const updatePaymentStatus = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     booking.paymentStatus = "completed";
//     booking.status = "active"; // or keep it if already active
//     await booking.save();

//     res.json({ message: "Payment successful", booking });
//   } catch (err) {
//     console.error("Payment update error:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


// export const renewBooking = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { months } = req.body;

//     const booking = await Booking.findOne({ userId });
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     // Extend expiry date
//     const currentExpiry = new Date(booking.expiryDate);
//     currentExpiry.setMonth(currentExpiry.getMonth() + parseInt(months));
//     booking.expiryDate = currentExpiry;

//     await booking.save();
//     res.json({ booking });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// export const paymentSuccess = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const booking = await Booking.findOne({ userId });
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     booking.isPaid = true; // mark as paid
//     await booking.save();

//     res.json({ message: "Payment recorded successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getBookingsByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const bookings = await Booking.find({ userId });

//     if (!bookings || bookings.length === 0) {
//       return res.status(404).json({ message: "No bookings found" });
//     }

//     res.json({ bookings });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


// // export const createRazorpayOrder = async (req, res) => {
// //   try {
// //     const { amount, currency = "INR", receipt } = req.body;

// //     const options = {
// //       amount: amount * 100, // in paise
// //       currency,
// //       receipt,
// //       payment_capture: 1, // auto capture
// //     };

// //     const order = await razorpay.orders.create(options);
// //     res.json(order);
// //   } catch (error) {
// //     console.error("Razorpay order error:", error);
// //     res.status(500).json({ message: "Failed to create Razorpay order" });
// //   }
// // };




// export default createBooking;





// controllers/bookingController.js
import Booking from "../models/booking.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
// controllers/bookingController.js
import crypto from "crypto";
import Razorpay from "razorpay";


const PRICE_PER_MONTH = 750; 
dotenv.config();
// import Razorpay if you need it (left out of flow for clarity)

// keep consistent with createBooking logic

// Create booking (existing logic, minor cleanup)
const createBooking = async (req, res) => {
  try {
    const { joiningDate } = req.body;
    const months = parseInt(req.body.months);
    const userId = req.user._id;

    if (!joiningDate || !months || isNaN(months)) {
      return res.status(400).json({ success: false, message: "Please enter the required fields" });
    }

    const existingBooking = await Booking.findOne({ userId });
    if (existingBooking) {
      return res.status(400).json({ success: false, message: "User already has a booking" });
    }

    const price = months * PRICE_PER_MONTH;
    const expiryDate = new Date(new Date(joiningDate).setMonth(new Date(joiningDate).getMonth() + months));

    const booking = new Booking({
      joiningDate,
      expiryDate,
      months,
      price,
      userId,
      paymentStatus: "pending",
      status: "active",
    });

    await booking.save();

    return res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/bookings/my  -> booking(s) for logged-in user
export const getMyBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ userId });
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: "No bookings found" });
    }
    // If you guarantee one per user, return that direct object:
    return res.json({ success: true, bookings });
  } catch (err) {
    console.error("getMyBooking error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/bookings/user/:userId  -> admin or other usage
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId });
    return res.json({ success: true, bookings });
  } catch (err) {
    console.error("getBookingsByUser error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/bookings/renew/:bookingId
export const renewBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const months = parseInt(req.body.months) || 1;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid booking id" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // Security: ensure requester owns the booking
    if (req.user && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to renew this booking" });
    }

    // Extend expiry date
    const currentExpiry = new Date(booking.expiryDate);
    currentExpiry.setMonth(currentExpiry.getMonth() + months);
    booking.expiryDate = currentExpiry;

    // Update months and price (incremental)
    booking.months = (booking.months || 0) + months;
    booking.price = (booking.price || 0) + months * PRICE_PER_MONTH;

    // Mark paymentStatus pending for this renewal (payment must follow)
    booking.paymentStatus = "pending";
    booking.status = "active";

    await booking.save();

    return res.json({ success: true, booking });
  } catch (error) {
    console.error("renewBooking error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/bookings/payment-success/:bookingId
export const paymentSuccess = async (req, res) => {
  try {
    const { bookingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid booking id" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // Security: ensure requester owns the booking
    if (req.user && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    booking.paymentStatus = "completed";
    booking.status = "active";
    await booking.save();

    return res.json({ success: true, message: "Payment recorded successfully", booking });
  } catch (error) {
    console.error("paymentSuccess error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Optional: existing updatePaymentStatus (kept for compatibility)
export const updatePaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paymentStatus = "completed";
    booking.status = "active";
    await booking.save();

    res.json({ message: "Payment successful", booking });
  } catch (err) {
    console.error("Payment update error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};








const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /api/bookings/renew/:bookingId/order
 * Body: { months: number }
 * Returns: { orderId, amount, currency, keyId }
 * Does NOT mutate booking yet. Only creates order.
 */
export const createRenewOrder = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const months = parseInt(req.body.months) || 1;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // Security: ensure user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to renew this booking" });
    }

    const amountPaise = months * PRICE_PER_MONTH * 100; // Razorpay takes paise
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `rec_${Date.now()}`,
      notes: {
        bookingId: bookingId.toString(),
        userId: req.user._id.toString(),
        months: months.toString(),
        purpose: "booking_renewal",
      },
    });

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // so frontend can init checkout
      bookingId,
      months,
    });
  } catch (err) {
    console.error("createRenewOrder error:", err);
    return res.status(500).json({ success: false, message: "Failed to create renew order" });
  }
};

/**
 * POST /api/bookings/renew/:bookingId/verify
 * Body: { months, razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Verifies signature, THEN extends booking and marks payment completed.
 */
export const verifyRenewPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { months, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Verify signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Signature OK -> extend booking
    const m = parseInt(months) || 1;
    const currentExpiry = new Date(booking.expiryDate);
    currentExpiry.setMonth(currentExpiry.getMonth() + m);
    booking.expiryDate = currentExpiry;

    booking.months = (booking.months || 0) + m;
    booking.price = (booking.price || 0) + m * PRICE_PER_MONTH;

    booking.paymentStatus = "completed";
    booking.status = "active";

    // (Optional) keep a payment history array if your schema allows it
    // booking.paymentHistory = booking.paymentHistory || [];
    // booking.paymentHistory.push({
    //   type: "renewal",
    //   months: m,
    //   amount: m * PRICE_PER_MONTH,
    //   paymentId: razorpay_payment_id,
    //   orderId: razorpay_order_id,
    //   at: new Date(),
    // });

    await booking.save();

    return res.json({ success: true, message: "Renewal completed", booking });
  } catch (err) {
    console.error("verifyRenewPayment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export default createBooking;
