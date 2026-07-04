import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Key, AlertCircle, X } from 'lucide-react';

interface TokenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (token: string) => void;
}

const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, onSave }) => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        // Pre-fill if exists
        const existingKey = localStorage.getItem('gemini_api_key');
        if (existingKey) {
            setToken(existingKey);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!token.trim()) {
            setError('Please enter a valid API key');
            return;
        }
        
        setIsValidating(true);
        setError('');
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key=${token.trim()}`);
            if (!response.ok) {
                setError('Invalid API key. Please check and try again.');
                setIsValidating(false);
                return;
            }
            
            localStorage.setItem('gemini_api_key', token.trim());
            onSave(token.trim());
            onClose();
        } catch (e) {
            setError('Failed to validate API key. Please check your network connection.');
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
                {/* Background accents */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 opacity-50" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-emerald-400 shadow-inner">
                        <Key size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Gemini API Key Required</h2>
                    <p className="text-xs text-neutral-400 mt-2 text-center">
                        To run mock interviews, please provide your Google Gemini API key. 
                        Your key is stored locally in your browser and never saved on our servers.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 ml-1">
                            API KEY
                        </label>
                        <input
                            type="text"
                            autoComplete="off"
                            spellCheck="false"
                            value={token}
                            onChange={(e) => {
                                setToken(e.target.value);
                                setError('');
                            }}
                            placeholder="AIzaSy..."
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
                        />
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            onClick={handleSave}
                            disabled={isValidating}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isValidating ? 'Validating...' : 'Save Key & Continue'}
                        </Button>
                    </div>

                    <p className="text-[10px] text-neutral-500 text-center mt-4">
                        Don't have an API key? Get one for free from{' '}
                        <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline"
                        >
                            Google AI Studio
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TokenModal;
