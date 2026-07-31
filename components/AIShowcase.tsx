// FullstackBrand
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Workflow, CheckCircle2, Zap, Brain, Shield, ArrowRight } from 'lucide-react'

const capabilities = [
  { icon: Brain, label: 'Best-in-Class LLM', desc: 'The best model selected for your specific task' },
  { icon: Workflow, label: 'Agent Orchestration', desc: 'Complex multi-step agent pipelines' },
  { icon: Zap, label: 'Real-time', desc: 'Sub-100ms response times' },
  { icon: Shield, label: 'Enterprise', desc: 'SOC2 compliant infrastructure' },
]

export default function AIShowcase() {
  const [steps, setSteps] = useState<any[]>([])
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    fetch('/api/automation/demo')
      .then(res => res.json())
      .then(data => {
        setSteps(data.steps)
        // Animate steps one by one
        data.steps.forEach((_: any, i: number) => {
          setTimeout(() => setActiveStep(i), i * 800 + 600)
        })
      })
  }, [])

  return (
    <section id="ai" className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-brand-light dark:text-brand-dark font-semibold mb-3 block">
          AI Infrastructure
        </span>
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">AI Automation</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          We deploy intelligent agents that don&apos;t just answer questions — they execute tasks and connect to your entire enterprise stack.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: text + capability cards */}
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

          {/* Stats bar */}
          <div className="glass p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-semibold">Agent Network — Online</span>
            </div>
            {[
              { label: 'Tasks Automated Daily', value: '12,450', width: '82%' },
              { label: 'Avg. Resolution Time', value: '1.4s', width: '94%' },
              { label: 'Human Escalation Rate', value: '2.1%', width: '12%' },
            ].map(({ label, value, width }) => (
              <div key={label} className="mb-3 last:mb-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400">{label}</span>
                  <span className="font-bold text-brand-light dark:text-brand-dark">{value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-light to-brand-dark"
                  />
                </div>
              </div>
            ))}
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
            <span className="text-xs text-slate-400 dark:text-slate-500">FSB-Agent — Live Session</span>
            <Bot size={14} className="text-brand-light dark:text-brand-dark" />
          </div>

          <div className="p-6 space-y-3 min-h-[280px]">
            <div className="text-slate-400 dark:text-slate-500 text-xs mb-4">
              <span className="text-brand-light dark:text-brand-dark">$</span> agent.run(&#123;task: &quot;process_lead&quot;&#125;)
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={activeStep >= i ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 size={15} className="text-brand-light dark:text-brand-dark flex-shrink-0 mt-0.5" />
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
            <a
              href="#configurator"
              className="flex items-center gap-2 text-xs font-semibold text-brand-light dark:text-brand-dark hover:gap-3 transition-all duration-200"
            >
              Deploy an AI Agent for your business <ArrowRight size={12} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}