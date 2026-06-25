import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);

interface TranscriptionResult {
    text: string;
    duration?: number;
    language?: string;
}

/**
 * Transcribe audio file using Gemini API (FREE!)
 * @param audioPath - Path to the audio file
 * @returns Transcription result with text and metadata
 */
export const transcribeAudio = async (audioPath: string): Promise<TranscriptionResult> => {
    try {
        if (!process.env.GEMINI_KEY) {
            throw new Error("GEMINI_KEY is not set in environment variables");
        }

        // Check if file exists
        if (!fs.existsSync(audioPath)) {
            throw new Error(`Audio file not found: ${audioPath}`);
        }

        // Read audio file as base64
        const audioBuffer = fs.readFileSync(audioPath);
        const audioBase64 = audioBuffer.toString("base64");

        // Determine MIME type based on file extension
        const ext = audioPath.split('.').pop()?.toLowerCase();
        const mimeTypes: { [key: string]: string } = {
            'mp3': 'audio/mp3',
            'wav': 'audio/wav',
            'webm': 'audio/webm',
            'm4a': 'audio/mp4',
            'mp4': 'video/mp4',
            'avi': 'video/x-msvideo',
            'mov': 'video/quicktime'
        };
        const mimeType = mimeTypes[ext || 'mp3'] || 'audio/mp3';

        // Use Gemini to transcribe
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent([
            {
                text: "Transcribe this audio/video file. Provide ONLY the transcription text, nothing else. Do not add any commentary, just the exact words spoken."
            },
            {
                inlineData: {
                    mimeType: mimeType,
                    data: audioBase64
                }
            }
        ]);

        const transcriptionText = result.response.text().trim();

        return {
            text: transcriptionText,
            duration: undefined, // Gemini doesn't provide duration
            language: "en"
        };
    } catch (error: any) {
        console.error("Transcription error:", error);
        throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
};

/**
 * Transcribe audio with Gemini (timestamps not available, but it's FREE!)
 * @param audioPath - Path to the audio file
 * @returns Transcription text
 */
export const transcribeWithTimestamps = async (audioPath: string) => {
    // Gemini doesn't provide word-level timestamps, but we can still transcribe
    const result = await transcribeAudio(audioPath);
    return {
        text: result.text,
        language: result.language
    };
};

export default {
    transcribeAudio,
    transcribeWithTimestamps
};
