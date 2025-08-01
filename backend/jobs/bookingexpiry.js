import cron from "node-cron"
import Booking from "../models/booking.js"

export const startBookingExpiryJob = () => {
  cron.schedule('0 0 * * *', async () => {
    const now = new Date()
    console.log("⏰ Running booking expiry check...")

    try {
      const expired = await Booking.updateMany(
        { expiryDate: { $lt: now }, status: "active" },
        { status: "expired" }
      )
      console.log(`✅ Expired ${expired.modifiedCount} bookings`)
    } catch (err) {
      console.error("❌ Error expiring bookings:", err)
    }
  })
}
