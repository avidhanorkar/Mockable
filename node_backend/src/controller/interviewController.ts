import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import Interview from "../models/interviewModel";
import { transcribeAudio } from "../services/transcriptionService";
import { analyzeQuestionResponse, generateOverallAnalysis } from "../services/analysisService";
import path from "path";
import fs from "fs";

/**
 * Create a new interview session
 */
export const createInterview = async (req: AuthRequest, res: Response) => {
    try {
        const { jobTitle, jobDescription, experience, techStack, questions } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!jobTitle || !jobDescription || !experience || !questions) {
            return res.status(400).json({
                message: "Job title, description, experience, and questions are required"
            });
        }

        const interview = await Interview.create({
            userId,
            jobTitle,
            jobDescription,
            experience,
            techStack: techStack || "",
            questions: questions.map((q: any) => ({
                question: q.question,
                audioUrl: q.audioUrl || ""
            })),
            status: "pending"
        });

        return res.status(201).json({
            message: "Interview session created successfully",
            interview
        });
    } catch (error: any) {
        console.error("Create interview error:", error);
        return res.status(500).json({
            message: "Failed to create interview session",
            error: error.message
        });
    }
};

/**
 * Upload and process interview recording
 */
export const uploadInterviewRecording = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const file = req.file;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Find interview
        const interview = await Interview.findOne({ _id: id, userId });
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        // Save file path
        const filePath = path.join("uploads", "interviews", file.filename);
        interview.videoPath = filePath;
        interview.status = "processing";
        await interview.save();

        // Start async processing (transcription + analysis)
        processInterviewAsync(id, filePath, interview.jobDescription);

        return res.status(200).json({
            message: "Recording uploaded successfully. Processing started.",
            interviewId: id
        });
    } catch (error: any) {
        console.error("Upload recording error:", error);
        return res.status(500).json({
            message: "Failed to upload recording",
            error: error.message
        });
    }
};

/**
 * Get interview by ID
 */
export const getInterview = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const interview = await Interview.findOne({ _id: id, userId });
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        return res.status(200).json({ interview });
    } catch (error: any) {
        console.error("Get interview error:", error);
        return res.status(500).json({
            message: "Failed to retrieve interview",
            error: error.message
        });
    }
};

/**
 * Get user's interview history
 */
export const getInterviewHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const interviews = await Interview.find({ userId })
            .sort({ createdAt: -1 })
            .select("-questions.transcript -questions.analysis");

        return res.status(200).json({ interviews });
    } catch (error: any) {
        console.error("Get interview history error:", error);
        return res.status(500).json({
            message: "Failed to retrieve interview history",
            error: error.message
        });
    }
};

/**
 * Delete interview
 */
export const deleteInterview = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const interview = await Interview.findOne({ _id: id, userId });
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        // Delete associated files
        if (interview.videoPath && fs.existsSync(interview.videoPath)) {
            fs.unlinkSync(interview.videoPath);
        }
        if (interview.audioPath && fs.existsSync(interview.audioPath)) {
            fs.unlinkSync(interview.audioPath);
        }

        await Interview.deleteOne({ _id: id });

        return res.status(200).json({ message: "Interview deleted successfully" });
    } catch (error: any) {
        console.error("Delete interview error:", error);
        return res.status(500).json({
            message: "Failed to delete interview",
            error: error.message
        });
    }
};

/**
 * Process interview asynchronously (transcription + analysis)
 */
const processInterviewAsync = async (
    interviewId: string,
    videoPath: string,
    jobDescription: string
) => {
    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) return;

        // For now, assume audio is extracted or video is the audio file
        // In production, you'd use ffmpeg to extract audio from video
        const audioPath = videoPath;

        // Transcribe audio
        console.log(`Transcribing interview ${interviewId}...`);
        const transcription = await transcribeAudio(audioPath);

        // Analyze the transcript
        console.log(`Analyzing interview ${interviewId}...`);
        const analysis = analyzeQuestionResponse(
            transcription.text,
            jobDescription,
            transcription.duration || 60
        );

        // Update interview with results
        interview.questions[0].transcript = transcription.text;
        interview.questions[0].analysis = {
            fillerWordCount: analysis.fillerWordCount,
            fillerWordPercentage: analysis.fillerWordPercentage,
            wordsPerMinute: analysis.wordsPerMinute,
            pauseDuration: 0,
            sentiment: analysis.sentiment,
            sentimentScore: analysis.sentimentScore,
            technicalAccuracy: analysis.technicalAccuracy,
            keywords: analysis.keywords
        };

        // Generate overall analysis
        const overallAnalysis = generateOverallAnalysis([analysis]);
        interview.overallScore = overallAnalysis.overallScore;
        interview.breakdown = overallAnalysis.breakdown;
        interview.insights = overallAnalysis.insights;
        interview.improvements = overallAnalysis.improvements;
        interview.status = "completed";
        interview.completedAt = new Date();

        await interview.save();
        console.log(`Interview ${interviewId} processed successfully`);
    } catch (error) {
        console.error(`Error processing interview ${interviewId}:`, error);

        // Update status to failed
        const interview = await Interview.findById(interviewId);
        if (interview) {
            interview.status = "failed";
            await interview.save();
        }
    }
};

export default {
    createInterview,
    uploadInterviewRecording,
    getInterview,
    getInterviewHistory,
    deleteInterview
};
