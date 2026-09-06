'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu,
  Zap,
  Activity,
  Layers,
  Database,
  Network,
  CheckCircle2,
  TrendingDown,
  Gauge,
  Sparkles,
} from 'lucide-react'

interface ModelBenchmark {
  name: string
  provider: string
  ttft: number // ms Time to First Token
  throughput: number // tok/sec
  vram: string
  quantization: string
  accuracy: number // %
  costPer1k: string
  highlight?: boolean
}

const BENCHMARKS: Record<'hybrid' | 'fp16' | 'q4', ModelBenchmark[]> = {
  hybrid: [
    {
      name: 'FullstackBrand Multi-Tier Dynamic Router',
      provider: 'Proprietary Routing Architecture',
      ttft: 38,
      throughput: 145,
      vram: '16.4 GB',
      quantization: 'Dynamic FP8 / INT4',
      accuracy: 99.2,
      costPer1k: '$0.0004',
      highlight: true,
    },
    {
      name: 'Monolithic Cloud LLM Endpoint (Dense)',
      provider: 'Standard Cloud API (Dense)',
      ttft: 280,
      throughput: 75,
      vram: 'Cloud Managed',
      quantization: 'FP16 Dense',
      accuracy: 98.8,
      costPer1k: '$0.0025',
    },
    {
      name: 'Unoptimized Self-Hosted Open Cluster',
      provider: 'Baseline Open Weights Stack',
      ttft: 160,
      throughput: 62,
      vram: '120 GB (Cluster Node)',
      quantization: 'FP16 Standard',
      accuracy: 98.1,
      costPer1k: '$0.0016',
    },
  ],
  fp16: [
    {
      name: 'FullstackBrand Speculative Decoding Stack',
      provider: 'Speculative Draft Engine',
      ttft: 48,
      throughput: 130,
      vram: '32.0 GB',
      quantization: 'FP16 + Speculative Head',
      accuracy: 99.4,
      costPer1k: '$0.0007',
      highlight: true,
    },
    {
      name: 'Baseline FP16 Autoregressive Pipeline',
      provider: 'Standard Autoregressive Pipeline',
      ttft: 190,
      throughput: 54,
      vram: '128 GB',
      quantization: 'FP16',
      accuracy: 98.2,
      costPer1k: '$0.0020',
    },
  ],
  q4: [
    {
      name: 'FullstackBrand Quantized Edge Runtime',
      provider: 'Edge & Local Sovereign Core',
      ttft: 24,
      throughput: 185,
      vram: '8.5 GB (Single GPU)',
      quantization: 'AWQ 4-Bit SmoothQuant',
      accuracy: 98.9,
      costPer1k: '$0.0002',
      highlight: true,
    },
    {
      name: 'Generic 4-Bit Local Baseline',
      provider: 'Standard Local Runtime',
      ttft: 85,
      throughput: 82,
      vram: '12.0 GB',
      quantization: 'Standard 4-Bit Quant',
      accuracy: 96.2,
      costPer1k: '$0.0007',
    },
  ],
}

export default function ResearchBenchmarks() {
  const [activeTab, setActiveTab] = useState<'hybrid' | 'fp16' | 'q4'>('hybrid')

  return (
    <section id="research" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">
          <Cpu size={14} />
          <span>Applied Deep Model Optimization · Internal Prototype Research</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
          Hybrid Inference Routing &{' '}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Local Vector Architectures
          </span>
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed">
          We combine small quantized models (SLMs) for task routing with larger frontier models for deep execution. Internal prototype measurements suggest significantly lower compute cost and reduced latency versus a monolithic cloud LLM approach. Results require independent validation.
        </p>
      </div>

      {/* Interactive Benchmarks Engine */}
      <div className="glass-lab p-6 sm:p-8 md:p-10 rounded-3xl border border-violet-500/20 shadow-2xl relative overflow-hidden">
        {/* Tab Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-white/10">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">
              Internal Prototype Benchmarks — Not Independently Validated
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              Architecture Measurement Targets
            </h3>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10">
            {(
              [
                { id: 'hybrid', label: 'Hybrid Swarm Router' },
                { id: 'fp16', label: 'FP16 Speculative' },
                { id: 'q4', label: 'AWQ 4-Bit Edge' },
              ] as const
            ).map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ x: 2 }}
                whileTap={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
                id={`benchmark-tab-${tab.id}`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Benchmarks Table / Grid */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-200/80 dark:border-white/10 text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                <th className="py-3 px-4">Architecture / Pipeline</th>
                <th className="py-3 px-4">TTFT (prototype test)</th>
                <th className="py-3 px-4">Throughput (observed)</th>
                <th className="py-3 px-4">VRAM (single-run)</th>
                <th className="py-3 px-4">Quantization</th>
                <th className="py-3 px-4">Schema Accuracy</th>
                <th className="py-3 px-4 text-right">Est. Cost / 1K Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-white/5 text-xs sm:text-sm">
              <AnimatePresence>
                {BENCHMARKS[activeTab].map((row, idx) => (
                  <motion.tr
                    key={row.name + activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    className={`transition-colors ${
                      row.highlight
                        ? 'bg-violet-500/10 dark:bg-violet-600/15 font-semibold text-zinc-900 dark:text-white border-l-4 border-violet-600'
                        : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {row.highlight && <Sparkles size={14} className="text-violet-500 animate-pulse" />}
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white">{row.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{row.provider}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold">
                      <span className={row.highlight ? 'text-violet-600 dark:text-violet-300' : ''}>
                        {row.ttft} ms
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <span className={row.highlight ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                        {row.throughput} tok/s
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-zinc-500 dark:text-zinc-400">{row.vram}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {row.quantization}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                      {row.accuracy}%
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-zinc-900 dark:text-white">
                      {row.costPer1k}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Methodology notice + 3 metric summary cards */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/10">
          {/* Disclaimer */}
          <div className="mb-6 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-3">
            <span className="text-amber-500 text-lg leading-none flex-shrink-0">⚠</span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">Internal Prototype Benchmarks.</span>{' '}
              All measurements above were conducted in our internal test environment on specific hardware configurations under controlled workloads. They have <span className="font-bold">not been independently validated</span> by a third party. Performance varies significantly by model, hardware, concurrency, and workload characteristics. These figures represent prototype-stage observations, not production guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1">
              <Zap size={16} />
              <span className="text-xs font-mono font-bold uppercase">Router Stage: &lt;28ms (internal)</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Observed routing-decision latency in prototype tests. End-to-end TTFT measured at 38ms for the full hybrid pipeline. These are internal measurements on a single hardware configuration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <TrendingDown size={16} />
              <span className="text-xs font-mono font-bold uppercase">~84% Lower Compute (observed)</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Approximate compute reduction versus a monolithic FP16 cloud baseline, observed in prototype tests. Not a production cost guarantee. Actual savings depend on workload mix and concurrency.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <CheckCircle2 size={16} />
              <span className="text-xs font-mono font-bold uppercase">99.8% Schema Conformance (test set)</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              JSON schema guardrail accuracy measured on an internal benchmark dataset. Not a general determinism guarantee. Results vary by prompt complexity and model version.
            </p>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
