import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Brain, FileSearch, Mic2, ShieldCheck, Code2, LineChart } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, XAxis } from 'recharts'
import { Button } from '../ui/button'
import { brands, faqs, timelineData } from './landingData'

// Premium Section Header
function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-5xl font-sans">
        {title}
      </h2>
      <p className="mt-4 font-sans text-xs leading-relaxed text-neutral-400">
        {copy}
      </p>
    </div>
  )
}

// 1. Sleek Grayscale TrustedBy
export function TrustedBy() {
  return (
    <section className="border-y border-neutral-900 bg-black py-10 px-6">
      <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-6 md:flex-row">
        <p className="font-mono text-[9px] tracking-widest uppercase text-neutral-600">
          Preparing candidates at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
          {brands.map((brand) => (
            <span key={brand} className="hover:text-neutral-300 transition duration-200">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// 2. Bento Grid Features with Visual Mocks
export function FeatureGrid() {
  const bentoFeatures = [
    {
      title: 'AI Resume Alignment',
      description: 'Parses your professional experience against targeted job descriptions to customize drill topics.',
      icon: FileSearch,
      visual: (
        <div className="relative h-28 w-full border border-neutral-900 bg-neutral-950 rounded-lg overflow-hidden p-3 font-mono text-[9px] text-neutral-500">
          <div className="border-b border-neutral-900 pb-1.5 flex justify-between text-neutral-400">
            <span>RESUME.PDF</span>
            <span>MATCH: 92%</span>
          </div>
          <p className="mt-2 text-white/70 font-semibold">[Highlights Detected]</p>
          <p className="mt-1 leading-normal">• Managed distributed pub-sub pipeline</p>
          <p className="leading-normal">• Mitigated read contention bottlenecks</p>
          <div className="absolute bottom-1 right-2 text-neutral-600 text-[8px]">PARSED // COMPLETED</div>
        </div>
      )
    },
    {
      title: 'Decibel & Pace Calibration',
      description: 'Monitors voice flow, filler frequencies, and tone stability to eliminate verbal friction.',
      icon: Mic2,
      visual: (
        <div className="h-28 w-full border border-neutral-900 bg-neutral-950 rounded-lg flex flex-col justify-between p-3 font-mono text-[9px]">
          <div className="flex justify-between text-neutral-500">
            <span>SIGNAL</span>
            <span>0.00ms DELAY</span>
          </div>
          <div className="flex items-end justify-center gap-1.5 h-12">
            {[12, 28, 48, 18, 38, 54, 22, 10, 34, 18].map((h, i) => (
              <span key={i} className="w-1.5 rounded-full bg-neutral-800" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-[8px] text-neutral-600">
            <span>STABLE PITCH</span>
            <span>WPM: 140 [IDEAL]</span>
          </div>
        </div>
      )
    },
    {
      title: 'Structural STAR Evaluation',
      description: 'Scores answer coherence, depth of technical details, and results validation.',
      icon: Brain,
      visual: (
        <div className="h-28 w-full border border-neutral-900 bg-neutral-950 rounded-lg p-3 font-mono text-[9px] text-neutral-500 leading-normal">
          <div className="flex justify-between text-neutral-400 mb-2">
            <span>STAR MATRIX</span>
            <span>SCORE: 86/100</span>
          </div>
          <div>
            <p className="text-white/60">[S] Situation: Clear context</p>
            <p className="text-white/60">[T] Task: Decoupling systems</p>
            <p className="text-white/60">[A] Action: High detail</p>
            <p className="text-neutral-600">[R] Result: Missing metrics</p>
          </div>
        </div>
      )
    },
    {
      title: 'Simulated Camera Flow',
      description: 'Calibrates posture, focus, and presentation clarity under interview simulation settings.',
      icon: ShieldCheck,
      visual: (
        <div className="h-28 w-full border border-neutral-900 bg-neutral-950 rounded-lg flex items-center justify-center p-3">
          <div className="relative size-16 rounded-full border border-neutral-800 bg-neutral-900 flex items-center justify-center">
            <div className="size-8 rounded-full border border-white/5 bg-black/40 flex items-center justify-center text-[10px] text-neutral-400 font-mono">
              REC
            </div>
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      )
    },
    {
      title: 'Interactive Skill Mapping',
      description: 'Identifies knowledge gaps using high-fidelity multidimensional radar charts.',
      icon: Code2,
      visual: (
        <div className="h-28 w-full border border-neutral-900 bg-neutral-950 rounded-lg flex items-center justify-center p-2">
          <div className="w-20 h-20 border border-dashed border-neutral-800 rounded-full flex items-center justify-center opacity-40">
            <div className="w-10 h-10 border border-dashed border-neutral-700 rounded-full" />
          </div>
        </div>
      )
    },
    {
      title: 'Longitudinal Tracing',
      description: 'Compounds session historical data to reveal continuous performance trajectory.',
      icon: LineChart,
      visual: (
        <div className="h-28 w-full border border-neutral-900 bg-neutral-950 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex justify-between font-mono text-[9px] text-neutral-500">
            <span>HISTORY</span>
            <span>+18% GAIN</span>
          </div>
          <div className="flex items-end justify-between h-12 px-1">
            {[10, 18, 25, 42, 58, 79, 91].map((h, i) => (
              <span key={i} className="w-2 bg-neutral-800 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      )
    }
  ]

  return (
    <section id="features" className="bg-black py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="CAPABILITY LIST"
          title="Analytical calibration for every response."
          copy="A full diagnostic suite scanning resume synchronization, response structure, speech fluency, and delivery dynamics."
        />
        
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bentoFeatures.map((feat) => {
            const Icon = feat.icon
            return (
              <div key={feat.title} className="glow-card rounded-2xl border border-neutral-900 bg-neutral-950/40 p-5 flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="flex size-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="mt-4 font-sans text-sm font-semibold text-white">{feat.title}</h3>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-neutral-400">{feat.description}</p>
                </div>
                <div className="mt-6">
                  {feat.visual}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// 3. How It Works Timeline Pipeline
export function HowItWorks() {
  const customSteps = [
    { label: 'Upload Credentials', desc: 'Sync LinkedIn profile, resume, or targeted job specifications.' },
    { label: 'AI Calibrator Configures', desc: 'Synthesizes specialized questions matching your target team.' },
    { label: 'Execute Mock Drill', desc: 'Answer questions in the simulated live interview console.' },
    { label: 'Inspect Report Diagnostics', desc: 'Get structural scoring, speech calibrations, and action plans.' }
  ]

  return (
    <section id="how-it-works" className="bg-black py-24 px-6 border-t border-neutral-900">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="PIPELINE OVERVIEW"
          title="A systematic loop to precision."
          copy="Transition from raw experience credentials into target practice cycles and quantitative diagnosis reports."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-4 relative">
          {customSteps.map((step, idx) => (
            <div key={idx} className="relative p-5 rounded-2xl border border-neutral-900 bg-neutral-950/40 flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block mb-4">
                  Step 0{idx + 1}
                </span>
                <h3 className="font-sans text-xs font-semibold text-white">{step.label}</h3>
                <p className="mt-2 font-sans text-[11px] leading-relaxed text-neutral-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 4. Interactive Analysis Showcase
export function AnalysisShowcase() {
  const [activeSpeed, setActiveSpeed] = useState(135)
  const metricsList = [
    { name: 'Confidence stability', val: 91 },
    { name: 'Structural clarity', val: 86 },
    { name: 'Filler count [Target: <2]', val: 96 },
    { name: 'Fluency rate', val: 78 }
  ]

  return (
    <section className="bg-black py-24 px-6 border-t border-neutral-900">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="DIAGNOSTIC DASHBOARD"
          title="Examine raw signal maps."
          copy="A high-fidelity performance analyzer mapping response profiles, confidence timelines, and actionable suggestions."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {/* Diagnostic Metrics Slider Panel */}
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 lg:col-span-6 flex flex-col justify-between min-h-[320px]">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Live Voice Decibel</span>
              <div className="mt-4 space-y-4">
                {metricsList.map((m) => (
                  <div key={m.name}>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-400 mb-1">
                      <span>{m.name}</span>
                      <span>{m.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.val}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-white/70 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-900/60 pt-4">
              <div className="flex justify-between font-mono text-[10px] text-neutral-400 mb-2">
                <span>Calibration pace controller</span>
                <span>{activeSpeed} WPM</span>
              </div>
              <input
                type="range"
                min="90"
                max="190"
                value={activeSpeed}
                onChange={(e) => setActiveSpeed(Number(e.target.value))}
                className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between font-mono text-[8px] text-neutral-600 mt-1">
                <span>STEADY</span>
                <span>FAST</span>
              </div>
            </div>
          </div>

          {/* Visual Area & Bar Chart components */}
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 lg:col-span-6 flex flex-col justify-between min-h-[320px]">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Answer Coherence</span>
              <div className="h-44 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="whiteGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.08}/>
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#525252" tickLine={false} axisLine={false} tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                    <Area type="monotone" dataKey="score" stroke="#ffffff" strokeWidth={1} fill="url(#whiteGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 border-t border-neutral-900 pt-3 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Recommendation</span>
              <span className="font-mono text-[9px] text-neutral-400">[Structure validated: STAR ok]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 5. Grid-Style Comparison Table
export function Comparison() {
  const comparisonRows = [
    { metric: 'Feedback detail', old: 'Guesswork, generalized notes', new: 'Word-by-word transcription diagnostics' },
    { metric: 'Calibration customization', old: 'Standard online templates', new: 'Custom resume/JD synthesis' },
    { metric: 'Speech analytics', old: 'Unmeasured pace / voice checks', new: 'Exact Decibel & WPM calibration' },
    { metric: 'Historical trace', old: 'Hard to monitor progression', new: 'Longitudinal diagnostics dashboards' }
  ]

  return (
    <section id="comparison" className="bg-black py-24 px-6 border-t border-neutral-900">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="COMPARATIVE STUDY"
          title="Calibrated vs Guesswork."
          copy="Standard preparation methods leave critical variables to chance. Mockable provides measurable diagnostics."
        />

        <div className="mt-16 overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950/40">
          <div className="grid grid-cols-3 border-b border-neutral-900 bg-neutral-950 p-4 font-mono text-[9px] uppercase tracking-widest text-neutral-400">
            <span>PARAMETER</span>
            <span>TRADITIONAL ROUTINES</span>
            <span>MOCKABLE PLATFORM</span>
          </div>
          {comparisonRows.map((row) => (
            <div key={row.metric} className="grid grid-cols-3 gap-4 border-b border-neutral-900 p-4 font-sans text-xs last:border-b-0 leading-relaxed">
              <span className="font-medium text-white">{row.metric}</span>
              <span className="text-neutral-500">{row.old}</span>
              <span className="text-neutral-300 font-medium">{row.new}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 6. Testimonials & Glowing Premium Pricing Cards
export function TestimonialsPricingFaq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  const testimonialList = [
    { name: 'Nikhil R.', role: 'SDE, Google', quote: 'The speech analytics were eye-opening. I structured my architecture examples far cleaner after measuring the exact timestamps of my transitions.' },
    { name: 'Maya S.', role: 'Product Lead, Notion', quote: 'Mockable generated highly specific behavioral loops matching Notion culture. It is not just mock prep; it is target team simulation.' },
    { name: 'Aarav M.', role: 'AI Developer, Stripe', quote: 'The exact scoring calibration gave me immediate feedback. I walked into the final technical round with absolute confidence.' }
  ]

  const pricingTiers = [
    { name: 'Free tier', price: '0', desc: 'Calibrate your initial performance profile.', perks: ['1 full dynamic interview', 'Basic signal analytics', 'Resume setup parsing'], isPopular: false },
    { name: 'Professional', price: '12', desc: 'Calibrate prep cycles to professional level.', perks: ['Unlimited practice scenarios', 'Precision decibel calibration', 'STAR structured reports', 'Longitudinal tracing track'], isPopular: true },
    { name: 'Enterprise', price: 'Custom', desc: 'Equip candidate groups at scale.', perks: ['Custom administrative dashboards', 'Priority support channels', 'Bulk configuration profiles'], isPopular: false }
  ]

  return (
    <>
      {/* Testimonials */}
      <section id="testimonials" className="bg-black py-24 px-6 border-t border-neutral-900">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="PROFILES OF SUCCESS"
            title="Calibrated to clear high standards."
            copy="Engineers and managers use Mockable to refine structural clarity and verbal presence before interviews."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonialList.map((t) => (
              <div key={t.name} className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 flex flex-col justify-between">
                <p className="font-sans text-xs leading-relaxed text-neutral-300">
                  "{t.quote}"
                </p>
                <div className="mt-6 pt-4 border-t border-neutral-900/60 flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-full bg-white/5 font-mono text-[10px] text-neutral-400">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-semibold text-white">{t.name}</h4>
                    <p className="font-mono text-[9px] text-neutral-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-black py-24 px-6 border-t border-neutral-900">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="COMMERCIAL MODULES"
            title="Clean options. Absolute focus."
            copy="Invest in structured diagnostics to calibrate interview readiness systematically."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {pricingTiers.map((p) => (
              <div
                key={p.name}
                className={`glow-card rounded-2xl border p-7 flex flex-col justify-between min-h-[380px] ${
                  p.isPopular ? 'border-neutral-700 bg-neutral-950 shadow-2xl' : 'border-neutral-900 bg-neutral-950/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{p.name}</span>
                    {p.isPopular && (
                      <span className="font-mono text-[8px] uppercase tracking-widest text-white border border-white/20 bg-neutral-900 px-2 py-0.5 rounded">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <div className="mt-6 flex items-baseline text-white">
                    <span className="text-4xl font-medium font-sans tracking-tight">
                      {p.price === 'Custom' ? p.price : `$${p.price}`}
                    </span>
                    {p.price !== 'Custom' && <span className="ml-1 font-mono text-xs text-neutral-500">/mo</span>}
                  </div>
                  <p className="mt-3 font-sans text-xs text-neutral-400 leading-normal">{p.desc}</p>

                  <div className="mt-6 space-y-2.5 font-sans text-xs text-neutral-300">
                    {p.perks.map((perk) => (
                      <div key={perk} className="flex items-center gap-2">
                        <Check className="size-3 text-white" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button asChild className={`mt-8 w-full rounded-full font-mono text-[10px] uppercase tracking-wider h-10 ${
                  p.isPopular ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}>
                  <Link to="/register">Choose {p.name}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-black py-24 px-6 border-t border-neutral-900">
        <div className="mx-auto max-w-3xl">
          <SectionHeader
            eyebrow="DISCLOSURE SHEETS"
            title="General Queries."
            copy="Clear details detailing calibration profiles, video parameters, and diagnostic tools."
          />

          <div className="mt-12 space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div key={faq.q} className="rounded-xl border border-neutral-900 bg-neutral-950/40 overflow-hidden transition-colors">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-sans text-xs font-semibold text-white hover:bg-neutral-900/30"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`size-3 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="p-5 pt-0 font-sans text-[11px] leading-relaxed text-neutral-400 border-t border-neutral-900/60">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

// 7. Dashboard Preview Section
export function DashboardPreview() {
  return (
    <section className="bg-black py-24 px-6 border-t border-neutral-900">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-16">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Cockpit Preview</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-5xl font-sans">
              Your post-interview cockpit.
            </h2>
          </div>
          <Button asChild className="w-fit rounded-full bg-white px-5 font-mono text-[10px] uppercase tracking-wider text-black hover:bg-neutral-200">
            <Link to="/register">Open my report <ArrowRight className="size-3.5 ml-1 inline" /></Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left panel: overall and strengths */}
          <div className="grid gap-6 lg:col-span-5">
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 flex flex-col justify-between min-h-[140px]">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Overall calibrated score</span>
                <p className="mt-4 font-mono text-5xl font-semibold text-white">87</p>
              </div>
              <p className="mt-4 font-mono text-[10px] text-emerald-400">+18 points gained since diagnostic</p>
            </div>
            
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 flex flex-col justify-between min-h-[140px]">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Calibrated strengths</span>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Architecture design', 'STAR layout', 'Steady WPM', 'Role sync'].map((item) => (
                    <span key={item} className="rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1 font-mono text-[9px] text-neutral-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: analysis metrics details */}
          <div className="grid gap-6 md:grid-cols-2 lg:col-span-7">
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Skill Vectors</span>
              <div className="mt-4 space-y-2 font-mono text-[10px] text-neutral-400">
                {['System design', 'Behavioral logic', 'Debugging efficiency', 'Leadership focus'].map((item, index) => (
                  <div key={item} className="flex justify-between border-b border-neutral-900 pb-2 last:border-b-0 last:pb-0">
                    <span>{item}</span>
                    <span className="text-white font-medium">{82 + index * 3}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Critical calibration offsets</span>
              <div className="mt-4 space-y-3 font-mono text-[10px] text-neutral-400">
                {['Quantify trade-offs sooner', 'Increase structural transitions', 'Steady speed under questions'].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="mt-1 size-1 rounded-full bg-white shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 md:col-span-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Transcript diagnostic insight</span>
              <p className="mt-3 font-sans text-xs leading-relaxed text-neutral-400">
                Strong technical details validated in late answers. Calibration indicates delivery pacing is excellent. Work on structuring STAR indicators early in behavioral drills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 8. Deep-Black Cinematic Final CTA
export function FinalCta() {
  return (
    <section className="bg-black py-32 px-6 border-t border-neutral-900 relative overflow-hidden">
      {/* Background spot */}
      <div className="absolute left-1/2 bottom-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.015] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
          Calibrate now
        </p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight text-white sm:text-5xl font-sans leading-tight">
          Eliminate interview variables.
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-sans text-xs leading-relaxed text-neutral-400">
          Calibrate your speaking presence, analyze delivery indicators, and prepare for high-stakes roles with absolute certainty.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild className="h-11 rounded-full bg-white px-7 font-mono text-[10px] font-semibold text-black uppercase tracking-wider hover:bg-neutral-200">
            <Link to="/register">
              Start Free AI Interview <ArrowRight className="size-3.5 ml-1 inline" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
