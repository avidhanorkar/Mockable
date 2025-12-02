import express from "express";
import { register, login, getMe, googleAuth } from "../controller/authController";
import authenticate from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/google", googleAuth);

export default router;