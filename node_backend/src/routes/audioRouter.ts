import { Router } from "express";
import audioProxy from "../controller/audioProxy";

const audioRouter = Router();

// GET /v1/audio/proxy?url=<encoded-google-tts-url>
audioRouter.get("/proxy", audioProxy);

export default audioRouter;
