import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, ArrowRight, FlaskConical } from 'lucide-react'
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
    icon: [
      { url: '/logos/Logomark.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/logos/Logomark.png',
    apple: '/logos/Logomark.png',
  },
}

export default function AgencyPage() {
  return (
    <div className="relative pb-12 bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-white bg-noise min-h-screen" data-theme-route="agency">
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

      {/* ── AI Lab Cross-Promotion Bridge Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-lab p-8 md:p-12 rounded-3xl border border-violet-500/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold font-mono">
              <FlaskConical size={14} /> FullstackBrand AI Research Lab
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
              Looking for Frontier AI Research &amp; Generative Systems?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed">
              Explore our deep-tech applied research branch — engineering deterministic multi-agent architectures, GlyphForge icon synthesis, and sovereign non-egress AI pipelines.
            </p>
          </div>

          <Link
            href="/"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-105 active:scale-95 transition-all duration-300"
            id="lab-bridge-cta"
          >
            <Sparkles size={16} />
            <span>Visit AI Research Lab</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
