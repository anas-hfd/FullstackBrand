// FullstackBrand
'use client'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  Code2, Bot, PenTool, Megaphone,
  Globe, LayoutDashboard, Smartphone, Package,
  Workflow, MessageSquareCode, Mic, Sparkles,
  Palette, Frame, Search, BarChart2, Target, TrendingUp,
  ChevronDown, Fingerprint, Monitor,
} from 'lucide-react'

const pillars = [
  {
    id: 1,
    number: '01',
    icon: PenTool,
    title: 'Brand Design & Visual Identity',
    tagline: 'Aesthetics that command attention',
    description:
      'Great design is not decoration — it is strategy made visible. We create bold identities, cohesive visual systems, and premium product experiences that communicate value instantly and feel distinctive at every touchpoint.',
    accent: '#EC4899',
    gradient: 'from-pink-500/20 via-pink-500/8 to-transparent',
    borderColor: 'rgba(236,72,153,0.5)',
    services: [
      { icon: Fingerprint,     label: 'Brand Visual & Motion Identity', desc: 'Distinctive marks, motion design, and full visual identity systems' },
      { icon: Palette,         label: 'Brand Guidelines & Systems',     desc: 'Typography, color, and voice consistency at scale' },
      { icon: Frame,           label: 'UI/UX Design',                   desc: 'User research, wireframes, and high-fidelity prototypes' },
      { icon: Monitor,         label: 'Product & Dashboard Design',     desc: 'End-to-end product design and scalable design systems' },
    ],
  },
  {
    id: 2,
    number: '02',
    icon: Megaphone,
    title: 'Digital Marketing & Brand Strategy',
    tagline: 'Growth engineered, not guessed',
    description:
      'We build brands that resonate and run campaigns that convert. From positioning strategy to paid media execution, we connect your business to the right audience at the right moment — with data-driven precision.',
    accent: '#F59E0B',
    gradient: 'from-amber-500/20 via-amber-500/8 to-transparent',
    borderColor: 'rgba(245,158,11,0.5)',
    services: [
      { icon: Target,      label: 'Brand Positioning & Strategy', desc: 'Market differentiation, messaging, and narrative' },
      { icon: Search,      label: 'SEO & Content Strategy',       desc: 'Organic visibility and long-term authority building' },
      { icon: BarChart2,   label: 'Paid Advertising',             desc: 'ROI-focused Google, Meta, and LinkedIn campaigns' },
      { icon: TrendingUp,  label: 'Growth & Retention Marketing', desc: 'Full-funnel acquisition and lifecycle systems' },
    ],
  },
  {
    id: 3,
    number: '03',
    icon: Code2,
    title: 'Web Development',
    tagline: 'From concept to high-performance product',
    description:
      'We craft fast, secure, and scalable web products using modern frameworks and engineering best practices. Every pixel is intentional; every line of code is built to last and built to grow.',
    accent: '#3B82F6',
    gradient: 'from-blue-500/20 via-blue-500/8 to-transparent',
    borderColor: 'rgba(59,130,246,0.5)',
    services: [
      { icon: Globe,           label: 'Websites & Landing Pages',       desc: 'Conversion-optimized, SEO-ready web presence' },
      { icon: LayoutDashboard, label: 'Web Applications & Dashboards',  desc: 'Complex SaaS platforms and internal tools' },
      { icon: Smartphone,      label: 'Mobile Applications',            desc: 'Cross-platform iOS & Android experiences' },
      { icon: Package,         label: 'E-Commerce & Custom Solutions',  desc: 'Scalable storefronts and bespoke platforms' },
    ],
  },
  {
    id: 4,
    number: '04',
    icon: Bot,
    title: 'AI Automation',
    tagline: 'Intelligence that works while you sleep',
    description:
      'We integrate cutting-edge AI into your operations — automating repetitive workflows, building intelligent agents, and creating custom AI products that give your business an unfair advantage.',
    accent: '#8B5CF6',
    gradient: 'from-purple-500/20 via-purple-500/8 to-transparent',
    borderColor: 'rgba(139,92,246,0.5)',
    services: [
      { icon: Workflow,          label: 'Workflow Automation',         desc: 'End-to-end process automation across your stack' },
      { icon: Sparkles,          label: 'AI Agents Integration',       desc: 'Autonomous agents that execute complex tasks' },
      { icon: MessageSquareCode, label: 'Chatbots & Voice Agents',     desc: 'Conversational AI for support, sales, and ops' },
      { icon: Mic,               label: 'Custom AI Products & SaaS',   desc: 'Tailored AI models and AI-native applications' },
    ],
  },
]

