// FullstackBrand AI Research Lab — Root Server Page
import type { Metadata } from 'next'
import AILabHomeClient from '@/components/ai-lab/AILabHomeClient'

const SITE_URL = 'https://www.fullstackbrand.co'

export const metadata: Metadata = {
  title: 'FullstackBrand AI Lab | AI Software & Generative Systems Studio · Frontier Deep Tech',
  description:
    'FullstackBrand AI Lab is an applied AI Software & Generative Systems Studio engineering autonomous multi-agent orchestration, neural architecture synthesis, foundation model fine-tuning, enterprise AI sovereignty, and deterministic cognitive workflows. TRL-7 validated systems architecture with non-egress air-gapped pipelines for scalable commercialization.',
  keywords: [
    'AI Software & Generative Systems Studio',
    'AI Software Studio',
    'Generative Systems Studio',
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
    'AI Research Lab',
    'Computational Intelligence',
    'FullstackBrand AI Lab',
    'GlyphForge AI Engine',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'FullstackBrand AI Lab | AI Software & Generative Systems Studio',
    description:
      'Applied deep-tech AI software studio engineering deterministic multi-agent orchestration, sovereign enterprise AI infrastructure, neural architecture synthesis, and commercialized cognitive workflows. TRL-7 validated · Non-Egress Air-Gapped Pipelines.',
    url: SITE_URL,
    siteName: 'FullstackBrand AI Software & Generative Systems Studio',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FullstackBrand AI Lab — AI Software & Generative Systems Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FullstackBrand AI Lab | AI Software & Generative Systems Studio',
    description:
      'Pioneering deterministic multi-agent systems, sovereign AI pipelines, RAG vector systems, and commercialized cognitive infrastructure. TRL-7 · Air-Gapped · Grant-Vetted.',
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