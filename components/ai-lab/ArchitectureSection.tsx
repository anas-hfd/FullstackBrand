'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Cpu,
  Database,
  Shield,
  Network,
  ChevronDown,
  ChevronUp,
  Zap,
  GitBranch,
  Layers,
  Bot,
  Lock,
  Activity,
  CheckCircle2,
  Terminal,
} from 'lucide-react'

// ─── Architecture layers data ──────────────────────────────────────────────────

interface ArchLayer {
  id: string
  tier: string
  label: string
  sublabel: string
  icon: React.ElementType
  color: string
  glow: string
  nodes: ArchNode[]
  description: string
  specs: string[]
}

interface ArchNode {
  id: string
  name: string
  type: string
  status: 'active' | 'standby' | 'processing'
}

const ARCHITECTURE_LAYERS: ArchLayer[] = [
  {
    id: 'ingestion',
    tier: 'Tier 1',
    label: 'Sovereign Data Ingestion',
    sublabel: 'Non-Egress Air-Gapped Pipeline',
    icon: Lock,
    color: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.35)',
    nodes: [
      { id: 'n1', name: 'RAG Ingestor', type: 'Vector ETL', status: 'active' },
      { id: 'n2', name: 'Doc Chunker', type: 'Semantic Split', status: 'active' },
      { id: 'n3', name: 'Audit Logger', type: 'Cryptographic', status: 'active' },
    ],
    description:
      'Proprietary data enters the pipeline through cryptographically-audited ingestion channels. All vector embedding generation occurs on-premise with zero outbound data transfer, ensuring full HIPAA/SOC-2 compliance and enterprise data sovereignty.',
    specs: [
      '100% On-Premise Embedding',
      'AES-256 At-Rest Encryption',
      'Immutable Audit Trail',
      'Multi-Tenant Isolation',
    ],
  },
  {
    id: 'vector',
    tier: 'Tier 2',
    label: 'Neural Vector Store',
    sublabel: 'RAG Vector Systems · Private Embedding Index',
    icon: Database,
    color: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.35)',
    nodes: [
      { id: 'n4', name: 'Vector Index', type: 'HNSW Graph', status: 'active' },
      { id: 'n5', name: 'Semantic Cache', type: 'Cosine ANN', status: 'processing' },
      { id: 'n6', name: 'Shard Manager', type: 'Multi-Tenant', status: 'active' },
    ],
    description:
      'Distributed private vector databases with Hierarchical Navigable Small World (HNSW) approximate nearest-neighbor search. Sharded across isolated tenant namespaces with sub-5ms P99 retrieval latency and semantic caching for frequently accessed embeddings.',
    specs: [
      '< 5ms P99 Retrieval',
      'HNSW ANN Indexing',
      'Cross-Talk Isolation: 0 bytes',
      'Adaptive Semantic Caching',
    ],
  },
  {
    id: 'orchestration',
    tier: 'Tier 3',
    label: 'Agentic Orchestration Engine',
    sublabel: 'Autonomous Multi-Agent Swarm · Deterministic Routing',
    icon: Network,
    color: '#6366F1',
    glow: 'rgba(99, 102, 241, 0.35)',
    nodes: [
      { id: 'n7', name: 'Planner Agent', type: 'Hierarchical', status: 'active' },
      { id: 'n8', name: 'Tool Router', type: 'Deterministic', status: 'active' },
      { id: 'n9', name: 'Validator Loop', type: 'Self-Healing', status: 'processing' },
    ],
    description:
      'Hierarchical multi-agent architecture with a centralized planner decomposing complex tasks into atomic sub-goals. Each sub-agent executes with deterministic tool routing, automatic retry protocols, and cross-agent context propagation via structured shared memory.',
    specs: [
      '< 45ms Agent Routing P99',
      'Hierarchical Task Decomposition',
      'Automatic Retry & Fallback',
      'Structured Shared Memory',
    ],
  },
  {
    id: 'reasoning',
    tier: 'Tier 4',
    label: 'Deterministic Reasoning Core',
    sublabel: 'Neural Architecture Synthesis · Constraint Solvers',
    icon: Cpu,
    color: '#A78BFA',
    glow: 'rgba(167, 139, 250, 0.35)',
    nodes: [
      { id: 'n10', name: 'LoRA Adapter', type: 'Domain-FT', status: 'active' },
      { id: 'n11', name: 'Constraint Solver', type: 'Neuro-Symbolic', status: 'active' },
      { id: 'n12', name: 'Output Validator', type: 'Schema Guard', status: 'active' },
    ],
    description:
      'Domain-adapted LoRA/QLoRA fine-tuned models paired with deterministic neuro-symbolic constraint solvers. Structured output validation via JSON Schema guardrails eliminates hallucinations in mission-critical workflows, delivering 99.8% structured output precision.',
    specs: [
      '99.8% Deterministic Precision',
      'LoRA/QLoRA Fine-Tuning',
      'JSON Schema Output Guard',
      'Sub-40ms Inference Latency',
    ],
  },
  {
    id: 'delivery',
    tier: 'Tier 5',
    label: 'Enterprise Delivery Interface',
    sublabel: 'REST/gRPC · Open-Standards Interoperability',
    icon: Activity,
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.35)',
    nodes: [
      { id: 'n13', name: 'API Gateway', type: 'REST/gRPC', status: 'active' },
      { id: 'n14', name: 'ERP Connector', type: 'SAP/Oracle', status: 'standby' },
      { id: 'n15', name: 'Telemetry', type: 'OpenTelemetry', status: 'active' },
    ],
    description:
      'Standardized REST and gRPC interfaces with OpenAPI 3.1 specifications for seamless ERP/CRM integration. Full OpenTelemetry observability across all agent invocations with real-time latency dashboards, error budgets, and SLO/SLA enforcement.',
    specs: [
      'OpenAPI 3.1 Compliant',
      'SAP / Oracle ERP Adapters',
      'SLA: 99.95% Uptime',
      'OpenTelemetry Tracing',
    ],
  },
]

