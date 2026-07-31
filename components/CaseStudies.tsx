// FullstackBrand
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'Neural Finance Platform',
    category: 'Web Dev',
    description: 'Built a real-time trading dashboard with AI-driven analytics and predictive charting.',
    metrics: { conversion: '+45%', retention: '+22%' },
    gradient: 'from-blue-600/20 via-brand-light/10 to-transparent',
    tag: '2024',
  },
  {
    id: 2,
    title: 'Quantum Retail Branding',
    category: 'Branding',
    description: 'End-to-end identity system for a $50M DTC brand — logo, motion, and design system.',
    metrics: { engagement: '+65%', revenue: '+30%' },
    gradient: 'from-purple-600/20 via-pink-500/10 to-transparent',
    tag: '2024',
  },
  {
    id: 3,
    title: 'AI Support Automation',
    category: 'AI Agents',
    description: 'Deployed GPT-4 powered agents handling 10,000+ support tickets per month autonomously.',
    metrics: { tickets: '-80%', csat: '+15%' },
    gradient: 'from-brand-light/20 via-cyan-500/10 to-transparent',
    tag: '2025',
  },
  {
    id: 4,
    title: 'MarTech Attribution SaaS',
    category: 'Web Dev',
    description: 'Multi-touch attribution engine with real-time data pipelines and ML scoring.',
    metrics: { accuracy: '+92%', speed: '+3x' },
    gradient: 'from-orange-500/20 via-yellow-500/10 to-transparent',
    tag: '2025',
  },
  {
    id: 5,
    title: 'E-Commerce Growth Sprint',
    category: 'Digital Marketing',
    description: 'Full-funnel paid media strategy scaling revenue from $2M to $8M ARR in 9 months.',
    metrics: { roas: '+340%', cac: '-42%' },
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    tag: '2025',
  },
  {
    id: 6,
    title: 'Enterprise AI Workflow',
    category: 'AI Agents',
    description: 'Integrated LangChain agents into Fortune 500 ops stack, automating 18 manual processes.',
    metrics: { saved: '800h/mo', roi: '+5x' },
    gradient: 'from-emerald-500/20 via-brand-light/10 to-transparent',
    tag: '2025',
  },
]

export default function CaseStudies() {
  const [filter, setFilter] = useState('All')
  const categories = ['All', 'Web Dev', 'Branding', 'AI Agents', 'Digital Marketing']

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="portfolio" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-brand-light dark:text-brand-dark font-semibold mb-3 block">
          Our work
        </span>
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Case Studies</h2>
        <p className="text-slate-500 dark:text-slate-400">Real results for futuristic brands.</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex justify-center flex-wrap gap-2 mb-12">
        {categories.map(cat => (
          <motion.button
            key={cat}
            onClick={() => setFilter(cat)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === cat
                ? 'text-white shadow-lg shadow-brand-light/30 dark:shadow-brand-dark/20'
                : 'glass hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            {filter === cat && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-brand-light dark:bg-brand-dark"
                style={{ zIndex: -1 }}
              />
            )}
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Project grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-3xl glass overflow-hidden hover:border-brand-light/40 dark:hover:border-brand-dark/40 transition-all duration-300 cursor-pointer"
              style={{ minHeight: '280px' }}
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative h-full p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider font-semibold text-brand-light dark:text-brand-dark px-3 py-1 rounded-full bg-brand-light/10 dark:bg-brand-dark/15">
                      {p.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{p.tag}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-brand-light dark:group-hover:text-brand-dark transition-colors duration-300">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6">
                  {/* Divider */}
                  <div className="h-px bg-slate-200/50 dark:bg-white/10 mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-5">
                      {Object.entries(p.metrics).map(([key, val]) => (
                        <div key={key}>
                          <div className="text-lg font-black text-brand-light dark:text-brand-dark">{val}</div>
                          <div className="text-xs text-slate-400 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                    <motion.div
                      whileHover={{ rotate: 45 }}
                      transition={{ duration: 0.2 }}
                      className="w-8 h-8 rounded-full border border-brand-light/30 dark:border-brand-dark/30 flex items-center justify-center group-hover:bg-brand-light dark:group-hover:bg-brand-dark group-hover:border-transparent transition-all duration-300"
                    >
                      <ArrowUpRight size={14} className="text-brand-light dark:text-brand-dark group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}