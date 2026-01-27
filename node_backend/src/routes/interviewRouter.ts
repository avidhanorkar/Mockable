import { Router } from "express";
import {
    createInterview,
    uploadInterviewRecording,
    getInterview,
    getInterviewHistory,
    deleteInterview
} from "../controller/interviewController";
import { authMiddleware } from "../middleware/authMiddleware";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), "uploads", "interviews");

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, "interview-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /webm|mp4|avi|mov|mkv|mp3|wav|m4a/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Only video and audio files are allowed"));
        }
    }
});

// All routes require authentication
router.use(authMiddleware);

// Create interview session
router.post("/create", createInterview);

// Upload interview recording
router.post("/:id/upload", upload.single("recording"), uploadInterviewRecording);

// Get interview by ID
router.get("/:id", getInterview);

// Get interview history
router.get("/", getInterviewHistory);

// Delete interview
router.delete("/:id", deleteInterview);

export default router;