// ─── Status Dot ───────────────────────────────────────────────────────────────

function StatusDot({ status, color }: { status: ArchNode['status']; color: string }) {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      {status !== 'standby' && (
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ background: status === 'processing' ? '#F59E0B' : color }}
        />
      )}
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{
          background:
            status === 'processing' ? '#F59E0B' :
            status === 'active' ? color : 'rgba(255,255,255,0.2)',
        }}
      />
    </span>
  )
}

// ─── Layer Card ───────────────────────────────────────────────────────────────

function LayerCard({
  layer,
  index,
  isActive,
  onToggle,
  isLast,
}: {
  layer: ArchLayer
  index: number
  isActive: boolean
  onToggle: () => void
  isLast: boolean
}) {
  const Icon = layer.icon

  return (
    <div className="relative">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[28px] top-full w-[1px] h-6 z-10"
          style={{ background: `linear-gradient(to bottom, ${layer.color}60, ${ARCHITECTURE_LAYERS[index + 1].color}40)` }}
        />
      )}

      <motion.div
        layout
        className="rounded-2xl border overflow-hidden transition-all duration-300"
        style={{
          borderColor: isActive ? `${layer.color}40` : 'rgba(255,255,255,0.06)',
          background: isActive
            ? `linear-gradient(135deg, ${layer.color}08, rgba(11,13,19,0.95))`
            : 'rgba(255,255,255,0.02)',
          boxShadow: isActive ? `0 0 40px ${layer.glow}, inset 0 0 40px ${layer.color}05` : 'none',
        }}
      >
        {/* Header row — always visible */}
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-4 p-5 text-left"
          aria-expanded={isActive}
          id={`arch-layer-${layer.id}`}
        >
          {/* Tier badge + icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              background: isActive ? `${layer.color}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isActive ? layer.color + '40' : 'rgba(255,255,255,0.07)'}`,
              boxShadow: isActive ? `0 0 16px ${layer.glow}` : 'none',
            }}
          >
            <Icon size={20} style={{ color: isActive ? layer.color : 'rgba(255,255,255,0.4)' }} />
          </div>

          {/* Labels */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
                style={{ color: layer.color + (isActive ? 'cc' : '80') }}
              >
                {layer.tier}
              </span>
            </div>
            <h3 className="font-bold text-sm text-white truncate">{layer.label}</h3>
            <p className="text-[11px] text-white/35 truncate mt-0.5">{layer.sublabel}</p>
          </div>

          {/* Nodes status pills (visible in collapsed) */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0 mr-2">
            {layer.nodes.map((n) => (
              <StatusDot key={n.id} status={n.status} color={layer.color} />
            ))}
          </div>

          {/* Expand toggle */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background: isActive ? `${layer.color}20` : 'rgba(255,255,255,0.04)' }}
          >
            {isActive
              ? <ChevronUp size={14} style={{ color: layer.color }} />
              : <ChevronDown size={14} className="text-white/30" />
            }
          </div>
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-5">
                {/* Divider */}
                <div className="h-[1px]" style={{ background: `linear-gradient(to right, ${layer.color}30, transparent)` }} />

                {/* Agent nodes */}
                <div className="grid grid-cols-3 gap-3">
                  {layer.nodes.map((node) => (
                    <div
                      key={node.id}
                      className="rounded-xl p-3 flex flex-col gap-2"
                      style={{
                        background: `${layer.color}0A`,
                        border: `1px solid ${layer.color}25`,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <StatusDot status={node.status} color={layer.color} />
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider"
                          style={{ color: node.status === 'standby' ? 'rgba(255,255,255,0.3)' : layer.color + 'cc' }}>
                          {node.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white/80 leading-tight">{node.name}</p>
                      <p className="text-[10px] text-white/35">{node.type}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-white/55 leading-relaxed">{layer.description}</p>

                {/* Spec chips */}
                <div className="flex flex-wrap gap-2">
                  {layer.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold"
                      style={{ background: `${layer.color}12`, color: `${layer.color}dd`, border: `1px solid ${layer.color}25` }}>
                      <CheckCircle2 size={10} />
                      {spec}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ─── Live Telemetry Panel ─────────────────────────────────────────────────────

const TELEMETRY_LINES = [
  { text: '// Agentic Orchestration Engine v2.4.1', color: '#A78BFA' },
  { text: '> [INIT] Loading domain LoRA adapter [enterprise-ops-v5]...', color: 'rgba(255,255,255,0.45)' },
  { text: '> [PASS] Tenant isolation: ENFORCED', color: '#10B981' },
  { text: '> [PASS] Non-egress pipeline: VERIFIED', color: '#10B981' },
  { text: '> [INIT] Spawning agent swarm: 16 workers...', color: 'rgba(255,255,255,0.45)' },
  { text: '> [OK]   Vector index loaded: 2.4M embeddings (< 3ms)', color: '#6EE7B7' },
  { text: '> [PROC] Routing task to Planner Agent [priority:HIGH]', color: '#C084FC' },
  { text: '> [PASS] Constraint solver: output validated', color: '#10B981' },
  { text: '> [METR] latency:38ms | confidence:0.9984 | agents:16', color: '#6366F1' },
  { text: '> [STATUS] COMMERCIAL WORKLOAD READY ✓', color: '#34D399' },
]

function TelemetryPanel() {
  return (
    <div
      className="rounded-2xl overflow-hidden font-mono text-xs"
      style={{
        background: 'linear-gradient(145deg, #08090f, #0b0d13)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/25">
          <Terminal size={10} />
          orchestrator.telemetry.v2 — live
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="text-[10px] text-emerald-500">ONLINE</span>
        </div>
      </div>

      {/* Terminal lines */}
      <div className="p-4 space-y-1.5">
        {TELEMETRY_LINES.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            style={{ color: line.color }}
            className="leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {line.text}
          </motion.p>
        ))}
        <p className="text-white/20 animate-pulse">█</p>
      </div>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ArchitectureSection() {
  const [activeLayer, setActiveLayer] = useState<string>('orchestration')

  return (
    <section id="architecture" className="max-w-7xl mx-auto px-6 py-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-violet-400 mb-4">
          <GitBranch size={14} />
          AI Architecture Blueprint · TRL-7 Validated
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
          Five-Tier{' '}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Sovereign AI Pipeline
          </span>
        </h2>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
          Every layer of our architecture enforces data sovereignty, deterministic output validation, and enterprise-grade observability — purpose-built to exceed federal deep-tech grant requirements and commercial deployment standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Layer stack */}
        <div className="lg:col-span-7 space-y-4">
          {ARCHITECTURE_LAYERS.map((layer, index) => (
            <LayerCard
              key={layer.id}
              layer={layer}
              index={index}
              isActive={activeLayer === layer.id}
              onToggle={() => setActiveLayer(activeLayer === layer.id ? '' : layer.id)}
              isLast={index === ARCHITECTURE_LAYERS.length - 1}
            />
          ))}
        </div>

        {/* Right: Telemetry + KPI cards */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-32">
          <TelemetryPanel />

          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'TRL Stage', value: 'TRL-7', icon: Layers, color: '#8B5CF6' },
              { label: 'Agent Latency', value: '38ms', icon: Zap, color: '#6366F1' },
              { label: 'Precision Rate', value: '99.8%', icon: CheckCircle2, color: '#A78BFA' },
              { label: 'Data Egress', value: '0 bytes', icon: Lock, color: '#10B981' },
            ].map((kpi, i) => {
              const KpiIcon = kpi.icon
              return (
                <div
                  key={i}
                  className="rounded-2xl p-4 flex flex-col gap-2"
                  style={{
                    background: `${kpi.color}08`,
                    border: `1px solid ${kpi.color}20`,
                  }}
                >
                  <KpiIcon size={16} style={{ color: kpi.color }} />
                  <div className="text-xl font-black text-white">{kpi.value}</div>
                  <div className="text-[10px] font-mono text-white/35 uppercase tracking-wider">{kpi.label}</div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.20)' }}
          >
            <div>
              <p className="text-sm font-bold text-white mb-1">Request Architecture Review</p>
              <p className="text-xs text-white/45 leading-relaxed">
                Schedule a technical deep-dive with our AI engineering team. Ideal for grant evaluators, enterprise CTOs, and strategic partners.
              </p>
            </div>
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
              id="arch-cta-btn"
            >
              <Bot size={14} />
              Schedule Technical Review
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
