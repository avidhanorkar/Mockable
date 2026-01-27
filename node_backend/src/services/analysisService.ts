import {
    detectFillerWords,
    analyzeSentiment,
    calculateWPM,
    extractKeywords,
    calculateTechnicalAccuracy,
    analyzeConfidence
} from "../utils/nlpUtils";

interface QuestionAnalysis {
    fillerWordCount: number;
    fillerWordPercentage: number;
    wordsPerMinute: number;
    sentiment: string;
    sentimentScore: number;
    technicalAccuracy: number;
    confidence: number;
    keywords: string[];
}

interface OverallAnalysis {
    overallScore: number;
    breakdown: {
        technicalAccuracy: number;
        confidence: number;
        fluency: number;
        fillerWords: number;
        sentiment: number;
    };
    insights: string[];
    improvements: string[];
}

/**
 * Analyze a single question response
 */
export const analyzeQuestionResponse = (
    transcript: string,
    jobDescription: string,
    durationInSeconds: number
): QuestionAnalysis => {
    // Filler words analysis
    const fillerAnalysis = detectFillerWords(transcript);

    // Sentiment analysis
    const sentimentAnalysis = analyzeSentiment(transcript);

    // Calculate WPM
    const wpm = calculateWPM(transcript, durationInSeconds);

    // Extract keywords
    const keywords = extractKeywords(transcript, 10);

    // Technical accuracy
    const technicalAccuracy = calculateTechnicalAccuracy(transcript, jobDescription);

    // Confidence analysis
    const confidenceAnalysis = analyzeConfidence(transcript);

    return {
        fillerWordCount: fillerAnalysis.count,
        fillerWordPercentage: fillerAnalysis.percentage,
        wordsPerMinute: wpm,
        sentiment: sentimentAnalysis.sentiment,
        sentimentScore: sentimentAnalysis.score,
        technicalAccuracy,
        confidence: confidenceAnalysis.score,
        keywords
    };
};

/**
 * Generate overall interview analysis
 */
export const generateOverallAnalysis = (
    questionAnalyses: QuestionAnalysis[]
): OverallAnalysis => {
    if (questionAnalyses.length === 0) {
        return {
            overallScore: 0,
            breakdown: {
                technicalAccuracy: 0,
                confidence: 0,
                fluency: 0,
                fillerWords: 0,
                sentiment: 0
            },
            insights: [],
            improvements: []
        };
    }

    // Calculate averages
    const avgTechnicalAccuracy = questionAnalyses.reduce((sum, q) => sum + q.technicalAccuracy, 0) / questionAnalyses.length;
    const avgConfidence = questionAnalyses.reduce((sum, q) => sum + q.confidence, 0) / questionAnalyses.length;
    const avgWPM = questionAnalyses.reduce((sum, q) => sum + q.wordsPerMinute, 0) / questionAnalyses.length;
    const avgFillerPercentage = questionAnalyses.reduce((sum, q) => sum + q.fillerWordPercentage, 0) / questionAnalyses.length;
    const avgSentiment = questionAnalyses.reduce((sum, q) => sum + q.sentimentScore, 0) / questionAnalyses.length;

    // Calculate fluency score (based on WPM - ideal is 120-150 WPM)
    const fluencyScore = calculateFluencyScore(avgWPM);

    // Calculate filler words score (inverse - lower is better)
    const fillerScore = Math.max(0, 100 - (avgFillerPercentage * 10));

    // Normalize sentiment score to 0-100
    const sentimentScore = Math.max(0, Math.min(100, 50 + avgSentiment));

    // Calculate weighted overall score
    const overallScore = (
        avgTechnicalAccuracy * 0.30 +
        avgConfidence * 0.25 +
        fluencyScore * 0.20 +
        fillerScore * 0.15 +
        sentimentScore * 0.10
    );

    // Generate insights
    const insights = generateInsights({
        technicalAccuracy: avgTechnicalAccuracy,
        confidence: avgConfidence,
        fluency: fluencyScore,
        fillerWords: fillerScore,
        sentiment: sentimentScore,
        wpm: avgWPM,
        fillerPercentage: avgFillerPercentage
    });

    // Generate improvements
    const improvements = generateImprovements({
        technicalAccuracy: avgTechnicalAccuracy,
        confidence: avgConfidence,
        fluency: fluencyScore,
        fillerWords: fillerScore,
        sentiment: sentimentScore,
        wpm: avgWPM,
        fillerPercentage: avgFillerPercentage
    });

    return {
        overallScore: parseFloat(overallScore.toFixed(2)),
        breakdown: {
            technicalAccuracy: parseFloat(avgTechnicalAccuracy.toFixed(2)),
            confidence: parseFloat(avgConfidence.toFixed(2)),
            fluency: parseFloat(fluencyScore.toFixed(2)),
            fillerWords: parseFloat(fillerScore.toFixed(2)),
            sentiment: parseFloat(sentimentScore.toFixed(2))
        },
        insights,
        improvements
    };
};

