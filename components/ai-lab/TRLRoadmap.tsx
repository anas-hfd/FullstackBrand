'use client'

import { motion } from 'framer-motion'
import { FlaskConical, Cpu, CheckCircle2, Rocket, Globe } from 'lucide-react'

const stages = [
  {
    level: 'TRL 1–2',
    label: 'Concept & Feasibility',
    desc: 'Basic principles observed. Technology concept formulated. Initial experimental proof of concept.',
    icon: FlaskConical,
    accent: '#6B7280',
    status: 'complete',
  },
  {
    level: 'TRL 3–4',
    label: 'Prototype Development',
    desc: 'Analytical and laboratory validation of components. Internal test environment demonstrating routing, orchestration, and schema guardrails.',
    icon: Cpu,
    accent: '#8B5CF6',
    status: 'current',
    note: 'Current Stage',
  },
  {
    level: 'TRL 5–6',
    label: 'Component Validation',
    desc: 'Technology validated in relevant environment. Pilot deployments with design partners. Independent external benchmarking.',
    icon: CheckCircle2,
    accent: '#3B82F6',
    status: 'roadmap',
  },
  {
    level: 'TRL 7',
    label: 'System Prototype Demo',
    desc: 'System prototype demonstrated in operational environment. First commercial client deployments.',
    icon: Rocket,
    accent: '#10B981',
    status: 'roadmap',
    note: 'Target',
  },
  {
    level: 'TRL 8–9',
    label: 'Operational Deployment',
    desc: 'System complete and qualified. Proven in operational environment across multiple deployments.',
    icon: Globe,
    accent: '#F59E0B',
    status: 'roadmap',
  },
]

export default function TRLRoadmap() {
  return (
    <section id="trl-roadmap" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">
          <Rocket size={14} />
          <span>Technology Maturity · NASA/ESA TRL Framework</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
          Honest Technology{' '}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Readiness Status
          </span>
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
          We use the Technology Readiness Level (TRL) framework to communicate our maturity honestly. Core systems are currently at TRL 3–4: validated in prototype, advancing toward external deployment validation.
        </p>
      </div>

      <div className="relative">
        {/* Connector line — desktop */}
        <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-zinc-300 via-violet-400/60 to-zinc-300 dark:from-zinc-700 dark:via-violet-600/40 dark:to-zinc-700" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {stages.map((stage, i) => {
            const Icon = stage.icon
            const isCurrent = stage.status === 'current'
            const isComplete = stage.status === 'complete'
            const isRoadmap = stage.status === 'roadmap'

            return (
              <motion.div
                key={stage.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col ${isCurrent ? 'lg:scale-105' : ''}`}
              >
                {/* Icon circle */}
                <div className="flex lg:justify-center mb-4 lg:mb-0 lg:flex-col lg:items-center">
                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 border-2 lg:mb-4 ${
                      isCurrent
                        ? 'border-violet-500 bg-violet-500/15 shadow-lg shadow-violet-500/25'
                        : isComplete
                        ? 'border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800/50'
                        : 'border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/30'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-violet-600 text-white uppercase tracking-widest whitespace-nowrap">
                        ← Now
                      </span>
                    )}
                    <Icon
                      size={28}
                      style={{
                        color: isCurrent ? stage.accent : isComplete ? '#9CA3AF' : '#D1D5DB',
                      }}
                    />
                  </div>

                  {/* Content — inline on mobile, below icon on desktop */}
                  <div className="ml-4 lg:ml-0 lg:text-center">
                    <span
                      className={`text-xs font-mono font-black tracking-wider block mb-0.5 ${
                        isCurrent
                          ? 'text-violet-600 dark:text-violet-400'
                          : isComplete
                          ? 'text-zinc-500 dark:text-zinc-400'
                          : 'text-zinc-400 dark:text-zinc-600'
                      }`}
                    >
                      {stage.level}
                    </span>
                    <div
                      className={`text-sm font-black ${
                        isCurrent
                          ? 'text-zinc-900 dark:text-white'
                          : isComplete
                          ? 'text-zinc-600 dark:text-zinc-400'
                          : 'text-zinc-400 dark:text-zinc-600'
                      }`}
                    >
                      {stage.label}
                    </div>
                  </div>
                </div>

                {/* Description card */}
                <div
                  className={`mt-4 p-4 rounded-2xl text-xs leading-relaxed ${
                    isCurrent
                      ? 'bg-violet-500/10 border border-violet-500/30 text-zinc-700 dark:text-zinc-300'
                      : isComplete
                      ? 'bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 text-zinc-500 dark:text-zinc-500'
                      : 'bg-zinc-50 dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                  }`}
                >
                  {stage.desc}
                  {stage.note && (
                    <span
                      className={`block mt-2 font-bold text-[10px] uppercase tracking-widest font-mono ${
                        isCurrent ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-400'
                      }`}
                    >
                      {stage.note}
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-400" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-violet-500" />
            <span>Current Stage</span>
          </div>
          <div className="flex items-center gap-1.5 border border-dashed border-zinc-400 rounded px-2 py-0.5">
            <span>Roadmap</span>
          </div>
        </div>
      </div>
    </section>
  )
}
