import Booking from "../models/booking.js";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";


const createBooking = async (req, res) => {
  try {
    const { joiningDate } = req.body;
     const months = parseInt(req.body.months);
    const userId = req.user._id;
  //   console.log("👉 Body:", req.body);
  //  console.log("👉 User:", req.user);

    if (!joiningDate || !months) {
      return res.status(400).json({ success: false, message: "Please enter the required fields" });
    }

    if (isNaN(months) || !Date.parse(joiningDate)) {
      return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    const existingBooking = await Booking.findOne({ userId });
    console.log("👉 Existing Booking:", existingBooking);
    if (existingBooking) {
      return res
        .status(400)
        .json({ success: false, message: "User already has a booking" });
    }

    const PRICE_PER_MONTH = 750;
    const price = months * PRICE_PER_MONTH;

    const booking = new Booking({
      joiningDate,
      expiryDate: new Date(new Date(joiningDate).setMonth(new Date(joiningDate).getMonth() + parseInt(months))),
      months,
      price,
      userId,
      paymentStatus: "pending",
      status: "active"
    });

    await booking.save();

    return res.status(201).json({
      success: true,
      booking,
    });

  } catch (error) {
    console.log("Booking error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};







export const updatePaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paymentStatus = "completed";
    booking.status = "active"; // or keep it if already active
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


// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount, currency = "INR", receipt } = req.body;

//     const options = {
//       amount: amount * 100, // in paise
//       currency,
//       receipt,
//       payment_capture: 1, // auto capture
//     };

//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (error) {
//     console.error("Razorpay order error:", error);
//     res.status(500).json({ message: "Failed to create Razorpay order" });
//   }
// };




export default createBooking;
