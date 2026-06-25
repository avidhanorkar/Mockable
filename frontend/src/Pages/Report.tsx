import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Download, ArrowLeft, TrendingUp, Award, Target, MessageSquare } from 'lucide-react';
import { Button } from '../Components/ui/button';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface InterviewData {
    _id: string;
    jobTitle: string;
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
    questions: Array<{
        question: string;
        transcript: string;
        analysis: {
            fillerWordCount: number;
            fillerWordPercentage: number;
            wordsPerMinute: number;
            sentiment: string;
            sentimentScore: number;
            technicalAccuracy: number;
            keywords: string[];
        };
    }>;
    createdAt: string;
    status: string;
}

const Report = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [interview, setInterview] = useState<InterviewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInterviewReport();
    }, [id]);

    const fetchInterviewReport = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/v1/interview/${id}`,
                { withCredentials: true }
            );
            setInterview(response.data.interview);
        } catch (error) {
            console.error('Failed to fetch report:', error);
            toast.error('Failed to load interview report');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        // TODO: Implement PDF generation
        toast.success('PDF download feature coming soon!');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading report...</div>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Report not found</div>
            </div>
        );
    }

    // Prepare chart data
    const radarData = [
        { category: 'Technical', score: interview.breakdown.technicalAccuracy },
        { category: 'Confidence', score: interview.breakdown.confidence },
        { category: 'Fluency', score: interview.breakdown.fluency },
        { category: 'Clarity', score: interview.breakdown.fillerWords },
        { category: 'Sentiment', score: interview.breakdown.sentiment }
    ];

    const barData = Object.entries(interview.breakdown).map(([key, value]) => ({
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        score: value
    }));

    // Score color
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'from-green-500/20 to-green-600/20';
        if (score >= 60) return 'from-yellow-500/20 to-yellow-600/20';
        return 'from-red-500/20 to-red-600/20';
    };

    return (
        <div className="min-h-[calc(100vh-100px)] p-6">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => navigate('/dashboard')}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{interview.jobTitle}</h1>
                            <p className="text-gray-400">
                                {new Date(interview.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={downloadPDF}
                        className="bg-white text-black hover:bg-gray-200 flex items-center gap-2"
                    >
                        <Download size={20} />
                        Download PDF
                    </Button>
                </div>

                {/* Overall Score */}
                <motion.div
                    className={`bg-gradient-to-br ${getScoreBg(interview.overallScore)} backdrop-blur-lg border border-white/10 rounded-3xl p-8 mb-8`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-gray-400 text-lg mb-2">Overall Performance</h2>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-7xl font-bold ${getScoreColor(interview.overallScore)}`}>
                                    {interview.overallScore}
                                </span>
                                <span className="text-3xl text-gray-400">/100</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <Award className={`w-24 h-24 ${getScoreColor(interview.overallScore)}`} />
                        </div>
                    </div>
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Radar Chart */}
                    <motion.div
                        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Performance Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#ffffff20" />
                                <PolarAngleAxis dataKey="category" stroke="#ffffff80" />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#ffffff40" />
                                <Radar
                                    name="Score"
                                    dataKey="score"
                                    stroke="#8b5cf6"
                                    fill="#8b5cf6"
                                    fillOpacity={0.6}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Bar Chart */}
                    <motion.div
                        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Detailed Metrics</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#ffffff80" angle={-45} textAnchor="end" height={100} />
                                <YAxis domain={[0, 100]} stroke="#ffffff80" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f1f1f',
                                        border: '1px solid #ffffff20',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Insights and Improvements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Insights */}
                    <motion.div
                        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-green-400" size={24} />
                            <h3 className="text-xl font-bold text-white">Key Strengths</h3>
                        </div>
                        <ul className="space-y-3">
                            {interview.insights.map((insight, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span className="text-gray-300">{insight}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Improvements */}
                    <motion.div
                        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="text-blue-400" size={24} />
                            <h3 className="text-xl font-bold text-white">Areas for Improvement</h3>
                        </div>
                        <ul className="space-y-3">
                            {interview.improvements.map((improvement, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-blue-400 mt-1">→</span>
                                    <span className="text-gray-300">{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Question-by-Question Analysis */}
                <motion.div
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <MessageSquare className="text-purple-400" size={24} />
                        <h3 className="text-xl font-bold text-white">Question Analysis</h3>
                    </div>

                    <div className="space-y-6">
                        {interview.questions.map((q, index) => (
                            <div key={index} className="border-l-4 border-purple-500 pl-4">
                                <h4 className="text-white font-semibold mb-2">Q{index + 1}: {q.question}</h4>
                                {q.transcript && (
                                    <>
                                        <p className="text-gray-400 text-sm mb-3 italic">"{q.transcript.substring(0, 200)}..."</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs">Technical</p>
                                                <p className="text-white font-bold">{q.analysis.technicalAccuracy}%</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs">WPM</p>
                                                <p className="text-white font-bold">{q.analysis.wordsPerMinute}</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs">Filler Words</p>
                                                <p className="text-white font-bold">{q.analysis.fillerWordPercentage}%</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs">Sentiment</p>
                                                <p className="text-white font-bold capitalize">{q.analysis.sentiment}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Report;
