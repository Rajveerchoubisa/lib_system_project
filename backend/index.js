import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { startBookingExpiryJob } from "./jobs/bookingexpiry.js";
import session from "express-session";
import { razorpayWebhook } from "./controllers/paymentController.js";
import { ensureDefaultSeats } from "./services/seatSeeder.js";

dotenv.config();
const sessionSecret = process.env.SESSION_SECRET || process.env.JWT_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET or JWT_SECRET must be configured");
}
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL, // or whatever your frontend runs on
    credentials: true,
  })
);
app.post("/api/payment/webhook", express.raw({ type: "application/json" }), razorpayWebhook);
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 60 * 1000, // 5 minutes
      secure: false, // set to true in production with HTTPS
      httpOnly: true,
    },
  })
);





app.use("/api/auth", authRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Smart Library Backend Running");
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  await ensureDefaultSeats();
  startBookingExpiryJob();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
