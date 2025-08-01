import express from "express"
import auth from "../middlewares/auth.js"
import createBooking  from "../controllers/bookingController.js" // make sure export is named
import { updatePaymentStatus } from "../controllers/bookingController.js"
import Booking from "../models/booking.js"
import protect from "../middlewares/auth.js"

const router = express.Router()

// Use controller here
router.post('/book',protect,  createBooking);
router.put("/:id/pay", updatePaymentStatus);
router.get("/my",protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
