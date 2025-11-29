import React from 'react'
import Navbar from '../Components/Navbar'
import { Button } from '../Components/ui/button'
import { Plus, Clock, BarChart2, Calendar, ArrowRight } from 'lucide-react'

const Dashboard = () => {
    // Mock data for demonstration
    const stats = [
        { label: 'Interviews Completed', value: '12', icon: Calendar, color: 'text-blue-400' },
        { label: 'Average Score', value: '85%', icon: BarChart2, color: 'text-green-400' },
        { label: 'Time Practiced', value: '4h 30m', icon: Clock, color: 'text-purple-400' },
    ]

    const recentInterviews = [
        { id: 1, role: 'Frontend Developer', date: '2024-03-15', score: 88, status: 'Completed' },
        { id: 2, role: 'Full Stack Engineer', date: '2024-03-10', score: 75, status: 'Completed' },
        { id: 3, role: 'React Developer', date: '2024-03-05', score: 92, status: 'Completed' },
    ]

    return (
        <div className='bg-[#161616] min-h-screen text-white font-sans selection:bg-white/20'>

            <main className='max-w-7xl mx-auto px-6 space-y-12'>

                {/* Welcome Section */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                    <div>
                        <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'>
                            Hello, User
                        </h1>
                        <p className='text-gray-400 text-lg'>Ready to ace your next interview?</p>
                    </div>
                    <Button className='bg-white text-black hover:bg-gray-200 px-6 py-6 rounded-xl text-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-white/5'>
                        <Plus className='w-5 h-5' />
                        Start New Interview
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {stats.map((stat, index) => (
                        <div key={index} className='bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group'>
                            <div className='flex items-center justify-between mb-4'>
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className='w-6 h-6' />
                                </div>
                                <span className='text-gray-500 text-sm'>Last 30 days</span>
                            </div>
                            <h3 className='text-3xl font-bold mb-1'>{stat.value}</h3>
                            <p className='text-gray-400'>{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className='bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8'>
                    <div className='flex items-center justify-between mb-8'>
                        <h2 className='text-2xl font-bold'>Recent Interviews</h2>
                        <Button variant="ghost" className='text-gray-400 hover:text-white flex items-center gap-2'>
                            View All <ArrowRight className='w-4 h-4' />
                        </Button>
                    </div>

                    <div className='space-y-4'>
                        {recentInterviews.map((interview) => (
                            <div key={interview.id} className='flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group cursor-pointer'>
                                <div className='flex items-center gap-4'>
                                    <div className='h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-bold'>
                                        {interview.role.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg group-hover:text-blue-400 transition-colors'>{interview.role}</h3>
                                        <p className='text-gray-400 text-sm'>{interview.date}</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-8'>
                                    <div className='text-right'>
                                        <p className='text-sm text-gray-400'>Score</p>
                                        <p className='font-bold text-lg text-green-400'>{interview.score}%</p>
                                    </div>
                                    <div className='px-4 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20'>
                                        {interview.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    )
}

export default Dashboard
