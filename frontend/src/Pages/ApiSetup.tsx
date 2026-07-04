import { useState, useEffect } from 'react';
import { Key, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ApiSetup = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        // Pre-fill if exists
        const existingKey = localStorage.getItem('gemini_api_key');
        if (existingKey) {
            setToken(existingKey);
        }
    }, []);

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!token.trim()) {
            setError('Please enter a valid API key');
            setSuccess(false);
            return;
        }
        
        setIsValidating(true);
        setError('');
        setSuccess(false);
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key=${token.trim()}`);
            if (!response.ok) {
                setError('Invalid API key. Please check and try again.');
                setIsValidating(false);
                return;
            }
            
            localStorage.setItem('gemini_api_key', token.trim());
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (e) {
            setError('Failed to validate API key. Please check your network connection.');
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative px-6 py-24 overflow-hidden">
            {/* Ambient Background Dotted Grid */}
            <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
            <div className="absolute left-1/2 top-1/2 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-900 bg-neutral-950/40 p-8 shadow-2xl backdrop-blur-xl"
            >
                {/* Header Logo & Spark */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="flex size-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 mb-5">
                        <Key className="size-5 text-white/80" />
                    </div>
                    <h1 className="font-sans text-xl font-medium tracking-tight text-white mb-1">Gemini API Setup</h1>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mt-1">
                        CALIBRATE AI CONNECTION
                    </p>
                </div>

                <div className="mb-8 text-center">
                    <p className="text-[11px] text-neutral-400 font-mono uppercase tracking-wider leading-relaxed">
                        Configure your Google Gemini API key to enable AI-powered mock interviews.
                    </p>
                    <div className="mt-4 p-3 rounded-lg border border-neutral-900 bg-neutral-950/50">
                        <p className="text-[10px] text-neutral-300 font-mono tracking-wide leading-relaxed">
                            <span className="text-white font-semibold">Security Note:</span> Your key is 100% safe. It is stored securely on your local device, never transmitted to our servers, and solely used to communicate directly with Google's Generative AI.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2.5">
                        <input
                            type="text"
                            autoComplete="off"
                            spellCheck="false"
                            placeholder="API KEY (AIzaSy...)"
                            value={token}
                            onChange={(e) => {
                                setToken(e.target.value);
                                setError('');
                                setSuccess(false);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-900 rounded-full px-5 py-3 font-mono text-[10px] tracking-wider text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 transition-colors"
                            required
                        />
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-[10px] font-mono uppercase tracking-wider">
                            <AlertCircle size={14} className="shrink-0" />
                            <p className="leading-relaxed">{error}</p>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-white bg-white/10 border border-white/20 rounded-lg p-3 text-[10px] font-mono uppercase tracking-wider">
                            <CheckCircle2 size={14} className="shrink-0" />
                            <p>API Key validated! Redirecting...</p>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isValidating || success}
                        className="w-full mt-2 bg-white text-black py-3 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isValidating ? 'Validating...' : success ? 'Connected' : 'Save & Validate Key'}
                        {!isValidating && !success && <ArrowRight className="size-3.5" />}
                    </button>
                </form>

                <div className="mt-8 pt-5 border-t border-neutral-900 flex flex-col gap-2 text-center font-mono text-[9px] uppercase tracking-wider">
                    <p className="text-neutral-500">
                        Need an API key?{' '}
                        <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white hover:underline cursor-pointer"
                        >
                            Get one from Google AI Studio
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ApiSetup;
