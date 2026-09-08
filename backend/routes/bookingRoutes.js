import express from "express";
import protect from "../middlewares/auth.js";
import {
  cancelHold,
  createPaymentOrder,
  createRenewOrder,
  getBooking,
  getMyBooking,
  getSeats,
  holdSeat,
  verifyPayment,
  verifyRenewPayment,
} from "../controllers/bookingController.js";

const router = express.Router();
router.get("/seats", getSeats);
router.get("/seats-left", getSeats);
router.get("/my", protect, getMyBooking);
router.get("/:bookingId", protect, getBooking);
router.post("/hold", protect, holdSeat);
router.post("/book", protect, holdSeat);
router.delete("/:bookingId/hold", protect, cancelHold);
router.post("/:bookingId/order", protect, createPaymentOrder);
router.post("/:bookingId/verify", protect, verifyPayment);
router.post("/renew/:bookingId/order", protect, createRenewOrder);
router.post("/renew/:bookingId/verify", protect, verifyRenewPayment);
export default router;
