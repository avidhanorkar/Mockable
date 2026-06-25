import React, { useState } from 'react';
import { Button } from '../Components/ui/button';
import { Upload, FileText, ArrowRight, Briefcase, Code, Clock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InterviewSetup = () => {
    const navigate = useNavigate();
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [techStack, setTechStack] = useState('');
    const [experience, setExperience] = useState('');
    const [resume, setResume] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
        }
    };

    const handleStartInterview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resume) {
            alert('Please upload a resume');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', jobTitle);
        formData.append('JD', jobDescription);
        formData.append('additionalTopics', techStack);
        formData.append('experience', experience);
        formData.append('file', resume);

        try {
            console.log("Pls Wait!")
            const response = await axios.post(`https://mockable.onrender.com/v1/ques/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            console.log('Interview Questions:', response.data);
            navigate('/interview', { state: { data: response.data } });
        } catch (error) {
            console.error('Error starting interview:', error);
            alert(`Failed to generate interview: ${(error as any)?.response?.data?.msg || 'Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-[calc(100vh-100px)] flex items-center justify-center p-4'>
            <div className='w-full max-w-2xl'>
                <div className='bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl'>
                    <div className='text-center mb-8'>
                        <h1 className='text-4xl font-bold text-white mb-2'>Setup Your Interview</h1>
                        <p className='text-gray-400'>Provide the details to tailor your mock interview session.</p>
                    </div>

                    <form onSubmit={handleStartInterview} className='space-y-6'>
                        {/* Job Title Section */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-300 ml-1'>
                                Job Title
                            </label>
                            <div className='relative'>
                                <div className='absolute top-3.5 left-3 text-gray-500'>
                                    <Briefcase size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="e.g. Senior Frontend Developer"
                                    className='w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all'
                                    required
                                />
                            </div>
                        </div>

                        {/* Job Description Section */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-300 ml-1'>
                                Job Description
                            </label>
                            <div className='relative'>
                                <div className='absolute top-3 left-3 text-gray-500'>
                                    <FileText size={20} />
                                </div>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job description here..."
                                    className='w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all min-h-[120px] resize-y'
                                    required
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Tech Stack Section */}
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-300 ml-1'>
                                    More Topics
                                </label>
                                <div className='relative'>
                                    <div className='absolute top-3.5 left-3 text-gray-500'>
                                        <Code size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={techStack}
                                        onChange={(e) => setTechStack(e.target.value)}
                                        placeholder="Specific you wanna study"
                                        className='w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all'

                                    />
                                </div>
                                <p className='text-xs text-gray-500 ml-1'>Separate technologies with a comma</p>
                            </div>

                            {/* Experience Section */}
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-300 ml-1'>
                                    Years of Experience
                                </label>
                                <div className='relative'>
                                    <div className='absolute top-3.5 left-3 text-gray-500'>
                                        <Clock size={20} />
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="e.g. 3"
                                        className='w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all'
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Resume Upload Section */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-300 ml-1'>
                                Resume / CV
                            </label>
                            <div className='relative group'>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                    className='hidden'
                                    id="resume-upload"
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${resume
                                        ? 'border-green-500/50 bg-green-500/10'
                                        : 'border-white/10 bg-black/20 hover:border-white/30 hover:bg-black/30'
                                        }`}
                                >
                                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                        {resume ? (
                                            <>
                                                <FileText className='w-8 h-8 text-green-400 mb-2' />
                                                <p className='text-sm text-green-400 font-medium'>{resume.name}</p>
                                                <p className='text-xs text-green-400/70'>Click to change</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className='w-8 h-8 text-gray-400 mb-2 group-hover:text-white transition-colors' />
                                                <p className='text-sm text-gray-400 group-hover:text-white transition-colors'>
                                                    <span className='font-semibold'>Click to upload</span> or drag and drop
                                                </p>
                                                <p className='text-xs text-gray-500'>PDF only (MAX. 10MB)</p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className='w-full bg-white text-black py-6 rounded-xl text-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading ? 'Generating Interview...' : 'Start Interview'}
                            {!isLoading && <ArrowRight size={20} />}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="relative">
                        {/* Outer rotating ring */}
                        <div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>

                        {/* Inner pulsing dot */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>

                    <div className="mt-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        <h3 className="text-2xl font-bold mb-2">Crafting Your Interview</h3>
                        <p className="text-gray-400 text-sm">Analyzing your profile & generating questions...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewSetup;