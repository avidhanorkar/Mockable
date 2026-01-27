import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String,
        default: ""
    },
    answer: {
        type: String,
        default: ""
    },
    transcript: {
        type: String,
        default: ""
    },
    analysis: {
        fillerWordCount: { type: Number, default: 0 },
        fillerWordPercentage: { type: Number, default: 0 },
        wordsPerMinute: { type: Number, default: 0 },
        pauseDuration: { type: Number, default: 0 },
        sentiment: { type: String, default: "neutral" },
        sentimentScore: { type: Number, default: 0 },
        technicalAccuracy: { type: Number, default: 0 },
        keywords: [{ type: String }]
    }
});

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    techStack: {
        type: String,
        default: ""
    },
    questions: [questionSchema],

    // File paths
    videoPath: {
        type: String,
        default: ""
    },
    audioPath: {
        type: String,
        default: ""
    },
    resumePath: {
        type: String,
        default: ""
    },

    // Overall analysis
    overallScore: {
        type: Number,
        default: 0
    },
    breakdown: {
        technicalAccuracy: { type: Number, default: 0 },
        confidence: { type: Number, default: 0 },
        fluency: { type: Number, default: 0 },
        fillerWords: { type: Number, default: 0 },
        sentiment: { type: Number, default: 0 }
    },

    // Insights and suggestions
    insights: [{
        type: String
    }],
    improvements: [{
        type: String
    }],

    // Status tracking
    status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending"
    },

    // Timestamps
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
