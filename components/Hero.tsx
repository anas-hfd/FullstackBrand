// FullstackBrand
'use client'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import ParticleField from './ParticleField'
import { useRef, useEffect } from 'react'

const stats = [
  { metric: '150+', label: 'Projects Delivered' },
  { metric: '99.9%', label: 'Uptime Guaranteed' },
  { metric: '<2s', label: 'Load Times' },
  { metric: '40+', label: 'AI Models' },
]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Cursor-reactive glow position
  const glowX = useMotionValue(50) // percent
  const glowY = useMotionValue(50)
  const smoothX = useSpring(glowX, { stiffness: 60, damping: 20 })
  const smoothY = useSpring(glowY, { stiffness: 60, damping: 20 })

  // Cursor-reactive tilt for the headline block
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const smoothTiltX = useSpring(tiltX, { stiffness: 80, damping: 20 })
  const smoothTiltY = useSpring(tiltY, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const px = ((e.clientX - rect.left) / rect.width) * 100
      const py = ((e.clientY - rect.top) / rect.height) * 100
      glowX.set(px)
      glowY.set(py)

      // Subtle tilt: -6 to 6 deg
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      tiltX.set(-ny * 4)
      tiltY.set(nx * 4)
    }

    const onLeave = () => {
      glowX.set(50)
      glowY.set(50)
      tiltX.set(0)
      tiltY.set(0)
    }

    el.addEventListener('mousemove', onMove as EventListener)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove as EventListener)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [glowX, glowY, tiltX, tiltY])

  return (
    <section ref={ref} className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      <ParticleField />

      {/* Cursor-reactive radial glow — follows mouse */}
      {/* Cursor-reactive large glow blob */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          zIndex: 1,
          left: smoothX,
          top: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,102,0.11) 0%, rgba(16,185,129,0.05) 40%, transparent 70%)',
        }}
      />

      {/* Second smaller accent glow — offset for depth */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          zIndex: 1,
          left: smoothX,
          top: smoothY,
          translateX: '-30%',
          translateY: '-60%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,102,0.06) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Top horizontal line accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-light/40 dark:via-brand-dark/40 to-transparent origin-left"
        style={{ zIndex: 2 }}
      />

      {/* Content — subtle 3D tilt with cursor */}
      <motion.div
        style={{
          y,
          opacity,
          rotateX: smoothTiltX,
          rotateY: smoothTiltY,
          transformStyle: 'preserve-3d',
          perspective: 1200,
          zIndex: 10,
        }}
        className="relative max-w-6xl mx-auto text-center px-6"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-sm font-medium"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles size={14} className="text-brand-light dark:text-brand-dark" />
          </motion.span>
          Web Development Agency · AI-Powered Digital Solutions
          <span className="w-1.5 h-1.5 rounded-full bg-brand-light dark:bg-brand-dark animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]"
          style={{ transform: 'translateZ(30px)' }}
        >
          We Build{' '}
          <span className="relative inline-block">
            <span className="text-brand-light dark:text-brand-dark glow-text">Intelligent</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-brand-light to-brand-dark origin-left"
            />
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Digital Brands.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ transform: 'translateZ(15px)' }}
        >
          Full-stack web development, UI/UX design, AI automation &amp; branding —
          we engineer the digital ecosystem your business needs to{' '}
          <span className="text-brand-light dark:text-brand-dark font-semibold">scale without limits</span>.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ transform: 'translateZ(20px)' }}
        >
          <a
            href="#start"
            className="group relative flex items-center justify-center gap-2 bg-brand-light dark:bg-brand-dark text-white px-8 py-4 rounded-full font-bold text-base hover:scale-105 transition-transform duration-300 shadow-lg shadow-brand-light/25 dark:shadow-brand-dark/20 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Project
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </a>

          <a
            href="#services"
            className="flex items-center justify-center gap-2 glass px-8 py-4 rounded-full font-bold text-base hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            Explore Our Services
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200/50 dark:bg-white/10 rounded-2xl overflow-hidden max-w-3xl mx-auto"
        >
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-brand-offwhite dark:bg-brand-obsidian p-5 text-center group hover:bg-brand-light/5 dark:hover:bg-brand-dark/10 transition-colors"
            >
              <div className="text-2xl md:text-3xl font-black text-brand-light dark:text-brand-dark group-hover:glow-text transition-all">
                {item.metric}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} className="text-slate-400 dark:text-slate-600" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}