import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as googleTTs from "google-tts-api";

const genQue = async (req: AuthRequest, res: Response) => {
    try {
        const file = req.file;
        const { JD, title, experience, additionalTopics } = req.body;

        // ✅ Input validation
        if (!file || !JD || !title || !experience) {
            return res.status(400).json({
                msg: "All fields are required",
            });
        }

        if (!process.env.GEMINI_KEY) {
            console.error("❌ GEMINI_KEY missing");
            return res.status(500).json({
                msg: "API key not configured",
            });
        }

        // ✅ Prompt
        let prompt = `Think of yourself as an interviewer and generate 10 interview questions 
based on the resume, job description: ${JD}, job title: ${title}, for a ${experience} level.

STRICT RULES:
- Return ONLY valid JSON
- No explanation, no markdown, no text outside JSON
- Format:
{
  "question": ["q1", "q2", ...],
  "additionalTopics": []
}`;

        if (additionalTopics && additionalTopics.length > 0) {
            prompt += `
Also generate 3 questions per topic from: ${JSON.stringify(additionalTopics)} 
and include them in "additionalTopics" array.`;
        }

        // ✅ Gemini setup
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // ✅ File handling
        if (!file.buffer) {
            return res.status(400).json({
                msg: "Invalid file upload",
            });
        }

        const filePart = {
            inlineData: {
                mimeType: "application/pdf",
                data: file.buffer.toString("base64"),
            },
        };

        // ✅ API call
        const result = await model.generateContent([
            { text: prompt },
            filePart,
        ]);

        const rawText = result.response.text();

        console.log("🧠 RAW GEMINI RESPONSE:", rawText);

        // ✅ Clean response (remove markdown if present)
        const cleanText = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let geminiResponse;

        // ✅ Safe JSON parsing
        try {
            geminiResponse = JSON.parse(cleanText);
        } catch (err) {
            console.error("❌ JSON PARSE ERROR:", err);
            return res.status(500).json({
                msg: "Invalid AI response format",
                raw: rawText,
            });
        }

        // ✅ Validate structure
        if (!geminiResponse.question || !Array.isArray(geminiResponse.question)) {
            console.error("❌ Invalid structure:", geminiResponse);
            return res.status(500).json({
                msg: "AI response missing questions",
            });
        }

        // ✅ Prepare audio response
        const audioUrl = {
            question: [] as any[],
            additionalTopics: geminiResponse.additionalTopics || [],
        };

        for (let item of geminiResponse.question) {
            if (typeof item !== "string") continue; // skip bad data

            try {
                const urls = googleTTs.getAllAudioUrls(item, {
                    lang: "en",
                    slow: false,
                    host: "https://translate.google.com",
                });

                audioUrl.question.push(urls);
            } catch (err) {
                console.error("❌ TTS ERROR:", err);
            }
        }

        return res.status(200).json({
            audioUrl,
        });

    } catch (error: any) {
        console.error("🔥 Error in Generating Questions:", error);

        return res.status(500).json({
            msg: error?.message || "Internal Server Error",
            detail: error?.toString()
        });
    }
};

export default genQue;