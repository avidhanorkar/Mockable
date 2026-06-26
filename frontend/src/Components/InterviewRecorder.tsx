import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Square, Play, Pause, Upload } from 'lucide-react';


interface InterviewRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
    onUploadFile?: (file: File) => void;
}

const InterviewRecorder: React.FC<InterviewRecorderProps> = ({
    onRecordingComplete,
    onUploadFile
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<number | null>(null);

    // Request camera and microphone permissions
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: videoEnabled,
                audio: audioEnabled
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Failed to access camera/microphone. Please check permissions.');
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    // Start recording
    const startRecording = () => {
        if (!stream) return;

        const options = { mimeType: 'video/webm;codecs=vp9' };
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setRecordedChunks(prev => [...prev, event.data]);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            onRecordingComplete(blob);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);

        // Start timer
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    // Pause/Resume recording
    const togglePause = () => {
        if (!mediaRecorderRef.current) return;

        if (isPaused) {
            mediaRecorderRef.current.resume();
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            mediaRecorderRef.current.pause();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        setIsPaused(!isPaused);
    };

    // Toggle video
    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoEnabled(videoTrack.enabled);
            }
        }
    };

    // Toggle audio
    const toggleAudio = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioEnabled(audioTrack.enabled);
            }
        }
    };

    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Initialize camera on mount
    useEffect(() => {
        startCamera();
        return () => {
            // Cleanup: Stop camera when component unmounts
            stopCamera();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []); // Empty dependency array ensures this only runs once

    // Update camera stream when video/audio settings change
    useEffect(() => {
        if (stream && !isRecording) {
            // Restart camera with new settings
            stopCamera();
            startCamera();
        }
    }, [videoEnabled, audioEnabled]);

    return (
        <div className="w-full h-full flex flex-col gap-3">
            {/* Video Preview */}
            <motion.div
            className="relative bg-neutral-950 rounded-2xl overflow-hidden flex-1 min-h-0 border border-neutral-900"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />

                {/* Recording indicator */}
                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-full"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <motion.div
                                className="w-3 h-3 bg-white rounded-full"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-white font-semibold">{formatTime(recordingTime)}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Paused overlay */}
                <AnimatePresence>
                    {isPaused && (
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="text-white text-2xl font-bold">PAUSED</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Controls row */}
            <div className="flex-none flex items-center justify-center gap-4 flex-wrap py-1">
                {/* Video toggle */}
                <motion.button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full transition-all ${videoEnabled
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isRecording}
                >
                    {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                </motion.button>

                {/* Audio toggle */}
                <motion.button
                    onClick={toggleAudio}
                    className={`p-4 rounded-full transition-all ${audioEnabled
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isRecording}
                >
                    {audioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                </motion.button>

                {/* Record/Stop button */}
                {!isRecording ? (
                    <motion.button
                        onClick={startRecording}
                        className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold flex items-center gap-2 shadow-lg shadow-red-500/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="w-4 h-4 bg-white rounded-full" />
                        Start Recording
                    </motion.button>
                ) : (
                    <>
                        {/* Pause/Resume */}
                        <motion.button
                            onClick={togglePause}
                            className="p-4 rounded-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isPaused ? <Play size={24} /> : <Pause size={24} />}
                        </motion.button>

                        {/* Stop */}
                        <motion.button
                            onClick={stopRecording}
                            className="px-8 py-4 bg-white hover:bg-gray-200 text-black rounded-full font-semibold flex items-center gap-2 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Square size={20} />
                            Stop Recording
                        </motion.button>
                    </>
                )}
            </div>

            {/* Upload option — styled to match dark UI */}
            {onUploadFile && !isRecording && (
                <div className="flex-none">
                    <input
                        type="file"
                        accept="video/*,audio/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUploadFile(file);
                        }}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-neutral-800 rounded-xl font-mono text-[9px] uppercase tracking-widest text-neutral-600 hover:text-neutral-400 hover:border-neutral-700 transition-colors cursor-pointer"
                    >
                        <Upload size={12} />
                        Upload pre-recorded file
                    </label>
                </div>
            )}
        </div>
    );
};

export default InterviewRecorder;
