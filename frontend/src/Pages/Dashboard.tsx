import { useState, useEffect } from 'react';
import { Button } from '../Components/ui/button';
import { Plus, Clock, BarChart2, Calendar, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/authContext';

interface Interview {
    _id: string;
    jobTitle: string;
    createdAt: string;
    overallScore: number;
    status: string;
}

interface Stats {
    totalInterviews: number;
    averageScore: number;
    totalTime: number;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalInterviews: 0,
        averageScore: 0,
        totalTime: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await axios.get(
                `${API_BASE_URL}/v1/interview/`,
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true
                }
            );

            const interviewData: Interview[] = response.data.interviews;
            setInterviews(interviewData.slice(0, 3)); // Show only recent 3

            // Calculate stats
            const completed = interviewData.filter(i => i.status === 'completed');
            const avgScore = completed.length > 0
                ? completed.reduce((sum, i) => sum + i.overallScore, 0) / completed.length
                : 0;

            setStats({
                totalInterviews: completed.length,
                averageScore: Math.round(avgScore),
                totalTime: completed.length * 15 // Estimate 15 min per interview
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsData = [
        {
            label: 'Interviews Completed',
            value: stats.totalInterviews.toString(),
            icon: Calendar,
        },
        {
            label: 'Average Score',
            value: `${stats.averageScore}%`,
            icon: BarChart2,
        },
        {
            label: 'Time Practiced',
            value: `${Math.floor(stats.totalTime / 60)}h ${stats.totalTime % 60}m`,
            icon: Clock,
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-rose-500';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10';
            case 'processing':
                return 'bg-amber-500/5 text-amber-400 border-amber-500/10';
            case 'pending':
                return 'bg-neutral-900/60 text-neutral-400 border-neutral-850/40';
            default:
                return 'bg-neutral-900/30 text-neutral-500 border-neutral-850/20';
        }
    };

    if (loading) {
        return (
            <div className='bg-black min-h-screen text-white flex items-center justify-center relative font-mono text-xs uppercase tracking-widest'>
                <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin"></div>
                    <div>CALIBRATING SESSION LABS...</div>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-black min-h-screen text-white font-sans selection:bg-white/20 relative overflow-hidden pb-24'>
            {/* Ambient Background Dotted Grid */}
            <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
            
            {/* Soft Ambient Radial Glow */}
            <div className="absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-3xl pointer-events-none" />

            <main className='relative z-10 max-w-5xl mx-auto px-6 space-y-12 pt-8'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-8'>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded">
                                SYSTEM COCKPIT // SECURE
                            </span>
                        </div>
                        <h1 className='text-3xl font-bold tracking-tight text-white'>
                            Hello, {user?.name?.split(' ')[0] || 'User'}
                        </h1>
                        <p className='text-neutral-400 text-sm mt-1 font-mono uppercase text-[9px] tracking-widest'>
                            READY TO CALIBRATE YOUR INTERVIEW PERFORMANCE
                        </p>
                    </motion.div>
                    <Link to="/interview-setup">
                        <Button className='bg-white text-black hover:bg-neutral-200 px-5 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer'>
                            <Plus className='w-3.5 h-3.5' />
                            Start New Session
                        </Button>
                    </Link>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={index}
                            className='glow-card bg-neutral-950/40 border border-neutral-900 rounded-2xl p-6 hover:bg-neutral-950/70 transition-all duration-300 group'
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.08 }}
                        >
                            <div className='flex items-center justify-between mb-4'>
                                <div className='p-2.5 rounded-xl border border-neutral-900 bg-neutral-950/80 group-hover:scale-105 transition-transform'>
                                    <stat.icon className='w-4 h-4 text-white/80' />
                                </div>
                                <span className='font-mono text-[9px] uppercase tracking-widest text-neutral-500'>
                                    METRIC // 0{index + 1}
                                </span>
                            </div>
                            <h3 className='text-3xl font-semibold tracking-tight text-white mb-1'>{stat.value}</h3>
                            <p className='text-xs font-mono uppercase tracking-wider text-neutral-400'>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className='glass-panel rounded-2xl p-8'
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <div className='flex items-center justify-between mb-8 border-b border-white/5 pb-4'>
                        <div>
                            <h2 className='text-lg font-semibold text-white'>Recent Evaluations</h2>
                            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mt-0.5">
                                HISTORICAL SESSION REPORT REGISTRY
                            </p>
                        </div>
                        <Button variant="ghost" className='font-mono text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer'>
                            View All <ArrowRight className='w-3.5 h-3.5' />
                        </Button>
                    </div>

                    {interviews.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-neutral-900 rounded-xl">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-4">
                                NO EVALUATION SESSIONS RECORDED
                            </p>
                            <Link to="/interview-setup">
                                <Button className="bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-full font-mono text-[10px] uppercase font-semibold tracking-wider cursor-pointer">
                                    Start Your First Session
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className='space-y-3.5'>
                            {interviews.map((interview) => (
                                <div
                                    key={interview._id}
                                    onClick={() => navigate(`/report/${interview._id}`)}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-neutral-900 bg-neutral-950/20 hover:bg-neutral-950/60 hover:border-neutral-850 transition-all duration-200 group gap-4 cursor-pointer"
                                >
                                    <div className='flex items-center gap-4'>
                                        <div className='h-10 w-10 rounded-lg border border-neutral-900 bg-neutral-950 flex items-center justify-center text-white/80 font-mono font-bold text-sm'>
                                            {interview.jobTitle.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className='font-sans font-medium text-sm text-neutral-200 group-hover:text-white transition-colors'>
                                                {interview.jobTitle}
                                            </h3>
                                            <p className='font-mono text-[9px] text-neutral-500 uppercase mt-0.5'>
                                                RECORDED ON {formatDate(interview.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between sm:justify-end gap-6 sm:gap-8'>
                                        {interview.status === 'completed' && (
                                            <div className='text-left sm:text-right'>
                                                <p className='font-mono text-[8px] uppercase tracking-wider text-neutral-550'>OVERALL SCORE</p>
                                                <p className={`font-mono font-medium text-sm mt-0.5 ${getScoreColor(interview.overallScore)}`}>
                                                    {interview.overallScore}%
                                                </p>
                                            </div>
                                        )}
                                        <div className={`px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider border ${getStatusColor(interview.status)}`}>
                                            {interview.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
