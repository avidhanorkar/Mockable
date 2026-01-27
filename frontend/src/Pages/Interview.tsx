import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, Volume2 } from 'lucide-react';
import { Button } from '../Components/ui/button';
import InterviewRecorder from '../Components/InterviewRecorder';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

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
        'http://localhost:3000/v1/interview/create',
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
          `http://localhost:3000/v1/interview/${interviewId}/upload`,
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading interview...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-[calc(100vh-100px)] p-6">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-gray-400 text-sm">
              {recordedBlobs.size} / {questions.length} answered
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
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
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex-1">
                {currentQuestion.question}
              </h2>
              {currentQuestion.audioUrl && (
                <motion.button
                  onClick={playQuestionAudio}
                  disabled={audioPlaying}
                  className={`ml-4 p-3 rounded-full transition-all ${audioPlaying
                    ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed'
                    : audioError
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-white/10 text-white hover:bg-white/20'
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
                      <Volume2 size={20} />
                    </motion.div>
                  ) : (
                    <Volume2 size={20} />
                  )}
                </motion.button>
              )}
            </div>

            {audioPlaying && (
              <motion.div
                className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-blue-400 rounded-full"
                      animate={{
                        height: ['8px', '16px', '8px'],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <p className="text-blue-400 text-sm">Playing question audio...</p>
              </motion.div>
            )}

            {recordedBlobs.has(currentQuestionIndex) && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">✓ Answer recorded</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Recorder */}
        <div className="mb-8">
          <InterviewRecorder
            onRecordingComplete={handleRecordingComplete}
            onUploadFile={handleUploadFile}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentQuestionIndex
                  ? 'bg-white w-8'
                  : recordedBlobs.has(index)
                    ? 'bg-green-500'
                    : 'bg-white/20'
                  }`}
              />
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={submitInterview}
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Interview'}
              <Send size={20} />
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;