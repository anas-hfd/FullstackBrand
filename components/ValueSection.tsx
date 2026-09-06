'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Code2, Bot, Layers, ShieldCheck, Globe2, Cpu } from 'lucide-react'

// What the Studio actually offers — capability statements, not fabricated outcome metrics
const capabilities = [
  {
    icon: Code2,
    label: 'SaaS Engineering',
    desc: 'Full-stack product development using Next.js, TypeScript, and modern cloud infrastructure. From prototype to deployed product.',
    accent: '#3B82F6',
  },
  {
    icon: Bot,
    label: 'AI Integration',
    desc: 'Integration of language models, retrieval-augmented generation, and agent workflows into client products and internal tooling.',
    accent: '#8B5CF6',
  },
  {
    icon: Layers,
    label: 'Brand & Digital Systems',
    desc: 'Visual identity, design systems, and conversion-oriented web platforms. Consistent presentation across touchpoints.',
    accent: '#EC4899',
  },
  {
    icon: Cpu,
    label: 'Applied AI Infrastructure',
    desc: 'Deployment of routing, orchestration, and inference systems developed in the AI Lab — into real customer environments.',
    accent: '#10B981',
  },
]

const trustIndicators = [
  { icon: ShieldCheck, label: 'Security-conscious architecture by design' },
  { icon: Globe2,     label: 'Remote-first delivery, accepting global clients' },
  { icon: Code2,      label: 'Full code ownership transferred on delivery' },
  { icon: Cpu,        label: 'AI Lab R&D applied to every commercial engagement' },
]

export default function ValueSection() {
  return (
    <section className="relative py-28 overflow-hidden">
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
            Studio Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            What the{' '}
            <span className="text-brand-light dark:text-brand-dark glow-text">Studio Delivers</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            The Studio is the commercial deployment arm of FullstackBrand — taking AI Lab engineering capabilities and applying them to client products, platforms, and implementations.
          </p>
        </motion.div>

        {/* Capability cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {capabilities.map(({ icon: Icon, label, desc, accent }, i) => (
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

              <div className="text-sm font-bold text-slate-900 dark:text-white mb-2 relative">{label}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed relative">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators — honest, architecture-level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass rounded-2xl px-8 py-5 flex flex-wrap gap-5 justify-between items-center"
        >
          {trustIndicators.map(({ icon: Icon, label }) => (
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
            Discuss a Pilot or Project
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
