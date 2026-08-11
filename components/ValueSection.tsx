'use client'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Clock, Users, Zap, Shield, Globe2, Star } from 'lucide-react'

const outcomes = [
  {
    icon: TrendingUp,
    stat: '3–5×',
    label: 'Revenue Growth',
    desc: 'Brands we build and market consistently see 3–5× revenue uplift within 12 months.',
    accent: '#10B981',
  },
  {
    icon: Clock,
    stat: '60%',
    label: 'Faster to Market',
    desc: 'Our integrated stack ships faster — cutting average time-to-launch by more than half.',
    accent: '#3B82F6',
  },
  {
    icon: Zap,
    stat: '80%',
    label: 'Ops Automated',
    desc: 'AI workflows eliminate repetitive manual tasks, freeing your team for high-impact work.',
    accent: '#8B5CF6',
  },
  {
    icon: Users,
    stat: '2×',
    label: 'More Qualified Leads',
    desc: 'Conversion-optimized design and targeted strategy double qualified pipeline on average.',
    accent: '#F59E0B',
  },
]

const proof = [
  { icon: Shield,  label: 'Enterprise-grade security & compliance' },
  { icon: Globe2,  label: 'Deployed in 12+ countries' },
  { icon: Star,    label: '5-star satisfaction across 150+ projects' },
  { icon: Zap,     label: 'Sub-2s page load times, always' },
]

export default function ValueSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(16,185,129,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-brand-light dark:text-brand-dark font-semibold mb-3 block">
            What you gain
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            With{' '}
            <span className="text-brand-light dark:text-brand-dark glow-text">FullstackBrand</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            We don&apos;t just deliver projects — we engineer measurable outcomes. Here&apos;s what our clients consistently achieve when they partner with us.
          </p>
        </motion.div>

        {/* Outcome cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {outcomes.map(({ icon: Icon, stat, label, desc, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group glass rounded-3xl p-7 hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden"
              style={{
                boxShadow: `0 0 0 1px ${accent}18`,
              }}
            >
              {/* Hover tint */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${accent}12 0%, transparent 70%)` }}
              />

              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative"
                style={{ background: `${accent}18` }}
              >
                <Icon className="w-5 h-5" style={{ color: accent }} />
              </div>

              <div
                className="text-4xl font-black mb-1 relative"
                style={{ color: accent }}
              >
                {stat}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">{label}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass rounded-2xl px-8 py-5 flex flex-wrap gap-5 justify-between items-center"
        >
          {proof.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-light/10 dark:bg-brand-dark/15 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-brand-light dark:text-brand-dark" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.a
            href="#start"
            whileHover={{ x: 6 }}
            whileTap={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-2 bg-brand-light dark:bg-brand-dark text-white px-8 py-4 rounded-full font-bold text-sm shadow-lg shadow-brand-light/20 dark:shadow-brand-dark/20 group"
          >
            Start your transformation
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

