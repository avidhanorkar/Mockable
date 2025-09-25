import { Router } from "express";
import questionRouter from "./questionRouter";

const router = Router();
router.use("/ques", questionRouter);

export default router;
