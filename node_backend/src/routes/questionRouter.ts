import { Router } from "express";
import genQue from "../controller/genQue";
import upload from "../middleware/handleUpload";

const questionRouter = Router();
questionRouter.post("/", upload.single("file"), genQue);

export default questionRouter;