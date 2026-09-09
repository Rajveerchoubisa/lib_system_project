import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { expireReservations, startBookingExpiryJob } from "./jobs/bookingexpiry.js";
import { razorpayWebhook } from "./controllers/paymentController.js";
import { ensureDefaultSeats } from "./services/seatSeeder.js";

const app = express();
const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    const allowed = !origin || configuredOrigins.includes(origin) || /^https:\/\/[-a-z0-9]+\.vercel\.app$/i.test(origin);
    callback(allowed ? null : new Error("Origin is not allowed by CORS"), allowed);
  },
  credentials: false,
}));

let databaseReady;
app.use(async (req, res, next) => {
  try {
    databaseReady ||= connectDB().then(ensureDefaultSeats);
    await databaseReady;
    next();
  } catch (error) {
    databaseReady = undefined;
    next(error);
  }
});

// This route must receive the exact bytes sent by Razorpay.
app.post("/api/payment/webhook", express.raw({ type: "application/json" }), razorpayWebhook);
app.use(express.json({ limit: "100kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/health", (req, res) => res.json({ success: true, service: "smart-library-api" }));
app.get("/api/cron/expire-reservations", async (req, res) => {
  if (!process.env.CRON_SECRET || req.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  return res.json({ success: true, ...(await expireReservations()) });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ success: false, message: "Internal server error" });
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
  startBookingExpiryJob();
}

export default app;
