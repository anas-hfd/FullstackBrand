// FullstackBrand
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import ProcessTimeline from '@/components/ProcessTimeline'
import AIShowcase from '@/components/AIShowcase'
import ValueSection from '@/components/ValueSection'
import LeadForm from '@/components/LeadForm'

export default function Home() {
  return (
    <div className="pb-20">
      {/* SEO reinforcement — visually hidden, crawlable by Google to prevent title rewriting */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Fullstack Brand — Creative Brand Experience · AI-Powered Digital Agency. Your brand deserves more than a logo. We build bold visual identities, AI-powered automation, high-performance web platforms, and growth-driven marketing strategies — all under one roof.
      </span>
      <Hero />
      <Services />
      <ProcessTimeline />
      <AIShowcase />
      <ValueSection />
      <LeadForm />
    </div>
  )
}