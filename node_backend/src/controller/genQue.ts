import { Response } from "express"
import { AuthRequest } from "../types/AuthRequest";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as googleTTs from "google-tts-api";

const genQue = async (req: AuthRequest, res: Response) => {
    try {

        const file = req.file;
        const { JD, title, experience, additionalTopics } = req.body;

        if (!file || !JD || !title || !experience) {
            return res.status(400).json({
                msg: "All fields are required",
            });
        }

        let prompt = `Think of yourself as an interviewer and I want you to generate 10 interview questions 
based on the resume uploaded, job description: ${JD} and Job title: ${title}, for a ${experience} level. Also note that I want No bs just straight up question as a numbered list! I want the response in a predefined format of {question: {generated questions in an array}, additionalTopics: {generated questions in an array}}`;

        if (additionalTopics && additionalTopics.length > 0) {
            prompt += ` Also generate 3 questions per element in this array: ${additionalTopics}`;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const filePart = {
            inlineData: {
                mimeType: "application/pdf",
                data: file.buffer.toString("base64"),
            },
        };

        const result = await model.generateContent([
            { text: prompt },
            filePart,
        ]);

        const geminiResponse = JSON.parse(result.response.text().replace("```json", "").replace("```", ""))

        type audioArray = {
            question:
            {
                shortText: string;
                url: string
            }[][],
            additionalTopics: any[]
        }

        const audioUrl: audioArray = {
            question: [],
            additionalTopics: []
        };

        for (let item of geminiResponse.question) {
            const urls = googleTTs.getAllAudioUrls(item, {
                lang: 'en',
                slow: false,
                host: 'https://translate.google.com'
            });
            audioUrl.question.push(urls);
        }
        res.status(200).json({
            audioUrl
        });
    } catch (error) {
        console.log("Error in Generating the Questions: ", error);
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}



export default genQue;