import { Router } from "express";
import questionRouter from "./questionRouter";
import authRouter from "./authRouter";
import interviewRouter from "./interviewRouter";

const router = Router();
router.use("/ques", questionRouter);
router.use("/auth", authRouter);
router.use("/interview", interviewRouter);

export default router;
