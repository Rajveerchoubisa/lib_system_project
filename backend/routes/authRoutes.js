import express from "express";
import { registerUser,loginUser, getProfile } from "../controllers/AuthController.js";
import protect from "../middlewares/auth.js"

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/my-profile", protect,getProfile);


export default router;