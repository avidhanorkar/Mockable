import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, Volume2 } from 'lucide-react';
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
  const { data } = location.state || {};

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

    // Extract questions from the response
    const extractedQuestions: Question[] = data.audioUrl.question.map((q: any) => ({
      question: q[0]?.shortText || '',
      audioUrl: q[0]?.url || ''
    }));

    setQuestions(extractedQuestions);

    // Create interview session
    createInterviewSession(extractedQuestions);
  }, [data]);

  const createInterviewSession = async (questions: Question[]) => {
    try {
      // Get job details from previous page (you might want to pass this through state)
      const response = await axios.post(
        `${API_BASE_URL}/v1/interview/create`,
        {
          jobTitle: 'Software Engineer', // TODO: Pass from setup page
          jobDescription: 'Full stack development', // TODO: Pass from setup page
          experience: 3, // TODO: Pass from setup page
          techStack: 'React, Node.js', // TODO: Pass from setup page
          questions: questions.map(q => ({ question: q.question, audioUrl: q.audioUrl || '' }))
        },
        { withCredentials: true }
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

  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playQuestionAudio = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion.audioUrl) {
      toast.error('Audio not available for this question');
      return;
    }

    try {
      // Stop previous audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(currentQuestion.audioUrl);
      audioRef.current = audio;

      audio.onloadstart = () => {
        setAudioPlaying(true);
        setAudioError(false);
      };

      audio.onended = () => {
        setAudioPlaying(false);
      };

      audio.onerror = () => {
        setAudioPlaying(false);
        setAudioError(true);
        toast.error('Failed to play audio');
      };

      audio.play().catch((error) => {
        console.error('Audio playback error:', error);
        setAudioPlaying(false);
        setAudioError(true);
        toast.error('Failed to play audio');
      });
    } catch (error) {
      console.error('Audio error:', error);
      setAudioError(true);
      toast.error('Failed to play audio');
    }
  };

  // Auto-play audio when question changes (optional)
  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestionIndex]?.audioUrl) {
      // Auto-play after a short delay
      const timer = setTimeout(() => {
        playQuestionAudio();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, questions]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitInterview = async () => {
    if (recordedBlobs.size === 0) {
      toast.error('Please record at least one answer');
      return;
    }

    if (!interviewId) {
      toast.error('Interview session not found');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload all recordings
      for (const [index, blob] of recordedBlobs.entries()) {
        const formData = new FormData();
        formData.append('recording', blob, `question-${index}.webm`);

        await axios.post(
          `${API_BASE_URL}/v1/interview/${interviewId}/upload`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          }
        );
      }

      toast.success('Interview submitted successfully!');

      // Navigate to report page after a delay
      setTimeout(() => {
        navigate(`/report/${interviewId}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit interview:', error);
      toast.error('Failed to submit interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
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

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 relative overflow-hidden pb-24">
      {/* Ambient Background Dotted Grid */}
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
      <div className="absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.01] blur-3xl pointer-events-none" />

      <Toaster position="top-right" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-8 pt-8">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded">
              QUESTION // 0{currentQuestionIndex + 1} OF 0{questions.length}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded">
              STATUS // {recordedBlobs.size} OF {questions.length} ANSWERED
            </span>
          </div>
          <div className="w-full h-[3px] bg-neutral-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            className="glass-panel rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block">
                  ACTIVE PROMPT
                </span>
                <h2 className="text-xl font-semibold text-white tracking-tight leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>
              {currentQuestion.audioUrl && (
                <motion.button
                  onClick={playQuestionAudio}
                  disabled={audioPlaying}
                  className={`p-3 rounded-full border transition-all cursor-pointer ${audioPlaying
                    ? 'bg-white/10 text-white border-white/20 cursor-not-allowed'
                    : audioError
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-900 hover:text-white hover:border-neutral-800'
                    }`}
                  whileHover={!audioPlaying ? { scale: 1.05 } : {}}
                  whileTap={!audioPlaying ? { scale: 0.95 } : {}}
                  title={audioPlaying ? 'Playing...' : 'Play question audio'}
                >
                  {audioPlaying ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Volume2 size={16} />
                    </motion.div>
                  ) : (
                    <Volume2 size={16} />
                  )}
                </motion.button>
              )}
            </div>

            {audioPlaying && (
              <motion.div
                className="mt-6 p-3 bg-neutral-955 border border-neutral-900 rounded-xl flex items-center gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex gap-0.5 items-center h-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-[2px] bg-white rounded-full"
                      animate={{
                        height: ['4px', '12px', '4px'],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                <p className="text-neutral-400 font-mono text-[9px] uppercase tracking-wider">Playing question audio...</p>
              </motion.div>
            )}

            {recordedBlobs.has(currentQuestionIndex) && (
              <div className="mt-6 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse" />
                <p className="text-emerald-450 font-mono text-[9px] uppercase tracking-widest">✓ Response calibrated and saved</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Recorder */}
        <div className="mb-6">
          <InterviewRecorder
            onRecordingComplete={handleRecordingComplete}
            onUploadFile={handleUploadFile}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="font-mono text-[10px] uppercase font-semibold tracking-wider rounded-full border border-neutral-900 bg-neutral-950 text-neutral-400 hover:bg-neutral-900 hover:text-white px-5 py-2.5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={12} className="mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentQuestionIndex
                  ? 'bg-white w-6'
                  : recordedBlobs.has(index)
                    ? 'bg-emerald-400 w-3'
                    : 'bg-neutral-900 w-1.5'
                  }`}
              />
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={submitInterview}
              disabled={isSubmitting}
              className="bg-emerald-500 text-white hover:bg-emerald-600 font-mono text-[10px] uppercase font-semibold tracking-wider rounded-full px-6 py-2.5 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Interview'}
              <Send size={12} />
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              className="bg-white text-black hover:bg-neutral-200 font-mono text-[10px] uppercase font-semibold tracking-wider rounded-full px-6 py-2.5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Next
              <ChevronRight size={12} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;