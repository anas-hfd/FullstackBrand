import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import ProcessTimeline from '@/components/ProcessTimeline'
import AIShowcase from '@/components/AIShowcase'
import ValueSection from '@/components/ValueSection'
import LeadForm from '@/components/LeadForm'
import AILabBridgeCard from '@/components/AILabBridgeCard'

const SITE_URL = 'https://www.fullstackbrand.co'

export const metadata: Metadata = {
  title: 'Studio — Commercial AI & Digital Deployment | FullstackBrand',
  description:
    'FullstackBrand Studio delivers commercial AI deployments, full-stack SaaS engineering, visual identity systems, and growth marketing — powered by AI Lab R&D.',
  alternates: {
    canonical: `${SITE_URL}/studio`,
  },
  openGraph: {
    title: 'FullstackBrand Studio | Creative Brand Experience & AI Systems',
    description:
      'We craft bold visual identities, automated AI workflows, high-performance web platforms, and growth-driven marketing strategies.',
    url: `${SITE_URL}/studio`,
    siteName: 'FullstackBrand',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FullstackBrand Studio — Full Branding & AI Automation Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FullstackBrand Studio | Creative Brand Experience & AI Systems',
    description:
      'Bold branding. Intelligent automation. High-performance web. Growth marketing. FullstackBrand is your full branding ecosystem partner.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/logos/Logomark.png',
    shortcut: '/logos/Logomark.png',
    apple: '/logos/Logomark.png',
  },
}

export default function StudioPage() {
  return (
    <div className="relative pb-12 bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-white min-h-screen" data-theme-route="studio">
      <Hero />
      <Services />
      <ProcessTimeline />
      <AIShowcase />
      <ValueSection />
      <LeadForm />
      <AILabBridgeCard />
    </div>
  )
}
