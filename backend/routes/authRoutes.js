import express from "express";
import { registerUser,loginUser, getProfile,sendOTP,verifyOTP } from "../controllers/AuthController.js";
import { forgotPassword, resetPasswordWithToken, resetPasswordWithOtp } from "../controllers/forgotpasswordController.js";
import protect from "../middlewares/auth.js"

const router = express.Router();


router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/my-profile", protect,getProfile);




router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPasswordWithToken);
router.post("/reset-password-phone", resetPasswordWithOtp);



export default router;