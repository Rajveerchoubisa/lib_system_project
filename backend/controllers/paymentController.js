import crypto from "crypto";
import { processSuccessfulPayment, signaturesMatch } from "../services/paymentService.js";

export async function razorpayWebhook(req, res) {
  const signature = req.get("x-razorpay-signature");
  const rawBody = req.body;
  if (!Buffer.isBuffer(rawBody)) {
    return res.status(400).json({ success: false, message: "Webhook requires a raw request body" });
  }
  if (!signaturesMatch(rawBody, signature, process.env.RAZORPAY_WEBHOOK_SECRET)) {
    return res.status(400).json({ success: false, message: "Invalid webhook signature" });
  }

  const event = JSON.parse(rawBody.toString("utf8"));
  if (!["payment.captured", "order.paid"].includes(event.event)) {
    return res.status(200).json({ success: true, ignored: true });
  }

  const payment = event.payload?.payment?.entity;
  const order = event.payload?.order?.entity;
  const orderId = payment?.order_id || order?.id;
  const paymentId = payment?.id || order?.payments?.[0];
  if (!orderId || !paymentId) {
    return res.status(400).json({ success: false, message: "Webhook is missing order or payment data" });
  }

  const eventId = req.get("x-razorpay-event-id") || crypto.createHash("sha256").update(rawBody).digest("hex");
  try {
    const result = await processSuccessfulPayment({ orderId, paymentId, eventId, eventType: event.event });
    return res.status(200).json({ success: true, duplicate: result.duplicate });
  } catch (error) {
    console.error("Razorpay webhook processing error:", error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
}
