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
      <Hero />
      <Services />
      <ProcessTimeline />
      <AIShowcase />
      <ValueSection />
      <LeadForm />
    </div>
  )
}