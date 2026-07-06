import React, { useState, useEffect } from 'react';
import { Button } from '../Components/ui/button';
import { Upload, FileText, ArrowRight, Briefcase, Code, Clock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import TokenModal from '../Components/ui/TokenModal';

const InterviewSetup = () => {
    const navigate = useNavigate();
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [techStack, setTechStack] = useState('');
    const [experience, setExperience] = useState('');
    const [resume, setResume] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

    useEffect(() => {
        const geminiKey = localStorage.getItem('gemini_api_key');
        if (!geminiKey) {
            setIsTokenModalOpen(true);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
        }
    };

    const handleStartInterview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        if (!resume) {
            setErrorMsg('Please upload a resume');
            setIsLoading(false);
            return;
        }

        const geminiKey = localStorage.getItem('gemini_api_key');
        if (!geminiKey) {
            setIsLoading(false);
            setIsTokenModalOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append('title', jobTitle);
        formData.append('JD', jobDescription);
        formData.append('additionalTopics', techStack);
        formData.append('experience', experience);
        formData.append('file', resume);

        try {
            console.log("Pls Wait!")
            const response = await axios.post(`${API_BASE_URL}/v1/ques/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-gemini-key': geminiKey
                },
                withCredentials: true
            });
            console.log('Interview Questions:', response.data);
            navigate('/interview', {
                state: {
                    data: response.data,
                    setupDetails: {
                        jobTitle,
                        jobDescription,
                        experience: parseInt(experience) || 3,
                        techStack
                    }
                }
            });
        } catch (error) {
            console.error('Error starting interview:', error);
            setErrorMsg((error as any)?.response?.data?.msg || 'Failed to generate interview. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center relative px-6 py-24 overflow-hidden">
            {/* Ambient Background Dotted Grid */}
            <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
            <div className="absolute left-1/2 top-1/2 h-[450px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.012] blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg mx-auto rounded-2xl border border-neutral-900 bg-neutral-950/40 p-8 shadow-2xl backdrop-blur-xl">
                {/* Header Logo & Spark */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded">
                            SYSTEM LABS // SESSION CALIBRATION
                        </span>
                    </div>
                    <h1 className="font-sans text-2xl font-bold tracking-tight text-white">Configure Session</h1>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 mt-1">
                        PROVIDE DETAILS TO CALIBRATE MOCK SIMULATION
                    </p>
                </div>

                <form onSubmit={handleStartInterview} className="space-y-5">
                    {/* Job Title Section */}
                    <div className="space-y-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5 block">
                            JOB TITLE
                        </label>
                        <div className="relative">
                            <div className="absolute top-3.5 left-4 text-neutral-550">
                                <Briefcase size={14} />
                            </div>
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder="E.G. SENIOR SOFTWARE ENGINEER"
                                className="w-full bg-neutral-950 border border-neutral-900 rounded-full pl-10 pr-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-800 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Job Description Section */}
                    <div className="space-y-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5 block">
                            JOB DESCRIPTION
                        </label>
                        <div className="relative">
                            <div className="absolute top-3.5 left-4 text-neutral-550">
                                <FileText size={14} />
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="PASTE THE TARGET JOB DESCRIPTION HERE..."
                                className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl pl-10 pr-4 py-3 font-mono text-[10px] tracking-wider uppercase text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-800 transition-colors min-h-[100px] resize-y"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Tech Stack Section */}
                        <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5 block">
                                MORE TOPICS
                            </label>
                            <div className="relative">
                                <div className="absolute top-3.5 left-4 text-neutral-550">
                                    <Code size={14} />
                                </div>
                                <input
                                    type="text"
                                    value={techStack}
                                    onChange={(e) => setTechStack(e.target.value)}
                                    placeholder="STUDY FOCUS"
                                    className="w-full bg-neutral-950 border border-neutral-900 rounded-full pl-10 pr-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-800 transition-colors"
                                />
                            </div>
                            <p className="font-mono text-[8px] text-neutral-600">SEPARATE TOPICS WITH A COMMA</p>
                        </div>

                        {/* Experience Section */}
                        <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5 block">
                                EXPERIENCE (YEARS)
                            </label>
                            <div className="relative">
                                <div className="absolute top-3.5 left-4 text-neutral-550">
                                    <Clock size={14} />
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    placeholder="E.G. 3"
                                    className="w-full bg-neutral-950 border border-neutral-900 rounded-full pl-10 pr-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-800 transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resume Upload Section */}
                    <div className="space-y-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5 block">
                            RESUME / CV
                        </label>
                        <div className="relative group">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf"
                                className="hidden"
                                id="resume-upload"
                            />
                            <label
                                htmlFor="resume-upload"
                                className={`flex flex-col items-center justify-center w-full h-28 border border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${resume
                                    ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                                    : 'border-neutral-900 bg-neutral-950/60 hover:border-neutral-800 hover:bg-neutral-950'
                                    }`}
                            >
                                <div className="flex flex-col items-center justify-center p-4">
                                    {resume ? (
                                        <>
                                            <FileText className="w-5 h-5 text-emerald-400 mb-1.5" />
                                            <p className="font-mono text-[9px] text-emerald-400 font-medium uppercase tracking-wider">{resume.name}</p>
                                            <p className="font-mono text-[8px] text-emerald-450/70 uppercase mt-0.5">CLICK TO RE-UPLOAD</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 text-neutral-500 mb-1.5 group-hover:text-white transition-colors" />
                                            <p className="font-mono text-[9px] text-neutral-400 group-hover:text-white transition-colors uppercase tracking-wider">
                                                <span className="font-semibold">Click to upload</span> or drag resume
                                            </p>
                                            <p className="font-mono text-[8px] text-neutral-600 uppercase mt-0.5">PDF ONLY // MAX. 10MB</p>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-[9px] font-mono tracking-wider uppercase text-center mt-4">
                            {errorMsg}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black py-2.5 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 mt-8 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? 'Calibrating Questions...' : 'Start Calibration'}
                        {!isLoading && <ArrowRight className="size-3.5" />}
                    </Button>
                </form>
            </div>

            {/* Loading Diagnostic Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-30" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-8">
                            {/* Outer rotating ring */}
                            <div className="w-16 h-16 border-2 border-white/5 border-t-white rounded-full animate-spin"></div>
                            {/* Inner pulsing dot */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>

                        <div className="text-center font-mono uppercase tracking-widest text-neutral-400">
                            <h3 className="text-sm font-bold text-white mb-2 tracking-wide animate-pulse">GENERATING INTERVIEW ENVIRONMENT</h3>
                            <p className="text-[9px] text-neutral-600">PARSING RESUME VECTORS // CALIBRATING SYSTEM NODES</p>
                        </div>
                    </div>
                </div>
            )}

            <TokenModal 
                isOpen={isTokenModalOpen} 
                onClose={() => setIsTokenModalOpen(false)} 
                onSave={(token) => {
                    console.log(token);
                    setIsTokenModalOpen(false);
                    // Optionally trigger the form submission automatically here
                }} 
            />
        </div>
    );
};

export default InterviewSetup;