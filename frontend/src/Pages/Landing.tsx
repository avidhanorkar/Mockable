import { useMemo, useState, type CSSProperties } from 'react'
import { useSEO } from '../hooks/useSEO'
import HeroShowcase from '../Components/Landing/HeroShowcase'
import { AnalysisShowcase, Comparison, DashboardPreview, FeatureGrid, FinalCta, HowItWorks, TestimonialsPricingFaq, TrustedBy } from '../Components/Landing/LandingSections'

export default function Landing() {
  useSEO({
    title: 'Mockable – AI Mock Interview Platform | Ace Your Next Interview',
    description: 'Mockable generates personalized AI interview questions from your resume and job description. Get real-time speech analysis, STAR scoring, and a detailed performance report. Start free today.',
    canonical: 'https://mockableinterviews.vercel.app/',
  })
  const [cursor, setCursor] = useState({ x: 50, y: 20 })
  const backgroundStyle = useMemo(() => ({
    backgroundImage: `radial-gradient(circle at ${cursor.x}% ${cursor.y}%, rgba(255, 255, 255, 0.025), transparent 28rem)`,
  }) satisfies CSSProperties, [cursor])

  return (
    <main
      style={backgroundStyle}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setCursor({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 })
      }}
      className="relative -mt-24 overflow-hidden bg-black text-white"
    >
      <HeroShowcase />
      <TrustedBy />
      <FeatureGrid />
      <HowItWorks />
      <AnalysisShowcase />
      <DashboardPreview />
      <Comparison />
      <TestimonialsPricingFaq />
      <FinalCta />
    </main>
  )
}
