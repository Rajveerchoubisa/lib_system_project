import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { startBookingExpiryJob } from "./jobs/bookingexpiry.js";
import session from "express-session";
startBookingExpiryJob();

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // or whatever your frontend runs on
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: "rajveer", // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 5 * 60 * 1000, // 5 minutes
      secure: false, // set to true in production with HTTPS
      httpOnly: true,
    },
  })
);




app.use("/uploads", express.static("uploads"));
connectDB();


app.use("/api/auth", authRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Smart Library Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
