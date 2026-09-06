'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  Lock,
  Database,
  Network,
  Zap,
  Server,
  Activity,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Shield,
  Terminal,
} from 'lucide-react'

interface TopologyNode {
  id: string
  title: string
  subtitle: string
  tag: string
  icon: React.ElementType
  color: string
  glow: string
  latency: string
  throughput: string
  description: string
  telemetry: string[]
}

const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: 'ingestion',
    title: 'Edge Ingestion',
    subtitle: 'TLS 1.3 / gRPC Inbound Gateway',
    tag: 'Step 1',
    icon: Server,
    color: '#EC4899',
    glow: 'rgba(236,72,153,0.4)',
    latency: '1.8ms',
    throughput: '42,000 req/s',
    description: 'High-throughput edge ingestion proxy validating client JWTs, stripping PII, and enforcing rate limiting before dispatching payloads to the internal event bus.',
    telemetry: [
      'PII Scrubbing: Active (Zero Retention)',
      'mTLS Tunneling: ENFORCED',
      'Ingress Protocol: HTTP/3 & gRPC',
    ],
  },
  {
    id: 'cache',
    title: 'Semantic Cache',
    subtitle: 'Cosine Similarity Buffer',
    tag: 'Step 2',
    icon: Layers,
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.4)',
    latency: '4.2ms',
    throughput: '88% Hit Rate',
    description: 'In-memory embedding cache checking incoming queries against pre-computed responses. Returns exact or near-match answers instantly, bypassing LLM generation completely.',
    telemetry: [
      'Cache Hit Latency: 3.8ms P99',
      'Similarity Threshold: 0.94 cosine',
      'Egress Savings: 62% API Compute',
    ],
  },
  {
    id: 'router',
    title: 'LLM Router & Orchestrator',
    subtitle: 'Dynamic Tier Routing · SLM + Frontier',
    tag: 'Step 3',
    icon: Cpu,
    color: '#6366F1',
    glow: 'rgba(99,102,241,0.4)',
    latency: '24.5ms',
    throughput: 'Dynamic Routing',
    description: 'Autonomous model dispatcher evaluating task complexity. Directs high-throughput triage queries to low-latency quantized SLMs and deep multi-step reasoning workflows to specialized frontier model clusters.',
    telemetry: [
      'Task Triage SLA: < 15ms',
      'Model Concurrency: 128 streams',
      'Schema Guardrails: Deterministic JSON',
    ],
  },
  {
    id: 'vectordb',
    title: 'High-Dimensional Vector DB',
    subtitle: 'Private HNSW Sovereign Index',
    tag: 'Step 4',
    icon: Database,
    color: '#10B981',
    glow: 'rgba(16,185,129,0.4)',
    latency: '6.1ms',
    throughput: '1.2M Vectors',
    description: 'Dedicated enterprise vector repository storing domain embeddings in cryptographically isolated tenant namespaces. Zero cross-talk with public foundation model training sets.',
    telemetry: [
      'Index Algorithm: HNSW M=32 ef=64',
      'Tenant Isolation: Level 4 Air-Gap',
      'Data Egress to Public LLM: 0.00%',
    ],
  },
  {
    id: 'webhooks',
    title: 'Distributed Webhooks',
    subtitle: 'Enterprise Event Egress',
    tag: 'Step 5',
    icon: Zap,
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.4)',
    latency: '8.4ms',
    throughput: '99.99% Reliability',
    description: 'Guaranteed delivery broker streaming validated structured payloads to client CRM, ERP, Slack, or webhook endpoints with automated retry backoffs.',
    telemetry: [
      'Retry Backoff: Exponential (Max 5)',
      'Payload Verification: HMAC-SHA256',
      'Egress Dispatch: < 10ms',
    ],
  },
]

export default function ArchitectureVisualizer() {
  const [activeNodeId, setActiveNodeId] = useState<string>('router')
  const activeNode = TOPOLOGY_NODES.find((n) => n.id === activeNodeId) || TOPOLOGY_NODES[2]

  return (
    <section id="architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">
          <GitBranch size={14} />
          <span>High-Throughput Enterprise Data Topology · Advancing Toward TRL-7</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
          Distributed Pipeline &{' '}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Compute Topology
          </span>
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed">
          Engineered for extreme API concurrency and grant-scale compute utilization. Our five-stage pipeline enforces strict security isolation while orchestrating high-dimensional foundation models.
        </p>
      </div>

      {/* Interactive Topology Visualizer */}
      <div className="glass-lab p-6 sm:p-8 md:p-10 rounded-3xl border border-violet-500/20 shadow-2xl relative overflow-hidden">
        {/* Step Indicator Flow Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {TOPOLOGY_NODES.map((node, i) => {
            const Icon = node.icon
            const isActive = activeNodeId === node.id
            return (
              <motion.button
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                whileHover={{ x: 3 }}
                whileTap={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`p-4 rounded-2xl border text-left transition-colors relative ${
                  isActive
                    ? 'border-violet-500 bg-violet-500/15 dark:bg-violet-500/20 shadow-lg scale-105 z-10'
                    : 'border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
                id={`topology-node-${node.id}`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="topology-active-indicator"
                    className="absolute inset-0 rounded-2xl border-2 border-violet-500 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: node.color }}
                  >
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-zinc-400">
                    {node.tag}
                  </span>
                </div>

                <div className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white truncate">
                  {node.title}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                  {node.latency}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 border-t border-zinc-200 dark:border-white/10">
          {/* Left: Deep Dive Info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-white uppercase"
                style={{ backgroundColor: activeNode.color }}
              >
                {activeNode.tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                {activeNode.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm font-mono text-zinc-500 dark:text-zinc-400">
              {activeNode.subtitle}
            </p>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {activeNode.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Stage Latency</span>
                <span className="text-lg font-black text-violet-600 dark:text-violet-400 font-mono">
                  {activeNode.latency}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Benchmark Rate</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {activeNode.throughput}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Live Telemetry Terminal */}
          <div className="lg:col-span-5 bg-zinc-950 text-white p-6 rounded-2xl border border-white/10 shadow-2xl font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-zinc-400 text-[10px] uppercase">pipeline.stream.v3</span>
            </div>

            <div className="space-y-2 text-zinc-300">
              <p className="text-violet-400 font-bold">
                {'//'} Active Node: {activeNode.title}
              </p>
              {activeNode.telemetry.map((line, idx) => (
                <p key={idx} className="text-zinc-300">
                  <span className="text-zinc-500">&gt;</span> {line}
                </p>
              ))}
              <p className="text-emerald-400 pt-1">
                &gt; status: 200 OK · DATA FLOW STABLE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
