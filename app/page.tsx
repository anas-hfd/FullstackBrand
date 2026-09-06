// FullstackBrand AI Research Lab — Root Server Page
import type { Metadata } from 'next'
import AILabHomeClient from '@/components/ai-lab/AILabHomeClient'

const SITE_URL = 'https://www.fullstackbrand.co'

export const metadata: Metadata = {
  title: 'FullstackBrand AI Lab | Applied AI Engineering · Sovereign Infrastructure · Generative Systems',
  description:
    'FullstackBrand AI Lab is the R&D branch of FullstackBrand, an applied AI engineering company. We engineer deployable AI infrastructure: deterministic multi-agent orchestration, sovereign non-egress pipelines, hybrid LLM routing, and generative asset systems. Architecture advancing toward TRL-7.',
  keywords: [
    'Applied AI Engineering',
    'AI Research Lab',
    'AI Software Studio',
    'Generative Systems',
    'Frontier AI Research',
    'Applied Artificial Intelligence',
    'Deep Tech Innovation',
    'Autonomous Multi-Agent Systems',
    'Agentic Orchestration',
    'Neural Architecture Synthesis',
    'Foundation Model Fine-Tuning',
    'Enterprise AI Sovereignty',
    'Deterministic AI Reasoning',
    'RAG Vector Systems',
    'Technology Readiness Level TRL-7',
    'Non-Egress Air-Gapped Pipelines',
    'Computational Intelligence',
    'FullstackBrand AI Lab',
    'GlyphForge AI Engine',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'FullstackBrand AI Lab | Applied AI Engineering · Sovereign Infrastructure',
    description:
      'R&D branch of FullstackBrand: engineering deterministic multi-agent orchestration, sovereign enterprise AI infrastructure, hybrid model routing, and generative asset systems. Architecture advancing toward TRL-7.',
    url: SITE_URL,
    siteName: 'FullstackBrand AI Lab',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FullstackBrand AI Lab — Applied AI Engineering & Sovereign Infrastructure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FullstackBrand AI Lab | Applied AI Engineering',
    description:
      'Deployable AI infrastructure: deterministic multi-agent systems, sovereign non-egress pipelines, hybrid LLM routing, and generative asset engines. Advancing toward TRL-7.',
    images: ['/og-image.png'],
    site: '@fullstackbrand',
    creator: '@fullstackbrand',
  },
  icons: {
    icon: '/logos/Asset 25-8.png',
    shortcut: '/logos/Asset 25-8.png',
    apple: '/logos/Asset 25-8.png',
  },
}

export default function AILabPage() {
  return <AILabHomeClient />
}