import { Router } from "express";
import questionRouter from "./questionRouter";
import authRouter from "./authRouter";
import interviewRouter from "./interviewRouter";
import audioRouter from "./audioRouter";

const router = Router();
router.use("/ques", questionRouter);
router.use("/auth", authRouter);
router.use("/interview", interviewRouter);
router.use("/audio", audioRouter);

export default router;
