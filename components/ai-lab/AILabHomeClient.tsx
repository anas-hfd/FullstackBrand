'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Sparkles,
  Zap,
  ArrowRight,
  GitBranch,
  Compass,
  Mail,
  Bell,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import ResearchBenchmarks from '@/components/ai-lab/ResearchBenchmarks'
import GlyphForgeInteractive from '@/components/ai-lab/GlyphForgeInteractive'
import ArchitectureVisualizer from '@/components/ai-lab/ArchitectureVisualizer'
import SovereigntySection from '@/components/ai-lab/SovereigntySection'
import TRLRoadmap from '@/components/ai-lab/TRLRoadmap'
import ParticleField from '@/components/ParticleField'

// Metric definitions are explicit: these are architecture design targets
// validated in controlled benchmarking — not P99 production guarantees
const technicalSpecs = [
  { label: 'Technology Readiness', value: 'TRL 3–4', footnote: 'Architecture validated in controlled prototype environment; advancing toward TRL-7' },
  { label: 'Router Decision Latency', value: '< 28ms', footnote: 'Observed in internal prototype tests; hardware-dependent' },
  { label: 'Schema Conformance', value: '99.8%', footnote: 'JSON guardrail accuracy on internal benchmark dataset — not independently validated' },
  { label: 'Data Egress (Sovereign Mode)', value: '0% design', footnote: 'Architecture design target in customer-controlled deployment; requires specific configuration' },
]

// ── First-party newsletter form (no external redirect) ───────────────────────
function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'pending') return
    const trimmed = email.trim()
    if (!trimmed) return

    setStatus('pending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data: { ok: boolean; error?: string } = await res.json()
      if (data.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }, [email, status])

  if (status === 'success') {
    return (
      <div
        className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-sm font-semibold text-violet-700 dark:text-violet-300 max-w-xl mx-auto"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 size={18} className="text-violet-500 flex-shrink-0" />
        <span>You&apos;re subscribed! We&apos;ll send research updates and release notes directly to you.</span>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
      aria-label="AI Lab updates signup form"
      noValidate
    >
      <label htmlFor="updates-email" className="sr-only">Email address</label>
      <input
        id="updates-email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={status === 'pending'}
        placeholder="your@company.com"
        autoComplete="email"
        maxLength={254}
        className="flex-1 min-w-0 bg-white/90 dark:bg-zinc-900/90 border border-zinc-300 dark:border-white/12 rounded-xl px-5 py-3.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner disabled:opacity-60"
      />
      <motion.button
        type="submit"
        disabled={status === 'pending' || !email.trim()}
        whileHover={status !== 'pending' ? { x: 4 } : {}}
        whileTap={status !== 'pending' ? { x: 0 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white flex-shrink-0 hover:shadow-lg hover:shadow-violet-600/30 bg-gradient-to-r from-violet-600 to-indigo-600 disabled:opacity-60 transition-opacity min-w-[7rem]"
        id="updates-submit-btn"
      >
        {status === 'pending' ? (
          <><Loader2 size={14} className="animate-spin" /><span>Sending...</span></>
        ) : (
          <><Bell size={14} /><span>Get Updates</span></>
        )}
      </motion.button>
      {/* Inline error state */}
      {status === 'error' && (
        <div className="w-full flex items-center gap-2 text-xs text-red-500 dark:text-red-400 mt-1" role="alert" aria-live="assertive">
          <AlertCircle size={13} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </form>
  )
}

export default function AILabHomeClient() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 600, y: 300 })

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

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
    <div className="relative pb-24 bg-canvas-light dark:bg-canvas-dark text-zinc-900 dark:text-white w-full overflow-x-hidden min-h-screen" data-theme-route="lab">
      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION WITH MOUSE-REACTIVE PARTICLES
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[90vh] sm:min-h-[95vh] flex items-center justify-center pt-24 sm:pt-28 pb-16 text-center overflow-hidden"
      >
        <ParticleField color="violet" />

        <motion.div
          style={{ y, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        >
          {/* Grant-aligned status badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/30 text-xs font-semibold text-violet-700 dark:text-violet-300 mb-8 shadow-sm"
          >
            <Sparkles size={14} className="text-violet-500 animate-pulse" />
            <span>Applied AI Engineering · Prototype Stage · R&amp;D Lab</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] max-w-5xl mx-auto mb-8 text-zinc-900 dark:text-white"
          >
            Applied AI Infrastructure,{' '}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent glow-text-violet">
              In Active Development.
            </span>
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            We research and build deployable AI infrastructure — hybrid routing architectures, sovereign inference pipelines, and multi-agent orchestration systems. The AI Lab develops proprietary systems; the Studio applies them commercially. Core components are at the prototype stage and advancing toward independent validation.
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

          {/* Technical Architecture Targets Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {technicalSpecs.map((spec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.08 }}
                className="glass p-5 rounded-2xl border border-violet-500/20 dark:border-violet-400/10 text-left hover:border-violet-500/40 transition-colors group"
                title={spec.footnote}
              >
                <div className="text-lg md:text-xl font-black text-violet-600 dark:text-violet-400 font-mono leading-tight">
                  {spec.value}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider font-mono">
                  {spec.label}
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                  {spec.footnote}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Smooth scroll indicator matching Studio page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={20} className="text-zinc-400 dark:text-zinc-600" />
            </motion.div>
          </motion.div>
        </motion.div>
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
          SECTION 3b: TRL ROADMAP — Honest Technology Maturity
      ══════════════════════════════════════════════════════════════════════ */}
      <TRLRoadmap />

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
          className="rounded-3xl p-8 md:p-16 text-center relative overflow-hidden glass-lab border border-violet-500/25"
        >
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

            <p className="text-zinc-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed">
              Subscribe to receive research publications, GlyphForge development updates, architecture release notes, and developer preview invitations.
            </p>

            <NewsletterForm />

            <p className="text-zinc-600 dark:text-zinc-400 text-xs">
              Zero spam. Verified technical releases, open whitepapers, and software update logs only.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STUDIO PORTAL BRIDGE (Preserved Emerald Palette)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-studio p-8 md:p-12 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
              <Compass size={14} /> FullstackBrand Ecosystem
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
              Looking for Studio Solutions &amp; Brand Engineering?
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base leading-relaxed">
              Explore our creative brand and digital engineering studio providing identity design, high-performance web platforms, custom AI agent deployments, and digital systems.
            </p>
          </div>

          <motion.div
            whileHover={{ x: 6 }}
            whileTap={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Link
              href="/studio"
              prefetch={true}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-emerald-500/20 group"
              id="studio-bridge-cta"
            >
              <span>Visit FullstackBrand Studio</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
