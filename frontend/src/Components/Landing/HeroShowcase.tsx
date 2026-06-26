import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CirclePlay, Mic, Activity, ShieldCheck, Zap } from 'lucide-react'
import { PolarAngleAxis, PolarGrid, Radar as RadarShape, RadarChart, ResponsiveContainer } from 'recharts'
import { Button } from '../ui/button'
import { radarData } from './landingData'

// Simulated subtitle quotes typing effect
const transcriptQuotes = [
  "We scaled our writes by implementing a write-through cache...",
  "The bottleneck was database locking, so we refactored into batch inserts...",
  "I evaluated the tradeoffs between consistency and availability before designing...",
  "By decoupling the ingestion workers from the analytics pipeline, latency dropped by 40%..."
]

function HeroVisual() {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [displayedQuote, setDisplayedQuote] = useState("")
  
  useEffect(() => {
    let timer: any
    let currentQuote = transcriptQuotes[quoteIndex]
    let index = 0
    
    const type = () => {
      if (index < currentQuote.length) {
        setDisplayedQuote(currentQuote.slice(0, index + 1))
        index++
        timer = setTimeout(type, 35)
      } else {
        // Wait at the end of quote
        timer = setTimeout(() => {
          // Erase quote
          const erase = () => {
            if (index > 0) {
              setDisplayedQuote(currentQuote.slice(0, index - 1))
              index--
              timer = setTimeout(erase, 15)
            } else {
              setQuoteIndex((prev) => (prev + 1) % transcriptQuotes.length)
            }
          }
          erase()
        }, 3000)
      }
    }
    
    type()
    return () => clearTimeout(timer)
  }, [quoteIndex])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-20 w-full max-w-5xl px-2 sm:px-6"
    >
      {/* Background radial spotlight */}
      <div className="absolute -inset-10 rounded-[3rem] bg-white/5 opacity-40 blur-3xl pointer-events-none" />
      
      {/* Container Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950/80 p-4 shadow-2xl backdrop-blur-2xl md:p-6">
        {/* Top bar simulating a modern application frame */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-neutral-800" />
            <span className="size-2.5 rounded-full bg-neutral-800" />
            <span className="size-2.5 rounded-full bg-neutral-800" />
          </div>
          <div className="rounded-full border border-neutral-900 bg-neutral-950 px-3.5 py-1 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
            CALIBRATION SESSION // ID: 884-X
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE ENGINE
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid gap-6 pt-6 lg:grid-cols-12">
          {/* Main Visualizer Panel */}
          <div className="rounded-xl border border-neutral-900 bg-neutral-950/50 p-5 lg:col-span-7 flex flex-col justify-between min-h-[360px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Live Transcript Analysis</span>
                <span className="flex items-center gap-1 font-mono text-[9px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  <Mic className="size-3 text-neutral-300" /> WPM: 138
                </span>
              </div>
              
              <div className="mt-6">
                <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">Active Question</p>
                <h3 className="mt-2 text-xl font-medium tracking-tight text-white leading-snug">
                  "Explain how you design a cache invalidation strategy for high-throughput messaging feeds."
                </h3>
              </div>
            </div>

            {/* Speech Ticker & Waveform */}
            <div className="mt-8">
              <div className="rounded-lg border border-neutral-900/60 bg-neutral-900/10 p-4 min-h-[80px]">
                <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">Candidate Speech</p>
                <p className="font-mono text-xs leading-relaxed text-neutral-300">
                  {displayedQuote}
                  <span className="inline-block w-1.5 h-3 bg-white ml-0.5 animate-pulse" />
                </p>
              </div>

              {/* Dynamic waveform visualizer */}
              <div className="mt-4 flex h-14 items-center gap-1 overflow-hidden px-1 border-t border-neutral-900/40 pt-3">
                {Array.from({ length: 42 }).map((_, index) => (
                  <motion.span
                    key={index}
                    animate={{
                      height: [
                        `${15 + (index % 5) * 8}%`,
                        `${40 + (index % 7) * 9}%`,
                        `${20 + (index % 4) * 11}%`
                      ]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: index * 0.03
                    }}
                    className="w-1 rounded-full bg-neutral-800"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Metrics & Analytics side panel */}
          <div className="grid gap-6 lg:col-span-5">
            {/* Radar Chart Panel */}
            <div className="rounded-xl border border-neutral-900 bg-neutral-950/50 p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Performance Metrics</span>
                <span className="flex items-center gap-1 font-mono text-[9px] text-neutral-400">
                  <Activity className="size-3" /> Real-time
                </span>
              </div>
              <div className="mx-auto my-3 h-48 w-full max-w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke="rgba(255, 255, 255, 0.04)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#737373', fontSize: 9, fontFamily: 'monospace' }}
                    />
                    <RadarShape
                      dataKey="value"
                      stroke="#ffffff"
                      fill="#ffffff"
                      fillOpacity={0.06}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Keyword Extraction */}
            <div className="rounded-xl border border-neutral-900 bg-neutral-950/50 p-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Resume Alignment Scan</span>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['fault tolerance', 'write-through', 'decoupling', 'caching', 'concurrency'].map((tag) => (
                    <span key={tag} className="rounded border border-neutral-900 bg-neutral-950 px-2 py-0.5 font-mono text-[9px] text-neutral-400">
                      [{tag}]
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-neutral-900 pt-3 flex items-center justify-between">
                <span className="font-mono text-[10px] text-neutral-500">Confidence Score</span>
                <span className="font-mono text-sm font-semibold text-white">91%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Micro Diagnostic widgets */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-16 hidden rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 shadow-xl md:flex items-center gap-3"
      >
        <div className="flex size-7 items-center justify-center rounded-lg bg-white/5">
          <ShieldCheck className="size-4 text-neutral-300" />
        </div>
        <div>
          <p className="font-mono text-[9px] text-neutral-500 uppercase">Tone Analysis</p>
          <p className="font-mono text-xs font-semibold text-neutral-200">Stable Decibels</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-8 bottom-16 hidden rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 shadow-xl md:flex items-center gap-3"
      >
        <div className="flex size-7 items-center justify-center rounded-lg bg-white/5">
          <Zap className="size-4 text-neutral-300" />
        </div>
        <div>
          <p className="font-mono text-[9px] text-neutral-500 uppercase">AI Recommendation</p>
          <p className="font-mono text-xs font-semibold text-neutral-200">Structure tradeoffs next</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HeroShowcase() {
  return (
    <section className="relative overflow-hidden bg-black pb-28 pt-24 sm:pt-32">
      {/* Background dot pattern and spot shadow */}
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-40" />
      <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Status indicator */}
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/40 px-3.5 py-1 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-1.5 bg-neutral-400"></span>
          </span>
          System Online // calibrating interviews
        </div>

        {/* Hero Headlines */}
        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-medium tracking-tight text-white sm:text-6xl md:text-7xl font-sans">
          Simulate reality.<br />
          <span className="text-shimmer">Perfect your delivery.</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-pretty font-sans text-sm leading-relaxed text-neutral-400 sm:text-base">
          Upload your resume and role specifications. Mockable generates direct, customized interview drills, analyzes your voice indicators, and constructs a precise roadmap to mastery.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Button asChild className="h-11 rounded-full bg-white px-6 font-mono text-[10px] font-semibold text-black uppercase tracking-wider transition hover:bg-neutral-200">
            <Link to="/register">
              Start Free AI Interview <ArrowRight className="size-3.5 ml-1 inline" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full border-neutral-800 bg-neutral-950/40 px-6 font-mono text-[10px] font-semibold text-neutral-300 uppercase tracking-wider transition hover:bg-neutral-900 hover:text-white">
            <Link to="/login">
              <CirclePlay className="size-3.5 mr-1 inline" /> View flow
            </Link>
          </Button>
        </div>

        {/* Interactive Dashboard Mockup */}
        <HeroVisual />
      </div>
    </section>
  )
}
