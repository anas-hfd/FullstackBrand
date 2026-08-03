// FullstackBrand
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  Telescope, Map, Palette, Code2, Bot, Rocket, TrendingUp,
} from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Telescope,
    title: 'Discovery',
    subtitle: 'Understanding your world',
    description:
      'We immerse ourselves in your business — goals, audience, competitors, and market dynamics. Every decision we make is informed by this foundation.',
    accent: '#3B82F6',
    gradient: 'from-blue-500/20 to-cyan-500/10',
  },
  {
    number: '02',
    icon: Map,
    title: 'Strategy',
    subtitle: 'Data-backed architecture',
    description:
      'We translate insights into a precise roadmap: tech stack selection, content hierarchy, KPI benchmarks, and a phased delivery timeline.',
    accent: '#8B5CF6',
    gradient: 'from-purple-500/20 to-violet-500/10',
  },
  {
    number: '03',
    icon: Palette,
    title: 'Design',
    subtitle: 'Pixel-perfect experiences',
    description:
      'High-fidelity prototypes and brand identity systems that feel premium from the first glance — tested with real users before a single line of code is written.',
    accent: '#EC4899',
    gradient: 'from-pink-500/20 to-rose-500/10',
  },
  {
    number: '04',
    icon: Code2,
    title: 'Development',
    subtitle: 'Agile, transparent building',
    description:
      'We build in two-week sprints with weekly demos. Clean, maintainable code. Performance-first engineering. You always know exactly where your project stands.',
    accent: '#00CC60',
    gradient: 'from-brand-light/20 to-emerald-500/10',
  },
  {
    number: '05',
    icon: Bot,
    title: 'AI Integration',
    subtitle: 'Intelligence embedded',
    description:
      'Where applicable, we layer in AI capabilities — agents, automation pipelines, chatbots, or custom models — turning your product into a self-improving system.',
    accent: '#F59E0B',
    gradient: 'from-orange-500/20 to-amber-500/10',
  },
  {
    number: '06',
    icon: Rocket,
    title: 'Launch',
    subtitle: 'Ship with confidence',
    description:
      "Zero-downtime deployment, comprehensive QA, performance audits, and security checks. We don't launch until everything exceeds our quality bar.",
    accent: '#EF4444',
    gradient: 'from-red-500/20 to-orange-500/10',
  },
  {
    number: '07',
    icon: TrendingUp,
    title: 'Growth',
    subtitle: 'Continuous optimization',
    description:
      'Post-launch, we monitor, iterate, and scale. Analytics reviews, A/B testing, SEO refinements, and feature expansions — your digital ecosystem keeps improving.',
    accent: '#14B8A6',
    gradient: 'from-teal-500/20 to-brand-light/10',
  },
]

