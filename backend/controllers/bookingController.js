import Booking from "../models/booking.js";
import { createReservationOrder, verifyCheckoutPayment } from "../services/paymentService.js";
import { createSeatHold, listSeats, releaseHold } from "../services/seatService.js";

function sendError(res, error) {
  console.error(error);
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode ? error.message : "Server error",
  });
}

export async function getSeats(req, res) {
  try {
    const seats = await listSeats();
    return res.json({ success: true, seats });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function holdSeat(req, res) {
  try {
    const booking = await createSeatHold({
      seatId: req.body.seatId,
      joiningDate: req.body.joiningDate,
      months: req.body.months,
      userId: req.user._id,
      idempotencyKey: req.get("Idempotency-Key") || undefined,
    });
    return res.status(201).json({ success: true, booking });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function cancelHold(req, res) {
  try {
    const booking = await releaseHold({ bookingId: req.params.bookingId, userId: req.user._id });
    if (!booking) return res.status(409).json({ success: false, message: "This hold can no longer be cancelled" });
    return res.json({ success: true, booking });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function createPaymentOrder(req, res) {
  try {
    const result = await createReservationOrder({
      bookingId: req.params.bookingId,
      userId: req.user._id,
      purpose: "reservation",
    });
    return res.json(result);
  } catch (error) {
    return sendError(res, error);
  }
}

export async function verifyPayment(req, res) {
  try {
    const booking = await Booking.findOne({ _id: req.params.bookingId, userId: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: "Reservation not found" });
    if (booking.payment?.orderId !== req.body.razorpay_order_id) {
      return res.status(400).json({ success: false, message: "Order does not belong to this reservation" });
    }
    const result = await verifyCheckoutPayment({
      orderId: req.body.razorpay_order_id,
      paymentId: req.body.razorpay_payment_id,
      signature: req.body.razorpay_signature,
    });
    return res.json({ success: true, booking: result.booking, duplicate: result.duplicate });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getMyBooking(req, res) {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("seatId")
      .sort({ createdAt: -1 });
    return res.json({ success: true, bookings });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getBooking(req, res) {
  try {
    const booking = await Booking.findOne({ _id: req.params.bookingId, userId: req.user._id }).populate("seatId");
    if (!booking) return res.status(404).json({ success: false, message: "Reservation not found" });
    return res.json({ success: true, booking });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function createRenewOrder(req, res) {
  try {
    const result = await createReservationOrder({
      bookingId: req.params.bookingId,
      userId: req.user._id,
      purpose: "renewal",
      months: Number(req.body.months),
    });
    return res.json(result);
  } catch (error) {
    return sendError(res, error);
  }
}

export const verifyRenewPayment = verifyPayment;
export default holdSeat;
