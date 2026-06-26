import { Request, Response } from "express";
import axios from "axios";

/**
 * Proxy endpoint to stream Google TTS audio to the frontend,
 * bypassing browser CORS restrictions on translate.google.com
 */
const audioProxy = async (req: Request, res: Response) => {
    try {
        const { url } = req.query;

        if (!url || typeof url !== "string") {
            return res.status(400).json({ msg: "Missing or invalid 'url' query parameter" });
        }

        // Only allow Google TTS URLs (security: prevent open proxy abuse)
        const decoded = decodeURIComponent(url);
        if (!decoded.startsWith("https://translate.google.com/translate_tts") &&
            !decoded.startsWith("https://translate.googleapis.com/translate_tts")) {
            return res.status(403).json({ msg: "Only Google TTS URLs are allowed" });
        }

        const response = await axios.get(decoded, {
            responseType: "stream",
            headers: {
                // Mimic a browser request so Google TTS doesn't reject it
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://translate.google.com/",
                "Accept": "audio/webm,audio/ogg,audio/mpeg,audio/*;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            },
            timeout: 10000,
        });

        // Forward content type
        const contentType = response.headers["content-type"] || "audio/mpeg";
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.setHeader("Access-Control-Allow-Origin", "*");

        // Stream the audio directly to the client
        response.data.pipe(res);

        response.data.on("error", (err: Error) => {
            console.error("Audio proxy stream error:", err);
            if (!res.headersSent) {
                res.status(500).json({ msg: "Stream error" });
            }
        });
    } catch (error: any) {
        console.error("Audio proxy error:", error?.message || error);
        if (!res.headersSent) {
            return res.status(500).json({
                msg: "Failed to fetch audio",
                detail: error?.message,
            });
        }
    }
};

export default audioProxy;