/* ─── Desktop Step Card ─────────────────────────────────────────────────── */
function DesktopStepCard({
  step,
  index,
  hoveredIndex,
  onHover,
  onLeave,
}: {
  step: typeof steps[0]
  index: number
  hoveredIndex: number | null
  onHover: (i: number) => void
  onLeave: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = step.icon

  const isHovered = hoveredIndex === index
  const isShrunk = hoveredIndex !== null && !isHovered

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      {/* Connector line (not last) */}
      {index < steps.length - 1 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 + index * 0.05 }}
          className="hidden lg:block absolute top-10 left-[calc(50%+44px)] right-[calc(-50%+44px)] h-px origin-left"
          style={{
            background: `linear-gradient(to right, ${step.accent}55, ${steps[index + 1].accent}33)`,
            opacity: isShrunk ? 0.4 : 1,
            transition: 'opacity 0.35s',
            zIndex: 0,
          }}
        />
      )}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={onLeave}
        style={{
          scale: isHovered ? 1.12 : isShrunk ? 0.88 : 1,
          filter: isShrunk ? 'brightness(0.6)' : 'brightness(1)',
          zIndex: isHovered ? 20 : 1,
          transition: 'scale 0.35s cubic-bezier(0.16,1,0.3,1), filter 0.35s ease, z-index 0s',
        }}
        className="relative z-10 flex flex-col items-center w-full"
      >
        {/* Icon circle */}
        <motion.div
          animate={{
            boxShadow: isHovered
              ? `0 0 32px 8px ${step.accent}50, 0 0 0 2px ${step.accent}80`
              : `0 0 0px 0px transparent`,
            scale: isHovered ? 1.18 : 1,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-20 rounded-full glass flex items-center justify-center relative mb-4"
        >
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${step.accent}25, transparent)` }}
          />
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Icon className="w-8 h-8 relative z-10" style={{ color: step.accent }} />
          </motion.div>
        </motion.div>

        {/* Step label */}
        <span
          className="text-[10px] font-black tracking-[0.3em] uppercase mb-3 transition-all duration-300"
          style={{ color: isHovered ? step.accent : `${step.accent}99` }}
        >
          Step {step.number}
        </span>

        {/* Card body */}
        <motion.div
          animate={{
            borderColor: isHovered ? `${step.accent}60` : 'rgba(255,255,255,0.06)',
          }}
          transition={{ duration: 0.3 }}
          className={`glass rounded-2xl p-5 w-full bg-gradient-to-br ${step.gradient} border transition-all duration-300`}
          style={{
            boxShadow: isHovered ? `0 8px 32px ${step.accent}22` : 'none',
          }}
        >
          <h3 className="text-sm font-black mb-0.5 text-slate-900 dark:text-white">{step.title}</h3>
          <p className="text-[10px] font-semibold mb-2" style={{ color: step.accent }}>
            {step.subtitle}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed hidden lg:block">
            {step.description}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ─── Mobile Step Card ──────────────────────────────────────────────────── */
function MobileStepCard({
  step,
  index,
  hoveredIndex,
  onHover,
  onLeave,
  cardRef,
}: {
  step: typeof steps[0]
  index: number
  hoveredIndex: number | null
  onHover: (i: number) => void
  onLeave: () => void
  cardRef?: (node: HTMLDivElement | null) => void
}) {
  const Icon = step.icon
  const isHovered = hoveredIndex === index
  const isShrunk = hoveredIndex !== null && !isHovered

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      style={{
        scale: isHovered ? 1.04 : isShrunk ? 0.96 : 1,
        filter: isShrunk ? 'brightness(0.65)' : 'brightness(1)',
        transition: 'scale 0.35s cubic-bezier(0.16,1,0.3,1), filter 0.35s ease',
      }}
      className="flex gap-5"
    >
      {/* Icon circle */}
      <div className="flex-shrink-0 w-[72px] flex flex-col items-center">
        <motion.div
          animate={{
            boxShadow: isHovered ? `0 0 24px 6px ${step.accent}50` : '0 0 0 transparent',
            scale: isHovered ? 1.14 : 1,
          }}
          transition={{ duration: 0.35 }}
          className="w-[72px] h-[72px] rounded-full glass flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-7 h-7" style={{ color: step.accent }} />
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        animate={{ borderColor: isHovered ? `${step.accent}55` : 'rgba(255,255,255,0.06)' }}
        transition={{ duration: 0.3 }}
        className={`flex-1 glass rounded-2xl p-4 bg-gradient-to-br ${step.gradient} border`}
      >
        <span
          className="text-[10px] font-black tracking-[0.25em] uppercase mb-1 block transition-colors duration-300"
          style={{ color: step.accent }}
        >
          {step.number} — {step.subtitle}
        </span>
        <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">{step.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
      </motion.div>
    </motion.div>
  )
}

/* ─── Section ───────────────────────────────────────────────────────────── */
export default function ProcessTimeline() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Mobile scroll-based active card detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) return // Mobile/tablet viewports only
      const viewportCenter = window.innerHeight / 2

      let closestIdx: number | null = null
      let minDistance = Infinity

      mobileCardRefs.current.forEach((card, idx) => {
        if (!card) return
        const rect = card.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const cardCenter = rect.top + rect.height / 2
          const dist = Math.abs(cardCenter - viewportCenter)
          if (dist < minDistance) {
            minDistance = dist
            closestIdx = idx
          }
        }
      })

      if (closestIdx !== null) {
        setHoveredIndex(closestIdx)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="process" className="max-w-7xl mx-auto px-6 py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-brand-light dark:text-brand-dark font-semibold mb-3 block">
          Our methodology
        </span>
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">How We Work</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          A proven seven-stage process that transforms ambitious ideas into high-performing digital products — on time and on budget.
        </p>
      </motion.div>

      {/* Desktop: horizontal */}
      <div className="hidden lg:grid lg:grid-cols-7 gap-3">
        {steps.map((step, i) => (
          <DesktopStepCard
            key={step.number}
            step={step}
            index={i}
            hoveredIndex={hoveredIndex}
            onHover={setHoveredIndex}
            onLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="lg:hidden relative">
        <div className="absolute left-9 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-light/30 dark:via-brand-dark/30 to-transparent" />
        <div className="space-y-5">
          {steps.map((step, i) => (
            <MobileStepCard
              key={step.number}
              step={step}
              index={i}
              hoveredIndex={hoveredIndex}
              onHover={setHoveredIndex}
              onLeave={() => setHoveredIndex(null)}
              cardRef={el => { mobileCardRefs.current[i] = el }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
