'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Code2, Bot, PenTool, Megaphone } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────
   Each ring carries TWO elements on OPPOSITE sides:
     • Right (0°) → icon badge
     • Left (180°) → text label
   Both counter-rotate so they stay upright as the ring spins.
───────────────────────────────────────────────────────────────────────── */
const ORBITS = [
  {
    id: 1,
    diameter: 320,
    inclineX: 78,
    inclineZ: -10,
    duration: 10,
    reverse: false,
    ringColor: 'rgba(59,130,246,0.35)',
    color: '#3B82F6',
    Icon: Code2,
    label: 'Web Development',
  },
  {
    id: 2,
    diameter: 430,
    inclineX: 48,
    inclineZ: 55,
    duration: 16,
    reverse: true,
    ringColor: 'rgba(139,92,246,0.30)',
    color: '#8B5CF6',
    Icon: Bot,
    label: 'AI & Automation',
  },
  {
    id: 3,
    diameter: 370,
    inclineX: 62,
    inclineZ: -70,
    duration: 13,
    reverse: false,
    ringColor: 'rgba(236,72,153,0.30)',
    color: '#EC4899',
    Icon: PenTool,
    label: 'Design',
  },
  {
    id: 4,
    diameter: 510,
    inclineX: 28,
    inclineZ: 35,
    duration: 22,
    reverse: true,
    ringColor: 'rgba(245,158,11,0.28)',
    color: '#F59E0B',
    Icon: Megaphone,
    label: 'Branding & Marketing',
  },
  {
    id: 5,
    diameter: 580,
    inclineX: 12,
    inclineZ: -25,
    duration: 38,
    reverse: false,
    ringColor: 'rgba(0,255,102,0.18)',
    color: '#00FF66',
    Icon: null,          // logo ring — uses logomark image instead of icon
    label: 'FullstackBrand',
  },
]