/**
 * Calculate fluency score based on WPM
 */
const calculateFluencyScore = (wpm: number): number => {
    // Ideal WPM is 120-150
    if (wpm >= 120 && wpm <= 150) return 100;
    if (wpm >= 100 && wpm < 120) return 85;
    if (wpm >= 80 && wpm < 100) return 70;
    if (wpm > 150 && wpm <= 180) return 85;
    if (wpm > 180) return 60; // Too fast
    return 50; // Too slow
};

/**
 * Generate insights based on performance
 */
const generateInsights = (metrics: any): string[] => {
    const insights: string[] = [];

    if (metrics.technicalAccuracy >= 80) {
        insights.push("Strong technical knowledge demonstrated with relevant terminology and concepts.");
    }

    if (metrics.confidence >= 75) {
        insights.push("Confident delivery with assertive language and clear communication.");
    }

    if (metrics.fluency >= 85) {
        insights.push("Excellent speech fluency with natural pacing and rhythm.");
    }

    if (metrics.fillerWords >= 85) {
        insights.push("Minimal use of filler words, showing well-prepared responses.");
    }

    if (metrics.sentiment >= 60) {
        insights.push("Positive and enthusiastic tone throughout the interview.");
    }

    if (metrics.wpm >= 120 && metrics.wpm <= 150) {
        insights.push("Optimal speaking pace that's easy to follow and professional.");
    }

    return insights.length > 0 ? insights : ["Good effort! Keep practicing to improve your interview skills."];
};

/**
 * Generate improvement suggestions
 */
const generateImprovements = (metrics: any): string[] => {
    const improvements: string[] = [];

    if (metrics.technicalAccuracy < 60) {
        improvements.push("Review technical concepts related to the job description. Focus on using industry-specific terminology.");
    }

    if (metrics.confidence < 60) {
        improvements.push("Practice answering questions with more assertive language. Replace phrases like 'I think' with 'I know' or 'I'm confident that'.");
    }

    if (metrics.fluency < 70) {
        if (metrics.wpm < 80) {
            improvements.push("Try to speak at a slightly faster pace. Practice reading aloud to improve your speaking rhythm.");
        } else if (metrics.wpm > 180) {
            improvements.push("Slow down your speech pace. Take brief pauses between sentences to improve clarity.");
        }
    }

    if (metrics.fillerWords < 70) {
        improvements.push(`Reduce filler words (${metrics.fillerPercentage.toFixed(1)}% detected). Pause briefly instead of using 'um', 'uh', or 'like'.`);
    }

    if (metrics.sentiment < 50) {
        improvements.push("Try to maintain a more positive and enthusiastic tone. Show genuine interest in the role and company.");
    }

    if (improvements.length === 0) {
        improvements.push("Continue practicing to maintain your excellent performance!");
    }

    return improvements;
};

export default {
    analyzeQuestionResponse,
    generateOverallAnalysis
};