function PillarCard({
  pillar,
  index,
  hoveredId,
  onHover,
  onLeave,
  cardRef,
}: {
  pillar: typeof pillars[0]
  index: number
  hoveredId: number | null
  onHover: (id: number) => void
  onLeave: () => void
  cardRef?: (node: HTMLDivElement | null) => void
}) {
  const localRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [expanded, setExpanded] = useState(false)
  const Icon = pillar.icon

  const isHovered = hoveredId === pillar.id
  const isShrunk = hoveredId !== null && hoveredId !== pillar.id

  const setRefs = (node: HTMLDivElement | null) => {
    ;(localRef as any).current = node
    if (cardRef) cardRef(node)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024) return // disable 3D tilt on mobile
    if (!localRef.current) return
    const rect = localRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 7, y: -x * 7 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    onLeave()
  }

  return (
    <motion.div
      ref={setRefs}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(pillar.id)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      animate={{
        scale: isHovered ? 1.04 : isShrunk ? 0.96 : 1,
        filter: isShrunk ? 'brightness(0.7)' : 'brightness(1)',
        zIndex: isHovered ? 10 : 1,
      }}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered
          ? 'transform 0.12s ease'
          : 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        borderColor: isHovered ? pillar.borderColor : 'transparent',
        boxShadow: isHovered
          ? `0 24px 60px ${pillar.accent}22, 0 0 0 1px ${pillar.borderColor}`
          : '0 0 0 1px rgba(255,255,255,0.06)',
      }}
      className="group relative glass rounded-3xl overflow-hidden cursor-pointer border"
    >
      {/* Background gradient */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient}`}
      />

      <div className="relative p-8">
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <span
            className="text-[72px] font-black leading-none select-none transition-all duration-300"
            style={{ color: isHovered ? `${pillar.accent}30` : `${pillar.accent}12` }}
          >
            {pillar.number}
          </span>

          {/* Icon badge */}
          <motion.div
            animate={{ scale: isHovered ? 1.18 : 1, rotate: isHovered ? 6 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${pillar.accent}18`,
              boxShadow: isHovered ? `0 0 28px ${pillar.accent}40` : `0 0 0px ${pillar.accent}00`,
              transform: 'translateZ(40px)',
            }}
          >
            <Icon className="w-6 h-6 transition-colors duration-300" style={{ color: pillar.accent }} />
          </motion.div>
        </div>

        {/* Title & tagline */}
        <div style={{ transform: 'translateZ(30px)' }}>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 transition-all duration-300">
            {pillar.title}
          </h3>
          <p className="text-sm font-semibold mb-4 transition-colors duration-300" style={{ color: pillar.accent }}>
            {pillar.tagline}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {pillar.description}
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-5 transition-all duration-500"
          style={{
            background: `linear-gradient(to right, ${pillar.accent}${isHovered ? '60' : '25'}, transparent)`,
          }}
        />

        {/* Services list */}
        <div className="space-y-3" style={{ transform: 'translateZ(20px)' }}>
          {(expanded ? pillar.services : pillar.services.slice(0, 3)).map(({ icon: SIcon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <motion.div
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${pillar.accent}15` }}
              >
                <SIcon className="w-3.5 h-3.5" style={{ color: pillar.accent }} />
              </motion.div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500">{desc}</div>
              </div>
            </div>
          ))}

          {pillar.services.length > 3 && (
            <button
              onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
              className="flex items-center gap-1.5 text-xs font-semibold mt-2 transition-colors"
              style={{ color: pillar.accent }}
            >
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={14} />
              </motion.span>
              {expanded ? 'Show less' : `+${pillar.services.length - 3} more`}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Mobile scroll-based active card detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) return // Mobile/tablet screens only
      const viewportCenter = window.innerHeight / 2

      let closestId: number | null = null
      let minDistance = Infinity

      cardRefs.current.forEach((card, idx) => {
        if (!card) return
        const rect = card.getBoundingClientRect()
        // Check if card is visible in viewport
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const cardCenter = rect.top + rect.height / 2
          const dist = Math.abs(cardCenter - viewportCenter)
          if (dist < minDistance) {
            minDistance = dist
            closestId = pillars[idx].id
          }
        }
      })

      if (closestId !== null) {
        setHoveredId(closestId)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-brand-light dark:text-brand-dark font-semibold mb-3 block">
          What we do
        </span>
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Web Development, UI/UX &amp; AI Services</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Four core disciplines. One cohesive ecosystem. Everything your brand needs to compete and win in the digital era.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pillar, i) => (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            index={i}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onLeave={() => setHoveredId(null)}
            cardRef={el => { cardRefs.current[i] = el }}
          />
        ))}
      </div>
    </section>
  )
}