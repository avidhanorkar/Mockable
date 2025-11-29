import { Router } from "express";
import questionRouter from "./questionRouter";
import authRouter from "./authRouter";

const router = Router();
router.use("/ques", questionRouter);
router.use("/auth", authRouter);

export default router;
