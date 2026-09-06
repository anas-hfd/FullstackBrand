// FullstackBrand
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Workflow, Zap, Brain, GitBranch, ArrowRight } from 'lucide-react'

interface AgentStep {
  action: string
  duration: string
}

// Capability descriptions — honest prototype-stage framing
const capabilities = [
  {
    icon: Brain,
    label: 'Hybrid LLM Routing',
    desc: 'SLM pre-routing architecture to direct tasks to appropriate model tiers',
  },
  {
    icon: Workflow,
    label: 'Agent Orchestration',
    desc: 'Multi-step agent pipelines with structured tool-calling and validation loops',
  },
  {
    icon: Zap,
    label: 'Low-Latency Design',
    desc: 'Architecture optimized for reduced routing latency — currently prototype-stage',
  },
  {
    icon: GitBranch,
    label: 'Sovereign Deployment',
    desc: 'Inference within customer-controlled infrastructure — optional deployment mode',
  },
]

export default function AIShowcase() {
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    fetch('/api/automation/demo')
      .then(res => res.json())
      .then((data: { steps: AgentStep[] }) => {
        setSteps(data.steps)
        // Animate steps one by one
        data.steps.forEach((_: AgentStep, i: number) => {
          setTimeout(() => setActiveStep(i), i * 800 + 600)
        })
      })
      .catch(() => {
        // Silently fail — section renders without demo steps
      })
  }, [])

  return (
    <section id="ai-showcase" className="max-w-7xl mx-auto px-6 py-24 relative">
      <span id="ai" className="absolute -top-24" />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-brand-light dark:text-brand-dark font-semibold mb-3 block">
          AI Systems Architecture
        </span>
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Agent Orchestration</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          We design and deploy multi-agent systems that connect language models to enterprise workflows — integrating with existing stacks through structured tool-calling and retrieval pipelines.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: capability cards */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-2 gap-4 mb-8">
            {capabilities.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group glass p-4 rounded-2xl hover:border-brand-light/40 dark:hover:border-brand-dark/40 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-light/10 dark:bg-brand-dark/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-brand-light dark:text-brand-dark" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Architecture status — honest framing */}
          <div className="glass p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-semibold">Architecture Status — Active Prototype Development</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              The multi-agent routing and orchestration system is in active development. Internal prototype tests have demonstrated routing behavior and tool-calling mechanics. External validation has not yet been conducted.
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-white/10">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">PROTOTYPE</span>
              <span className="text-xs text-slate-400">Benchmarks are internal measurements — not independently validated</span>
            </div>
          </div>
        </motion.div>

        {/* Right: terminal / live agent log */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl overflow-hidden font-mono text-sm shadow-2xl"
        >
          {/* Terminal titlebar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/50 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">FSB-Agent — Demo Simulation</span>
            <Bot size={14} className="text-brand-light dark:text-brand-dark" />
          </div>

          <div className="p-6 space-y-3 min-h-[280px]">
            <div className="text-slate-400 dark:text-slate-500 text-xs mb-4">
              <span className="text-brand-light dark:text-brand-dark">$</span> agent.run(&#123;task: &quot;process_inquiry&quot;&#125;)
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={activeStep >= i ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-brand-light/50 dark:bg-brand-dark/50 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 dark:text-slate-500 text-xs">[{step.duration}] </span>
                  <span className="text-slate-800 dark:text-slate-200">{step.action}</span>
                </div>
              </motion.div>
            ))}

            {/* Blinking cursor */}
            {activeStep >= steps.length - 1 && steps.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 mt-2"
              >
                <span className="text-brand-light dark:text-brand-dark text-xs">$</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-4 bg-brand-light dark:bg-brand-dark rounded-sm inline-block"
                />
              </motion.div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-4 border-t border-slate-200/50 dark:border-white/10">
            <motion.a
              href="#start"
              whileHover={{ x: 4 }}
              whileTap={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center gap-2 text-xs font-semibold text-brand-light dark:text-brand-dark hover:gap-3 transition-all duration-200"
            >
              Discuss an AI integration for your organisation <ArrowRight size={12} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}