// FullstackBrand Agency Page
import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import ProcessTimeline from '@/components/ProcessTimeline'
import AIShowcase from '@/components/AIShowcase'
import ValueSection from '@/components/ValueSection'
import LeadForm from '@/components/LeadForm'

const SITE_URL = 'https://www.fullstackbrand.co'

export const metadata: Metadata = {
  title: 'Agency & Creative Brand Studio | FullstackBrand',
  description:
    'FullstackBrand Agency delivers bold visual identities, AI-driven workflow automation, enterprise web platforms, and high-conversion digital marketing.',
  alternates: {
    canonical: `${SITE_URL}/agency`,
  },
  openGraph: {
    title: 'FullstackBrand Agency | Creative Brand Experience & AI Systems',
    description:
      'We craft bold visual identities, automated AI workflows, high-performance web platforms, and growth-driven marketing strategies.',
    url: `${SITE_URL}/agency`,
    siteName: 'FullstackBrand',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FullstackBrand Agency — Full Branding & AI Automation Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FullstackBrand Agency | Creative Brand Experience & AI Systems',
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

export default function AgencyPage() {
  return (
    <div className="relative pb-20 bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-white bg-noise min-h-screen" data-theme-route="agency">
      {/* High-Performance 60fps GPU Mesh Gradient */}
      <div className="gpu-mesh-agency" aria-hidden="true" />
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
        Fullstack Brand Agency — Creative Brand Experience · AI-Powered Digital Agency. Your brand deserves more than a logo. We build bold visual identities, AI-powered automation, high-performance web platforms, and growth-driven marketing strategies — all under one roof.
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
