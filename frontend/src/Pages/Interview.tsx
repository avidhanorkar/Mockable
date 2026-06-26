import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, Volume2, Square } from 'lucide-react';
import { Button } from '../Components/ui/button';
import InterviewRecorder from '../Components/InterviewRecorder';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

interface Question {
  question: string;
  audioUrl?: string;
}

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, setupDetails } = location.state || {};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordedBlobs, setRecordedBlobs] = useState<Map<number, Blob>>(new Map());
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!data || !data.audioUrl) {
      toast.error('No interview data found');
      navigate('/interview-setup');
      return;
    }

    const extractedQuestions: Question[] = data.audioUrl.question.map((q: any) => ({
      // q is an array of TTS chunks — join all shortText parts to get the full question
      question: Array.isArray(q) ? q.map((chunk: any) => chunk.shortText || '').join(' ').trim() : '',
      audioUrl: q[0]?.url || ''
    }));


    setQuestions(extractedQuestions);
    createInterviewSession(extractedQuestions);
  }, [data]);

  const createInterviewSession = async (questions: Question[]) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await axios.post(
        `${API_BASE_URL}/v1/interview/create`,
        {
          jobTitle: setupDetails?.jobTitle || 'Software Engineer',
          jobDescription: setupDetails?.jobDescription || 'Full stack development',
          experience: setupDetails?.experience || 3,
          techStack: setupDetails?.techStack || 'React, Node.js',
          questions: questions.map(q => ({ question: q.question, audioUrl: q.audioUrl || '' }))
        },
        {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true
        }
      );

      setInterviewId(response.data.interview._id);
      toast.success('Interview session created!');
    } catch (error) {
      console.error('Failed to create interview session:', error);
      toast.error('Failed to create interview session');
    }
  };

  const handleRecordingComplete = (blob: Blob) => {
    const newRecordings = new Map(recordedBlobs);
    newRecordings.set(currentQuestionIndex, blob);
    setRecordedBlobs(newRecordings);
    toast.success('Recording saved!');
  };

  const handleUploadFile = (file: File) => {
    const newRecordings = new Map(recordedBlobs);
    newRecordings.set(currentQuestionIndex, file);
    setRecordedBlobs(newRecordings);
    toast.success('File uploaded!');
  };

  // ── Audio (Web Speech API) ──
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setAudioPlaying(false);
    setAudioLoading(false);
  };

  const playQuestionAudio = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const text = currentQuestion?.question;

    if (!text) { toast.error('No question text to speak'); return; }
    if (!window.speechSynthesis) { toast.error('Text-to-speech not supported in this browser'); return; }

    if (audioPlaying) { stopAudio(); return; }

    try {
      stopAudio();
      setAudioLoading(true);
      setAudioError(false);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utteranceRef.current = utterance;

      utterance.onstart = () => { setAudioLoading(false); setAudioPlaying(true); };
      utterance.onend = () => { setAudioPlaying(false); setAudioLoading(false); utteranceRef.current = null; };
      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') {
          setAudioPlaying(false); setAudioLoading(false); return;
        }
        setAudioPlaying(false); setAudioLoading(false); setAudioError(true);
        utteranceRef.current = null;
        toast.error('Failed to play audio');
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      setAudioLoading(false); setAudioError(true);
      toast.error('Failed to play audio');
    }
  };

  // Stop speech when navigating between questions
  useEffect(() => { stopAudio(); setAudioError(false); }, [currentQuestionIndex]);

  // Auto-play when question loads
  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestionIndex]?.question) {
      const timer = setTimeout(() => { playQuestionAudio(); }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, questions]);

  // Cancel speech on unmount
  useEffect(() => { return () => { window.speechSynthesis.cancel(); }; }, []);

  // ── Navigation ──
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') nextQuestion();
      if (e.key === 'ArrowLeft') previousQuestion();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, questions.length]);

  const submitInterview = async () => {
    if (recordedBlobs.size === 0) { toast.error('Please record at least one answer'); return; }
    if (!interviewId) { toast.error('Interview session not found'); return; }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth-token');
      for (const [index, blob] of recordedBlobs.entries()) {
        const formData = new FormData();
        formData.append('recording', blob, `question-${index}.webm`);
        await axios.post(
          `${API_BASE_URL}/v1/interview/${interviewId}/upload`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
            withCredentials: true
          }
        );
      }
      toast.success('Interview submitted successfully!');
      setTimeout(() => navigate(`/report/${interviewId}`), 2000);
    } catch (error) {
      toast.error('Failed to submit interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading state ──
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative font-mono text-xs uppercase tracking-widest">
        <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
          <div>LOADING INTERVIEW SESSION...</div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="h-screen bg-black text-white font-sans selection:bg-white/20 relative overflow-hidden flex flex-col">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.01] blur-3xl pointer-events-none" />

      <Toaster position="top-right" />

      {/* ── STICKY TOP HEADER ── */}
      <div className="relative z-10 flex-none border-b border-neutral-900 bg-black/70 backdrop-blur-md px-5 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Question counter */}
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
            Q {String(currentQuestionIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
          </span>

          {/* Progress bar */}
          <div className="flex-1 h-[3px] bg-neutral-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>

          {/* Dot nav */}
          <div className="flex gap-1.5 items-center shrink-0">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                title={`Question ${index + 1}${recordedBlobs.has(index) ? ' ✓' : ''}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentQuestionIndex
                    ? 'bg-white w-5'
                    : recordedBlobs.has(index)
                    ? 'bg-emerald-400 w-2.5'
                    : 'bg-neutral-800 w-1.5 hover:bg-neutral-600'
                }`}
              />
            ))}
          </div>

          {/* Answered counter */}
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
            {recordedBlobs.size}/{questions.length} done
          </span>

          {/* Keyboard hint */}
          <span className="hidden lg:flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-neutral-700 select-none shrink-0">
            <kbd className="border border-neutral-800 bg-neutral-950 rounded px-1 py-0.5">←</kbd>
            <kbd className="border border-neutral-800 bg-neutral-950 rounded px-1 py-0.5">→</kbd>
            navigate
          </span>
        </div>
      </div>

      {/* ── MAIN TWO-PANEL BODY ── */}
      <div className="relative z-10 flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto w-full">

        {/* LEFT PANEL — Question + Controls */}
        <div className="flex flex-col lg:w-[40%] gap-3 min-h-0">

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              className="glass-panel rounded-2xl p-6 shadow-2xl flex-1 min-h-0 overflow-y-auto"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-4 block flex-none">
                ACTIVE PROMPT
              </span>

              <h2 className="text-lg font-semibold text-white tracking-tight leading-relaxed mb-5">
                {currentQuestion.question}
              </h2>

              {/* Read aloud button */}
              <div className="mt-0">
                <motion.button
                  onClick={playQuestionAudio}
                  disabled={audioLoading}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    audioLoading
                      ? 'bg-white/5 text-neutral-500 border-neutral-800 cursor-wait'
                      : audioPlaying
                      ? 'bg-white/10 text-white border-white/20 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20'
                      : audioError
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                  }`}
                  whileHover={!audioLoading ? { scale: 1.03 } : {}}
                  whileTap={!audioLoading ? { scale: 0.97 } : {}}
                >
                  {audioLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-3 h-3 border-2 border-neutral-700 border-t-white rounded-full"
                    />
                  ) : audioPlaying ? (
                    <Square size={11} fill="currentColor" />
                  ) : (
                    <Volume2 size={12} />
                  )}
                  <span>
                    {audioLoading ? 'Loading...' : audioPlaying ? 'Stop' : audioError ? 'Retry' : 'Read aloud'}
                  </span>
                  {audioPlaying && (
                    <div className="flex gap-[2px] items-center h-3">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-[2px] bg-white rounded-full"
                          animate={{ height: ['3px', '10px', '3px'] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              </div>

              {/* Answered badge */}
              {recordedBlobs.has(currentQuestionIndex) && (
                <motion.div
                  className="mt-3 flex-none p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-none" />
                  <p className="text-emerald-400 font-mono text-[9px] uppercase tracking-widest">
                    ✓ Response saved
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next / Submit */}
          <div className="flex-none flex items-center gap-2">
            <Button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex-1 font-mono text-[10px] uppercase font-semibold tracking-wider rounded-full border border-neutral-900 bg-neutral-950 text-neutral-400 hover:bg-neutral-900 hover:text-white py-2.5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <ChevronLeft size={12} />
              Prev
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={submitInterview}
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 font-mono text-[10px] uppercase font-semibold tracking-wider rounded-full py-2.5 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
                <Send size={11} />
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                className="flex-1 bg-white text-black hover:bg-neutral-200 font-mono text-[10px] uppercase font-semibold tracking-wider rounded-full py-2.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Next
                <ChevronRight size={12} />
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Recorder (fills remaining space) */}
        <div className="flex-1 lg:w-[60%] min-h-0 flex flex-col">
          <InterviewRecorder
            onRecordingComplete={handleRecordingComplete}
            onUploadFile={handleUploadFile}
          />
        </div>
      </div>
    </div>
  );
};

export default Interview;