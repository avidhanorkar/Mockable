import { AudioWaveform, Brain, BriefcaseBusiness, Code2, FileSearch, Gauge, LineChart, MessageSquareText, Mic2, MonitorUp, ShieldCheck, Video } from 'lucide-react'

export const brands = ['Stanford', 'IIT', 'YC', 'Linear', 'Vercel', 'OpenAI', 'Stripe', 'Notion']

export const features = [
  { icon: Brain, title: 'AI Interview Generation', copy: 'Role-specific interviews shaped by your resume, seniority, and target company.' },
  { icon: FileSearch, title: 'Resume Analysis', copy: 'Find weak signals, missing keywords, and talking points before the interview starts.' },
  { icon: BriefcaseBusiness, title: 'JD Parsing', copy: 'Turn any job description into a focused prep plan with weighted skill coverage.' },
  { icon: Mic2, title: 'Real-time Audio', copy: 'Capture answers naturally with pacing, fluency, pauses, and filler-word detection.' },
  { icon: Video, title: 'Video Interview', copy: 'Practice screen presence, stability, and confidence in a realistic interview flow.' },
  { icon: AudioWaveform, title: 'Speech Analysis', copy: 'See how clearly you communicate, where you rush, and when you lose precision.' },
  { icon: Gauge, title: 'Sentiment Detection', copy: 'Understand tone, hesitation, energy, and confidence shifts across each answer.' },
  { icon: ShieldCheck, title: 'Confidence Detection', copy: 'Track measurable confidence so the next interview feels less like chance.' },
  { icon: Code2, title: 'Technical Feedback', copy: 'Score technical accuracy against the role, not generic interview advice.' },
  { icon: MessageSquareText, title: 'Behavioral Analysis', copy: 'Sharpen structure, depth, examples, and follow-through in behavioral answers.' },
  { icon: MonitorUp, title: 'Performance Dashboard', copy: 'A complete report with strengths, gaps, transcript, metrics, and next actions.' },
  { icon: LineChart, title: 'Progress Tracking', copy: 'Every session compounds into a clearer view of what is improving.' },
]

export const steps = ['Login', 'Upload resume', 'Paste job description', 'AI creates questions', 'Answer with audio', 'AI evaluates', 'Review dashboard', 'Improve']

export const radarData = [
  { subject: 'Technical', value: 86 },
  { subject: 'Clarity', value: 78 },
  { subject: 'Confidence', value: 91 },
  { subject: 'Structure', value: 82 },
  { subject: 'Fluency', value: 74 },
  { subject: 'Impact', value: 88 },
]

export const barData = [
  { name: 'Q1', score: 72 },
  { name: 'Q2', score: 88 },
  { name: 'Q3', score: 81 },
  { name: 'Q4', score: 93 },
  { name: 'Q5', score: 84 },
]

export const timelineData = [
  { name: '0m', score: 62 },
  { name: '4m', score: 68 },
  { name: '8m', score: 76 },
  { name: '12m', score: 79 },
  { name: '16m', score: 87 },
  { name: '20m', score: 91 },
]

export const testimonials = [
  { name: 'Aarav Menon', role: 'SDE Intern, Bengaluru', quote: 'Mockable made feedback feel surgical. I stopped guessing and fixed the exact parts of my answers that were costing me rounds.' },
  { name: 'Maya Shah', role: 'Product Manager', quote: 'The behavioral analysis is the first prep tool that actually showed me where my examples felt thin.' },
  { name: 'Nikhil Rao', role: 'Data Scientist', quote: 'The dashboard turned interview prep into a measurable loop. Every practice session had a clear next move.' },
]

export const faqs = [
  { q: 'How does Mockable personalize an interview?', a: 'Mockable combines your resume, target role, job description, and experience level to generate questions that match the interview you are actually preparing for.' },
  { q: 'Can I practice without video?', a: 'Yes. You can answer with audio-first sessions and still receive transcript, fluency, confidence, filler-word, and technical feedback.' },
  { q: 'What does the report include?', a: 'You get an overall score, answer-by-answer feedback, strengths, weak areas, speech metrics, transcript review, and AI suggestions for your next session.' },
  { q: 'Who is Mockable built for?', a: 'Students, fresh graduates, software engineers, job switchers, PMs, designers, data scientists, MBA graduates, and anyone preparing for high-stakes interviews.' },
]
