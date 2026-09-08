import express from "express";

const router = express.Router();
router.all("/{*path}", (req, res) => {
  res.status(410).json({ success: false, message: "Use the reservation checkout API" });
});
export default router;
