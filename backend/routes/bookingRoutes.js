// import express from "express"
// import auth from "../middlewares/auth.js"
// import createBooking  from "../controllers/bookingController.js" // make sure export is named
// import { updatePaymentStatus,renewBooking,paymentSuccess,getBookingsByUser } from "../controllers/bookingController.js"
// import Booking from "../models/booking.js"
// import protect from "../middlewares/auth.js"

// const router = express.Router()

// // Use controller here
// router.post('/book',protect, createBooking);
// router.put("/:id/pay", updatePaymentStatus);
// router.get("/my",protect, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ userId: req.user._id });
//     res.json({ success: true, bookings });
//   } catch (error) {
//     console.error("Fetch bookings error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// router.post("/renew/:bookingId", renewBooking);
// router.post("/payment-success/:bookingId", paymentSuccess);
// router.get("/user/:userId",protect, getBookingsByUser);

// export default router;


// import express from "express";
// import protect from "../middlewares/auth.js";
// import createBooking, {
//   getMyBooking,
//   getBookingsByUser,
//   renewBooking,
//   paymentSuccess,
//   updatePaymentStatus,
// } from "../controllers/bookingController.js";

// const router = express.Router();

// router.post("/book", protect, createBooking);
// router.put("/:id/pay", protect, updatePaymentStatus);

// // Get bookings for logged-in user
// router.get("/my", protect, getMyBooking);

// // Admin / other usage: get bookings by arbitrary user id (protected)
// router.get("/user/:userId", protect, getBookingsByUser);

// // Renew and payment; protected
// // router.post("/renew/:bookingId", protect, renewBooking);
// // router.post("/payment-success/:bookingId", protect, paymentSuccess);



// router.post("/renew/:bookingId/order", protect, createRenewOrder);
// router.post("/renew/:bookingId/verify", protect, verifyRenewPayment);

// export default router;




import express from "express";
import protect from "../middlewares/auth.js";
import Booking from "../models/booking.js";
import createBooking, {
  getMyBooking,
  getBookingsByUser,
  updatePaymentStatus,
  // new:
  createRenewOrder,
  verifyRenewPayment,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book", protect, createBooking);
router.put("/:id/pay", protect, updatePaymentStatus);

// fetch bookings for logged-in user (you already had this as /my)
router.get("/my", protect, getMyBooking);

// Admin/utility
router.get("/user/:userId", protect, getBookingsByUser);

// NEW: Razorpay renewal flow
router.post("/renew/:bookingId/order", protect, createRenewOrder);
router.post("/renew/:bookingId/verify", protect, verifyRenewPayment);

router.get("/seats-left", async (req, res) => {
  try {
    const totalSeats = 60;

    // count only active bookings
    const bookedSeats = await Booking.countDocuments({ status: "active" });

    const availableSeats = totalSeats - bookedSeats;
    res.json({ success: true, availableSeats });
  } catch (err) {
    console.error("Seats left error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

