'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Lock,
  Server,
  Cloud,
  CheckCircle2,
  XCircle,
  FileCheck,
  Shield,
  EyeOff,
  Database,
  ArrowRight,
} from 'lucide-react'

export default function SovereigntySection() {
  const [deploymentMode, setDeploymentMode] = useState<'sovereign' | 'public'>('sovereign')
  const isSovereign = deploymentMode === 'sovereign'

  return (
    <section id="sovereignty" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">
          <ShieldCheck size={14} />
          <span>Enterprise AI Security & Data Sovereignty</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
          Zero-Retention Pipelines &{' '}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Air-Gapped VPC Deployments
          </span>
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed">
          Complete cryptographic data isolation. We guarantee zero training on customer data, automated real-time PII anonymization, and private on-premise foundation model clusters for HIPAA, SOC2, and GDPR workloads.
        </p>
      </div>

      {/* Main Interactive Comparison Card */}
      <div className="glass-lab p-6 sm:p-8 md:p-10 rounded-3xl border border-violet-500/20 shadow-2xl relative overflow-hidden">
        {/* Toggle Switch */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-zinc-200 dark:border-white/10">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">
              Architecture Security Scaffolding
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              Sovereignty Mode Comparison
            </h3>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center p-1 rounded-2xl bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300/80 dark:border-white/10 shadow-inner">
            <motion.button
              onClick={() => setDeploymentMode('sovereign')}
              whileHover={{ x: 2 }}
              whileTap={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200 ${
                isSovereign
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
              id="sovereignty-mode-airgap"
            >
              <Lock size={13} />
              <span>Air-Gapped Sovereign Cluster</span>
            </motion.button>
            <motion.button
              onClick={() => setDeploymentMode('public')}
              whileHover={{ x: 2 }}
              whileTap={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200 ${
                !isSovereign
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
              id="sovereignty-mode-public"
            >
              <Cloud size={13} />
              <span>Standard Public Cloud</span>
            </motion.button>
          </div>
        </div>

        {/* Dynamic Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            {
              label: 'Data Egress Rate',
              sovereignValue: '0.00% (Strict Air-Gap)',
              publicValue: '100% (Third-Party API Egress)',
              status: isSovereign ? 'secure' : 'risk',
            },
            {
              label: 'Model Training On Customer Data',
              sovereignValue: 'Guaranteed ZERO (Legal SLA)',
              publicValue: 'Possible via Model Telemetry',
              status: isSovereign ? 'secure' : 'risk',
            },
            {
              label: 'Real-Time PII Scrubbing',
              sovereignValue: 'Pre-flight Regex + NER Active',
              publicValue: 'Manual or Raw Text Sent',
              status: isSovereign ? 'secure' : 'risk',
            },
            {
              label: 'Encryption Standard',
              sovereignValue: 'AES-256 (At-Rest) / TLS 1.3',
              publicValue: 'Variable Provider Encryption',
              status: isSovereign ? 'secure' : 'risk',
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all ${
                isSovereign
                  ? 'bg-violet-500/10 dark:bg-violet-500/15 border-violet-500/30'
                  : 'bg-zinc-100 dark:bg-white/[0.02] border-zinc-200 dark:border-white/10'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-2">
                {item.label}
              </span>
              <div className="flex items-start gap-2">
                {isSovereign ? (
                  <CheckCircle2 size={16} className="text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {isSovereign ? item.sovereignValue : item.publicValue}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Badges */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold uppercase text-zinc-400">
              Audit & Compliance Scaffolding:
            </span>
            {['SOC-2 Type II Ready', 'HIPAA BAA Capable', 'GDPR Compliant', 'ISO/IEC 27001 Aligned'].map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-zinc-300 dark:border-white/10 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300"
              >
                <FileCheck size={12} className="text-violet-500" />
                <span>{badge}</span>
              </div>
            ))}
          </div>

          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors group"
          >
            <span>Request Security Whitepaper</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
