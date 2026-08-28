'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Zap,
  ArrowRight,
  GitBranch,
  Compass,
  Mail,
  Bell,
} from 'lucide-react'
import ResearchBenchmarks from '@/components/ai-lab/ResearchBenchmarks'
import GlyphForgeInteractive from '@/components/ai-lab/GlyphForgeInteractive'
import ArchitectureVisualizer from '@/components/ai-lab/ArchitectureVisualizer'
import SovereigntySection from '@/components/ai-lab/SovereigntySection'
import ParticleField from '@/components/ParticleField'

const technicalSpecs = [
  { label: 'Technology Readiness Level', value: 'TRL-7' },
  { label: 'Agent Routing Latency', value: '< 28ms P99' },
  { label: 'Deterministic Precision', value: '99.8%' },
  { label: 'Data Egress to Public LLMs', value: '0.00%' },
]

export default function AILabHomeClient() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 600, y: 300 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const heroEl = heroRef.current
    if (heroEl) {
      heroEl.addEventListener('mousemove', handleMouseMove)
    }
    return () => {
      if (heroEl) {
        heroEl.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <div className="relative pb-24 text-zinc-900 dark:text-white bg-noise w-full overflow-x-hidden" data-theme-route="lab">
      {/* ── High-Performance 60fps GPU Mesh Gradient ── */}
      <div className="gpu-mesh-lab" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION WITH MOUSE-REACTIVE SPOTLIGHT & FULL-WIDTH PARTICLES
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-12 sm:pt-16 pb-24 text-center overflow-hidden"
      >
        {/* Full-width responsive interactive particle dots (violet) */}
        <ParticleField color="violet" />

        {/* Dynamic Mouse-Following Radial Spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-80 dark:opacity-100 -z-10"
          style={{
            background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.18), transparent 80%)`,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Grant-aligned status badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/30 text-xs font-semibold text-violet-700 dark:text-violet-300 mb-8 shadow-sm"
          >
            <Sparkles size={14} className="text-violet-500 animate-pulse" />
            <span>AI Software &amp; Generative Systems Studio · TRL-7 Ready · Non-Egress Architecture</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] max-w-5xl mx-auto mb-8 text-zinc-900 dark:text-white"
          >
            Next-Generation Autonomous Systems &amp;{' '}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent glow-text-violet">
              Generative Tooling.
            </span>
          </motion.h1>

          {/* Hero Subtitle with Grant-Targeted Keywords */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Pioneering sovereign AI infrastructure, generative OS toolsets, and high-throughput enterprise SaaS. FullstackBrand AI Lab engineers deterministic multi-agent architectures and low-latency hybrid model pipelines ready for commercial deployment.
          </motion.p>

          {/* Action Buttons with Subtle Magnetic Hover Feel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.a
              href="#saas-development"
              whileHover={{ x: 6 }}
              whileTap={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-base shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 overflow-hidden"
              id="hero-cta-saas"
            >
              <Sparkles size={18} />
              <span>Launch GlyphForge AI Demo</span>
            </motion.a>

            <motion.a
              href="#architecture"
              whileHover={{ x: -6 }}
              whileTap={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 glass px-8 py-4 rounded-full font-bold text-base text-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 border border-zinc-300 dark:border-white/15 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-300 transition-colors duration-300 group"
              id="hero-cta-architecture"
            >
              <GitBranch size={18} />
              <span>Explore Topology Blueprint</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>
          </motion.div>

          {/* Technical Benchmarks / Grant Vetting Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {technicalSpecs.map((spec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.08 }}
                className="glass p-5 rounded-2xl border border-violet-500/20 dark:border-violet-400/10 text-left hover:border-violet-500/40 transition-colors"
              >
                <div className="text-xl md:text-2xl font-black text-violet-600 dark:text-violet-400 font-mono">
                  {spec.value}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider font-mono">
                  {spec.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1: RESEARCH (#research)
      ══════════════════════════════════════════════════════════════════════ */}
      <ResearchBenchmarks />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2: SAAS DEVELOPMENT (#saas-development) — Featuring GlyphForge
      ══════════════════════════════════════════════════════════════════════ */}
      <GlyphForgeInteractive />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3: ARCHITECTURE (#architecture) — Interactive Visual Topology
      ══════════════════════════════════════════════════════════════════════ */}
      <ArchitectureVisualizer />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4: SOVEREIGNTY (#sovereignty) — Zero-Data-Retention & Air-Gapping
      ══════════════════════════════════════════════════════════════════════ */}
      <SovereigntySection />

      {/* ══════════════════════════════════════════════════════════════════════
          GET UPDATES / NEWSLETTER (#updates)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="updates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative scroll-mt-24">
        <span id="waitlist" className="absolute -top-28" />
        <div
          className="rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.08) 50%, rgba(167,139,250,0.06) 100%)',
            border: '1px solid rgba(139,92,246,0.25)',
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-violet-600/20 to-transparent blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/15 border border-violet-500/30 text-xs font-mono font-bold text-violet-700 dark:text-violet-300">
              <Bell size={12} className="animate-pulse" />
              Direct Updates · Research Briefings &amp; Software Releases
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
              Get Updates from{' '}
              <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
                FullstackBrand AI Lab
              </span>
            </h2>

            <p className="text-zinc-600 dark:text-zinc-300 text-base md:text-lg leading-relaxed">
              Subscribe to receive new research publications, GlyphForge release notes, deterministic multi-agent updates, and developer preview invitations.
            </p>

            <form
              action="https://formsubmit.co/contact@fullstackbrand.co"
              method="POST"
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
              aria-label="AI Lab updates signup form"
            >
              <input type="hidden" name="_subject" value="FullstackBrand AI Lab — Research Updates Request" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />

              <label htmlFor="updates-email" className="sr-only">Email address</label>
              <input
                id="updates-email"
                type="email"
                name="email"
                required
                placeholder="your@company.com"
                className="flex-1 bg-white/90 dark:bg-zinc-900/90 border border-zinc-300 dark:border-white/12 rounded-xl px-5 py-3.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner"
              />
              <motion.button
                type="submit"
                whileHover={{ x: 4 }}
                whileTap={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white flex-shrink-0 hover:shadow-lg hover:shadow-violet-600/30 bg-gradient-to-r from-violet-600 to-indigo-600"
                id="updates-submit-btn"
              >
                <Bell size={14} />
                <span>Get Updates</span>
              </motion.button>
            </form>

            <p className="text-zinc-500 dark:text-zinc-400 text-xs">
              Zero spam. Verified technical releases, open whitepapers, and software update logs only.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          AGENCY PORTAL BRIDGE (Preserved Emerald Palette)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-agency p-8 md:p-12 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
              <Compass size={14} /> FullstackBrand Ecosystem
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
              Looking for Client Agency Solutions &amp; Brand Identity?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed">
              Explore our full-service digital agency branch providing brand design, high-performance web engineering, custom AI agent deployments, and digital marketing.
            </p>
          </div>

          <motion.div
            whileHover={{ x: 6 }}
            whileTap={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Link
              href="/agency"
              prefetch={true}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-emerald-500/20 group"
              id="agency-bridge-cta"
            >
              <span>Visit FullstackBrand Agency</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
