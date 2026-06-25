import { useState, useEffect } from 'react';
import { Button } from '../Components/ui/button';
import { Plus, Clock, BarChart2, Calendar, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

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
            const response = await axios.get(
                'https://mockable.onrender.com/v1/interview/',
                { withCredentials: true }
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
            color: 'text-blue-400'
        },
        {
            label: 'Average Score',
            value: `${stats.averageScore}%`,
            icon: BarChart2,
            color: 'text-green-400'
        },
        {
            label: 'Time Practiced',
            value: `${Math.floor(stats.totalTime / 60)}h ${stats.totalTime % 60}m`,
            icon: Clock,
            color: 'text-purple-400'
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
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'processing':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'pending':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    if (loading) {
        return (
            <div className='bg-[#161616] min-h-screen text-white flex items-center justify-center'>
                <div className="text-xl">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className='bg-[#161616] min-h-screen text-white font-sans selection:bg-white/20'>
            <main className='max-w-7xl mx-auto px-6 space-y-12'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'>
                            Hello, User
                        </h1>
                        <p className='text-gray-400 text-lg'>Ready to ace your next interview?</p>
                    </motion.div>
                    <Link to="/interview-setup">
                        <Button className='bg-white text-black hover:bg-gray-200 px-6 py-6 rounded-xl text-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-white/5'>
                            <Plus className='w-5 h-5' />
                            Start New Interview
                        </Button>
                    </Link>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={index}
                            className='bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <div className='flex items-center justify-between mb-4'>
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className='w-6 h-6' />
                                </div>
                                <span className='text-gray-500 text-sm'>Last 30 days</span>
                            </div>
                            <h3 className='text-3xl font-bold mb-1'>{stat.value}</h3>
                            <p className='text-gray-400'>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className='bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    <div className='flex items-center justify-between mb-8'>
                        <h2 className='text-2xl font-bold'>Recent Interviews</h2>
                        <Button variant="ghost" className='text-gray-400 hover:text-white flex items-center gap-2'>
                            View All <ArrowRight className='w-4 h-4' />
                        </Button>
                    </div>

                    {interviews.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">No interviews yet</p>
                            <Link to="/interview-setup">
                                <Button>Start Your First Interview</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {interviews.map((interview) => (
                                <div
                                    key={interview._id}
                                    onClick={() => interview.status === 'completed' && navigate(`/report/${interview._id}`)}
                                    className={`flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group ${interview.status === 'completed' ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                    <div className='flex items-center gap-4'>
                                        <div className='h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-bold'>
                                            {interview.jobTitle.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-lg group-hover:text-blue-400 transition-colors'>
                                                {interview.jobTitle}
                                            </h3>
                                            <p className='text-gray-400 text-sm'>{formatDate(interview.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-8'>
                                        {interview.status === 'completed' && (
                                            <div className='text-right'>
                                                <p className='text-sm text-gray-400'>Score</p>
                                                <p className={`font-bold text-lg ${getScoreColor(interview.overallScore)}`}>
                                                    {interview.overallScore}%
                                                </p>
                                            </div>
                                        )}
                                        <div className={`px-4 py-1 rounded-full text-sm font-medium border ${getStatusColor(interview.status)}`}>
                                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
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