/* ─── Single orbit ring ──────────────────────────────────────────────────── */
function OrbitRing({
  orbit,
  isHovered,
  theme,
  mounted,
}: {
  orbit: typeof ORBITS[0]
  isHovered: boolean
  theme: string | undefined
  mounted: boolean
}) {
  const Icon = orbit.Icon

  return (
    /* Tilted orbit plane */
    <div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{
        width: orbit.diameter,
        height: orbit.diameter,
        marginLeft: -orbit.diameter / 2,
        marginTop: -orbit.diameter / 2,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${orbit.inclineX}deg) rotateZ(${orbit.inclineZ}deg)`,
      }}
    >
      {/* Visible ring */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-500"
        style={{
          border: `1px solid ${orbit.ringColor}`,
          boxShadow: isHovered ? `0 0 14px ${orbit.ringColor}` : 'none',
        }}
      />

      {/* Spinning wrapper */}
      <motion.div
        animate={{ rotate: orbit.reverse ? -360 : 360 }}
        transition={{ duration: orbit.duration, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
        style={{ transformOrigin: 'center center' }}
      >
        {/* ── RIGHT side — icon badge (0°) ── */}
        <div
          style={{
            position: 'absolute',
            right: -18,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {/* Counter-rotate + undo plane tilt → always faces viewer */}
          <motion.div
            animate={{ rotate: orbit.reverse ? 360 : -360 }}
            transition={{ duration: orbit.duration, repeat: Infinity, ease: 'linear' }}
            style={{
              transform: `rotateX(${-orbit.inclineX}deg) rotateZ(${-orbit.inclineZ}deg)`,
            }}
          >
            {Icon ? (
              <motion.div
                whileHover={{ scale: 1.25 }}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: `${orbit.color}1A`,
                  border: `1.5px solid ${orbit.color}70`,
                  boxShadow: `0 0 16px ${orbit.color}45`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Icon size={15} style={{ color: orbit.color }} />
              </motion.div>
            ) : (
              mounted && (
                <motion.div
                  whileHover={{ scale: 1.25 }}
                  className="w-9 h-9 rounded-full glass flex items-center justify-center"
                  style={{ boxShadow: `0 0 18px ${orbit.color}55` }}
                >
                  <Image
                    src={theme === 'dark' ? '/logos/Logomark-W.png' : '/logos/logomark-B.png'}
                    alt="FullstackBrand"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </motion.div>
              )
            )}
          </motion.div>
        </div>

        {/* ── LEFT side — text label (180°, directly opposite) ── */}
        <div
          style={{
            position: 'absolute',
            left: -18,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {/* Counter-rotate + undo plane tilt */}
          <motion.div
            animate={{ rotate: orbit.reverse ? 360 : -360 }}
            transition={{ duration: orbit.duration, repeat: Infinity, ease: 'linear' }}
            style={{
              transform: `rotateX(${-orbit.inclineX}deg) rotateZ(${-orbit.inclineZ}deg)`,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.12 }}
              className="px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{
                background: `${orbit.color}12`,
                border: `1px solid ${orbit.color}50`,
                boxShadow: `0 0 12px ${orbit.color}28`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <span
                className="text-[8px] font-black tracking-[0.2em] uppercase leading-none"
                style={{ color: orbit.color }}
              >
                {orbit.label}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Central planet ─────────────────────────────────────────────────────── */
function CentralPlanet({
  mouseX,
  mouseY,
  isHovered,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
  isHovered: boolean
}) {
  const spring     = { stiffness: 220, damping: 22 }
  const softSpring = { stiffness: 80,  damping: 16 }

  /* Surface glow follows cursor */
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], ['-38%', '38%']), softSpring)
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], ['-38%', '38%']), softSpring)

  /* Strong 3D tilt */
  const logoRotX = useSpring(useTransform(mouseY, [-0.5, 0.5], [28, -28]), spring)
  const logoRotY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-28, 28]), spring)

  /* Magnetic translate */
  const logoTX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), softSpring)
  const logoTY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), softSpring)

  /* Scale + glow intensity */
  const glowOpacity = useSpring(isHovered ? 0.95 : 0.50, { stiffness: 120, damping: 18 })
  const logoScale   = useSpring(isHovered ? 1.14 : 1.00, { stiffness: 200, damping: 18 })

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 200, height: 200, zIndex: 20 }}
    >
      {/* Outer atmosphere pulse */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: -28,
          background:
            'radial-gradient(circle, rgba(0,255,102,0.12) 0%, rgba(16,185,129,0.04) 50%, transparent 75%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Planet sphere */}
      <motion.div
        animate={{
          boxShadow: isHovered
            ? '0 0 50px rgba(0,255,102,0.22), 0 0 100px rgba(0,255,102,0.08), inset -40px -25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.16)'
            : '0 0 30px rgba(0,255,102,0.12), 0 0 60px rgba(0,255,102,0.05), inset -40px -25px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)',
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(circle at 32% 28%,
              rgba(255,255,255,0.10) 0%,
              rgba(0,255,102,0.06) 20%,
              rgba(9,10,15,0.88) 58%,
              rgba(0,0,0,0.96) 100%
            )
          `,
          border: '1px solid rgba(0,255,102,0.20)',
        }}
      />

      {/* Cursor-reactive surface glow shifts direction */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <motion.div
          style={{
            position: 'absolute',
            width: '90%',
            height: '90%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,255,102,0.14) 0%, transparent 65%)',
            filter: 'blur(14px)',
            top: '5%',
            left: '5%',
            x: glowX,
            y: glowY,
            opacity: glowOpacity,
          }}
        />
      </motion.div>

      {/* Surface grid */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
        style={{
          opacity: 0.15,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 16px, rgba(0,255,102,0.2) 16px, rgba(0,255,102,0.2) 17px),
            repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(0,255,102,0.12) 16px, rgba(0,255,102,0.12) 17px)
          `,
          zIndex: 2,
        }}
      />

      {/* Terminator (dark side) */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 78% 62%, rgba(0,0,0,0.72) 0%, transparent 55%)',
          zIndex: 3,
        }}
      />

      {/* Specular highlight */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '32%', height: '20%',
          top: '13%', left: '15%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, transparent 80%)',
          filter: 'blur(3px)',
          transform: 'rotate(-18deg)',
          zIndex: 4,
        }}
      />

      {/* ── Logomark: SLOW ROTATION + STRONG CURSOR INTERACTION ──
          Layer 1 (outer): magnetic translate toward cursor
          Layer 2 (middle): cursor-driven 3D tilt (rotateX / rotateY)
          Layer 3 (inner): slow continuous Z-axis spin
      ── */}
      <motion.div
        style={{
          x: logoTX,
          y: logoTY,
          scale: logoScale,
          zIndex: 5,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Cursor 3D tilt */}
        <motion.div
          style={{
            rotateX: logoRotX,
            rotateY: logoRotY,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Slow continuous emblem spin */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            style={{
              filter: 'drop-shadow(0 0 14px rgba(0,255,102,0.60)) drop-shadow(0 0 30px rgba(0,255,102,0.22))',
            }}
          >
            <Image
              src="/logos/logomark.png"
              alt="FullstackBrand"
              width={96}
              height={96}
              className="object-contain select-none"
              priority
              style={{ opacity: 0.93 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function Logo3D() {
  const systemRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  /* Mouse motion values for planet tilt + inner glow */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springOuter = { stiffness: 90, damping: 16 }
  const systemRotX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springOuter)
  const systemRotY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springOuter)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!systemRef.current) return
    const rect = systemRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <section className="relative py-32 flex flex-col items-center justify-center overflow-hidden">
      {/* Deep space ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[680px] h-[680px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(0,255,102,0.06) 0%, rgba(16,185,129,0.03) 45%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-xs uppercase tracking-[0.25em] text-brand-light dark:text-brand-dark font-semibold mb-8 relative z-10"
      >
        Engineered for the future
      </motion.p>

      {/* ── Solar system stage ── */}
      <motion.div
        ref={systemRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.55, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 660,
          height: 660,
          position: 'relative',
          transformStyle: 'preserve-3d',
          perspective: 1100,
          rotateX: systemRotX,
          rotateY: systemRotY,
        }}
        className="flex items-center justify-center"
      >
        {/* All orbit rings */}
        {ORBITS.map(orbit => (
          <OrbitRing
            key={orbit.id}
            orbit={orbit}
            isHovered={isHovered}
            theme={theme}
            mounted={mounted}
          />
        ))}

        {/* Central planet */}
        <CentralPlanet mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} />
      </motion.div>

      {/* Footer text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 text-center relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
          Built by{' '}
          <span className="text-brand-light dark:text-brand-dark glow-text">FullstackBrand</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto text-sm">
          Where intelligent technology meets exceptional design — crafting brands that live at the frontier.
        </p>

        {/* Service color legend */}
        <div className="flex flex-wrap justify-center gap-5 mt-6">
          {ORBITS.filter(o => o.Icon).map(o => {
            const Icon = o.Icon!
            return (
              <div key={o.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: o.color, boxShadow: `0 0 6px ${o.color}` }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{o.label}</span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

