import natural from "natural";
import compromise from "compromise";

// Common filler words to detect
const FILLER_WORDS = [
    "um", "uh", "like", "you know", "so", "actually", "basically",
    "literally", "right", "okay", "well", "kind of", "sort of",
    "i mean", "you see", "hmm", "ah", "er"
];

/**
 * Detect and count filler words in text
 */
export const detectFillerWords = (text: string): {
    count: number;
    percentage: number;
    fillerWords: string[];
} => {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    const totalWords = words.length;

    const foundFillers: string[] = [];
    let count = 0;

    FILLER_WORDS.forEach(filler => {
        const regex = new RegExp(`\\b${filler}\\b`, "gi");
        const matches = lowerText.match(regex);
        if (matches) {
            count += matches.length;
            foundFillers.push(...matches);
        }
    });

    const percentage = totalWords > 0 ? (count / totalWords) * 100 : 0;

    return {
        count,
        percentage: parseFloat(percentage.toFixed(2)),
        fillerWords: foundFillers
    };
};

/**
 * Calculate sentiment score using natural library
 */
export const analyzeSentiment = (text: string): {
    score: number;
    sentiment: "positive" | "negative" | "neutral";
    comparative: number;
} => {
    const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text);

    const score = analyzer.getSentiment(tokens);

    let sentiment: "positive" | "negative" | "neutral";
    if (score > 0.1) sentiment = "positive";
    else if (score < -0.1) sentiment = "negative";
    else sentiment = "neutral";

    return {
        score: parseFloat((score * 100).toFixed(2)),
        sentiment,
        comparative: score
    };
};

/**
 * Calculate words per minute
 */
export const calculateWPM = (text: string, durationInSeconds: number): number => {
    const words = text.split(/\s+/).length;
    const minutes = durationInSeconds / 60;
    return Math.round(words / minutes);
};

/**
 * Extract keywords from text
 */
export const extractKeywords = (text: string, limit: number = 10): string[] => {
    const doc = compromise(text);

    // Extract nouns and technical terms
    const nouns = doc.nouns().out("array");
    const topics = doc.topics().out("array");

    // Combine and deduplicate
    const keywords = [...new Set([...nouns, ...topics])];

    // Sort by frequency and return top N
    const wordFreq = new Map<string, number>();
    keywords.forEach(word => {
        const count = (text.match(new RegExp(word, "gi")) || []).length;
        wordFreq.set(word, count);
    });

    return Array.from(wordFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word]) => word);
};

/**
 * Calculate technical accuracy by matching keywords with job description
 */
export const calculateTechnicalAccuracy = (
    answerText: string,
    jobDescription: string
): number => {
    const answerKeywords = extractKeywords(answerText, 20);
    const jdKeywords = extractKeywords(jobDescription, 20);

    // Calculate overlap
    const overlap = answerKeywords.filter(keyword =>
        jdKeywords.some(jdKeyword =>
            jdKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(jdKeyword.toLowerCase())
        )
    );

    const accuracy = jdKeywords.length > 0
        ? (overlap.length / jdKeywords.length) * 100
        : 0;

    return Math.min(100, parseFloat(accuracy.toFixed(2)));
};

/**
 * Analyze confidence based on text patterns
 */
export const analyzeConfidence = (text: string): {
    score: number;
    indicators: string[];
} => {
    const lowerText = text.toLowerCase();
    let score = 50; // Start with neutral
    const indicators: string[] = [];

    // Positive indicators
    const positivePatterns = [
        { pattern: /\b(definitely|certainly|absolutely|confident|sure)\b/g, weight: 5 },
        { pattern: /\b(i know|i believe|i think)\b/g, weight: 3 },
        { pattern: /\b(experience with|worked on|developed)\b/g, weight: 4 }
    ];

    // Negative indicators
    const negativePatterns = [
        { pattern: /\b(maybe|perhaps|possibly|not sure|i guess)\b/g, weight: -5 },
        { pattern: /\b(i don't know|i'm not sure|unclear)\b/g, weight: -7 },
        { pattern: /\b(might|could be|probably)\b/g, weight: -3 }
    ];

    positivePatterns.forEach(({ pattern, weight }) => {
        const matches = lowerText.match(pattern);
        if (matches) {
            score += weight * matches.length;
            indicators.push(`Found ${matches.length} confidence boosters`);
        }
    });

    negativePatterns.forEach(({ pattern, weight }) => {
        const matches = lowerText.match(pattern);
        if (matches) {
            score += weight * matches.length;
            indicators.push(`Found ${matches.length} uncertainty markers`);
        }
    });

    // Filler words reduce confidence
    const fillers = detectFillerWords(text);
    if (fillers.percentage > 5) {
        score -= fillers.percentage;
        indicators.push(`High filler word usage (${fillers.percentage}%)`);
    }

    return {
        score: Math.max(0, Math.min(100, score)),
        indicators
    };
};

export default {
    detectFillerWords,
    analyzeSentiment,
    calculateWPM,
    extractKeywords,
    calculateTechnicalAccuracy,
    analyzeConfidence
};
