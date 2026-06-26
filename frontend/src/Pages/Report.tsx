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
import { API_BASE_URL } from '../config/api';

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
        let intervalId: number;

        const fetchInterviewReport = async (isPoll = false) => {
            try {
                const token = localStorage.getItem('auth-token');
                const response = await axios.get(
                    `${API_BASE_URL}/v1/interview/${id}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` },
                        withCredentials: true
                    }
                );
                const data = response.data.interview;
                setInterview(data);
                
                // Stop polling if the report is completed or failed
                if (data.status !== 'processing' && data.status !== 'pending') {
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error('Failed to fetch report:', error);
                if (!isPoll) {
                    toast.error('Failed to load interview report');
                }
                clearInterval(intervalId);
            } finally {
                setLoading(false);
            }
        };

        // First immediate fetch
        fetchInterviewReport(false);

        // Poll every 3 seconds to check if status becomes 'completed' or 'failed'
        intervalId = window.setInterval(() => {
            fetchInterviewReport(true);
        }, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, [id]);

    const downloadPDF = () => {
        // TODO: Implement PDF generation
        toast.success('PDF download feature coming soon!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center relative font-mono text-xs uppercase tracking-widest">
                <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin"></div>
                    <div>LOADING INTERVIEW SESSION...</div>
                </div>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center relative font-mono text-xs uppercase tracking-widest">
                <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
                <div className="flex flex-col items-center gap-4 text-center px-4">
                    <div className="text-red-500 text-lg">REPORT NOT FOUND</div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-mono text-[9px] uppercase tracking-widest px-4 py-2 rounded-lg transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (interview.status === 'processing' || interview.status === 'pending') {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center relative font-mono text-xs uppercase tracking-widest">
                <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
                <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
                    <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold tracking-widest text-violet-400">ANALYZING YOUR INTERVIEW...</h2>
                        <p className="text-neutral-400 text-[10px] normal-case leading-relaxed font-sans">
                            Our AI is currently transcribing your responses and evaluating metrics like speech flow, confidence patterns, and technical correctness. This usually takes around 15–30 seconds.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (interview.status === 'failed') {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center relative font-mono text-xs uppercase tracking-widest">
                <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
                <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-alert-triangle text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold tracking-widest text-red-500">ANALYSIS FAILED</h2>
                        <p className="text-neutral-400 text-[10px] normal-case leading-relaxed font-sans">
                            An error occurred on the backend while running transcription or NLP evaluation on your responses.
                        </p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="mt-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-mono text-[9px] uppercase tracking-widest px-4 py-2 rounded-lg transition cursor-pointer"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
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
