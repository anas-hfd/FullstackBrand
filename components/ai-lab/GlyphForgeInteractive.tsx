'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Folder,
  Code2,
  Database,
  Film,
  Brain,
  Download,
  Copy,
  Check,
  Wand2,
  Monitor,
  Terminal,
  Layers,
  ArrowRight,
  RefreshCw,
  Zap,
} from 'lucide-react'

type OSPreset = 'macos' | 'win11' | 'linux'
type BadgeType = 'none' | 'code' | 'database' | 'media' | 'neural'

interface ToneOption {
  id: string
  name: string
  accent: string
  secondary: string
  gradient: string
}

const TONES: ToneOption[] = [
  { id: 'obsidian-violet', name: 'Obsidian Violet', accent: '#8B5CF6', secondary: '#C084FC', gradient: 'from-violet-600 to-indigo-600' },
  { id: 'neon-emerald', name: 'Neon Emerald', accent: '#10B981', secondary: '#34D399', gradient: 'from-emerald-600 to-teal-500' },
  { id: 'cyan-matrix', name: 'Cyan Matrix', accent: '#06B6D4', secondary: '#67E8F9', gradient: 'from-cyan-500 to-blue-600' },
  { id: 'amber-cyber', name: 'Amber Cyberpunk', accent: '#F59E0B', secondary: '#FCD34D', gradient: 'from-amber-500 to-orange-600' },
  { id: 'rose-holo', name: 'Rose Holo', accent: '#F43F5E', secondary: '#FDA4AF', gradient: 'from-rose-500 to-purple-600' },
]

const PRESET_EXAMPLES = [
  'Cyberpunk Neomorphic Dev Directory',
  'macOS Sequoia Glass Data Archive',
  'Sovereign AI Foundation Model Weights',
  'Quantum Cryptographic Key Store',
]

export default function GlyphForgeInteractive() {
  const [prompt, setPrompt] = useState('Cyberpunk Neomorphic Dev Directory')
  const [osPreset, setOsPreset] = useState<OSPreset>('macos')
  const [selectedTone, setSelectedTone] = useState<ToneOption>(TONES[0])
  const [badge, setBadge] = useState<BadgeType>('code')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [exportFeedback, setExportFeedback] = useState<string | null>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 600)
  }

  const handleExport = (format: string) => {
    setExportFeedback(`Exported ${prompt.slice(0, 18)}... as .${format}`)
    setTimeout(() => setExportFeedback(null), 2500)
  }

  const handleCopySVG = () => {
    setCopied(true)
    navigator.clipboard.writeText(`<!-- GlyphForge AI Generated SVG: ${prompt} [${osPreset}] -->
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="folder-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${selectedTone.accent}" />
      <stop offset="100%" stop-color="${selectedTone.secondary}" />
    </linearGradient>
  </defs>
  <rect x="24" y="56" width="208" height="152" rx="${osPreset === 'macos' ? 24 : osPreset === 'win11' ? 8 : 4}" fill="url(#folder-grad)" />
</svg>`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="saas-development" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">
          <Sparkles size={14} />
          <span>Generative OS Toolsets & Enterprise SaaS Suite</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
          GlyphForge AI &{' '}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Contextual Asset Engines
          </span>
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed">
          GlyphForge AI converts natural language prompts into production-ready, OS-native icon hierarchies and vector suites for macOS, Windows 11, and Linux systems with zero manual asset slicing.
        </p>
      </div>

      {/* Main Interactive Studio Box */}
      <div className="glass-lab p-6 sm:p-8 md:p-10 rounded-3xl border border-violet-500/20 shadow-2xl relative overflow-hidden mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Prompt Bar */}
            <div className="space-y-2">
              <label htmlFor="glyph-prompt-input" className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Natural Language Asset Prompt
              </label>
              <div className="relative">
                <input
                  id="glyph-prompt-input"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Cyberpunk Neomorphic Dev Directory"
                  className="w-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-300 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-inner"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-violet-600/20 disabled:opacity-50"
                  id="generate-glyph-btn"
                >
                  {isGenerating ? <RefreshCw size={13} className="animate-spin" /> : <Wand2 size={13} />}
                  <span>Generate</span>
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(ex)
                      handleGenerate()
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. OS Preset Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                Target Operating System Preset
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'macos', label: 'macOS Sequoia', sub: 'Frosted Glass', icon: Monitor },
                  { id: 'win11', label: 'Windows 11', sub: 'Fluent Acrylic', icon: Layers },
                  { id: 'linux', label: 'Linux Minimal', sub: 'Flat Vector', icon: Terminal },
                ].map((os) => {
                  const Icon = os.icon
                  const active = osPreset === os.id
                  return (
                    <button
                      key={os.id}
                      onClick={() => setOsPreset(os.id as OSPreset)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        active
                          ? 'border-violet-500 bg-violet-500/10 dark:bg-violet-500/20 shadow-sm'
                          : 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                      }`}
                      id={`os-preset-${os.id}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={14} className={active ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-400'} />
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">{os.label}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">{os.sub}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Tone & Lighting Preset */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                Lighting & Color Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedTone.id === tone.id
                        ? 'border-zinc-950 dark:border-white bg-zinc-100 dark:bg-white/10 text-zinc-950 dark:text-white scale-105 shadow-sm'
                        : 'border-zinc-200 dark:border-white/10 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5'
                    }`}
                    id={`tone-${tone.id}`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tone.accent }} />
                    <span>{tone.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Contextual Badge Overlay */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                Contextual Badge Overlay
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'none', label: 'Plain Folder', icon: Folder },
                  { id: 'code', label: 'Dev Code (< />)', icon: Code2 },
                  { id: 'database', label: 'SQL Database', icon: Database },
                  { id: 'media', label: 'Media Assets', icon: Film },
                  { id: 'neural', label: 'Neural Weights', icon: Brain },
                ].map((b) => {
                  const Icon = b.icon
                  const active = badge === b.id
                  return (
                    <button
                      key={b.id}
                      onClick={() => setBadge(b.id as BadgeType)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        active
                          ? 'border-violet-500 bg-violet-500/15 text-violet-600 dark:text-violet-300 font-bold'
                          : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5'
                      }`}
                      id={`badge-${b.id}`}
                    >
                      <Icon size={13} />
                      <span>{b.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Live SVG & Lighting Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl bg-zinc-950 text-white relative border border-white/10 shadow-2xl overflow-hidden min-h-[380px]">
            {/* Ambient Background Radial Lighting */}
            <div
              className="absolute inset-0 opacity-40 blur-3xl transition-all duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${selectedTone.accent}, transparent 70%)`,
              }}
            />

            {/* Folder Art Simulation */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                key={`${osPreset}-${selectedTone.id}-${badge}-${prompt}`}
                initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative w-44 h-40 sm:w-56 sm:h-48 flex items-center justify-center cursor-pointer group"
              >
                {/* SVG Folder Structure */}
                <svg
                  viewBox="0 0 220 180"
                  className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="folderBase" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={selectedTone.accent} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={selectedTone.secondary} stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="folderTab" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={selectedTone.accent} stopOpacity="0.7" />
                      <stop offset="100%" stopColor={selectedTone.secondary} stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="glassSheen" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Back Tab */}
                  <path
                    d={
                      osPreset === 'macos'
                        ? 'M 20 45 Q 20 25 40 25 L 85 25 Q 100 25 110 38 L 120 48 L 190 48 Q 205 48 205 60 L 205 140 Q 205 155 190 155 L 30 155 Q 15 155 15 140 Z'
                        : 'M 15 35 L 80 35 L 100 50 L 205 50 L 205 155 L 15 155 Z'
                    }
                    fill="url(#folderTab)"
                  />

                  {/* Front Main Body */}
                  <rect
                    x="15"
                    y="50"
                    width="190"
                    height="115"
                    rx={osPreset === 'macos' ? '20' : osPreset === 'win11' ? '8' : '2'}
                    fill="url(#folderBase)"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1.5"
                  />

                  {/* Glass Acrylic Sheen Layer */}
                  {osPreset !== 'linux' && (
                    <rect
                      x="18"
                      y="53"
                      width="184"
                      height="50"
                      rx={osPreset === 'macos' ? '18' : '6'}
                      fill="url(#glassSheen)"
                    />
                  )}

                  {/* Contextual Icon Badge */}
                  {badge === 'code' && (
                    <g transform="translate(85, 85)" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15,5 5,18 15,31" />
                      <polyline points="35,5 45,18 35,31" />
                      <line x1="28" y1="5" x2="22" y2="31" />
                    </g>
                  )}
                  {badge === 'database' && (
                    <g transform="translate(90, 85)" fill="none" stroke="white" strokeWidth="2.5">
                      <ellipse cx="20" cy="8" rx="18" ry="6" />
                      <path d="M 2 8 L 2 24 C 2 28 38 28 38 24 L 38 8" />
                      <path d="M 2 16 C 2 20 38 20 38 16" />
                    </g>
                  )}
                  {badge === 'media' && (
                    <g transform="translate(92, 88)" fill="white">
                      <polygon points="12,6 36,18 12,30" />
                    </g>
                  )}
                  {badge === 'neural' && (
                    <g transform="translate(90, 85)" stroke="white" strokeWidth="2" fill="white">
                      <circle cx="10" cy="18" r="4" />
                      <circle cx="30" cy="18" r="4" />
                      <circle cx="20" cy="6" r="4" />
                      <circle cx="20" cy="30" r="4" />
                      <line x1="10" y1="18" x2="20" y2="6" stroke="white" strokeWidth="1.5" />
                      <line x1="30" y1="18" x2="20" y2="6" stroke="white" strokeWidth="1.5" />
                      <line x1="10" y1="18" x2="20" y2="30" stroke="white" strokeWidth="1.5" />
                      <line x1="30" y1="18" x2="20" y2="30" stroke="white" strokeWidth="1.5" />
                    </g>
                  )}
                </svg>
              </motion.div>

              {/* Title Tag */}
              <div className="mt-4 text-center">
                <span className="text-xs font-mono font-bold tracking-tight text-white/90 block">
                  {prompt}
                </span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
                  {osPreset.toUpperCase()} · 256x256 Retina Ready
                </span>
              </div>
            </div>

            {/* Quick Export Action Bar */}
            <div className="relative z-10 w-full mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                {(['icns', 'ico', 'svg', 'png'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono uppercase text-[10px] font-bold transition-colors"
                    id={`export-${fmt}`}
                  >
                    .{fmt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopySVG}
                className="flex items-center gap-1 text-[11px] text-white/70 hover:text-white font-mono bg-white/5 hover:bg-white/15 px-3 py-1 rounded-lg border border-white/10 transition-colors"
                id="copy-svg-btn"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy SVG'}</span>
              </button>
            </div>

            {/* Feedback notification toast */}
            <AnimatePresence>
              {exportFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-16 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5"
                >
                  <Check size={13} />
                  <span>{exportFeedback}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Additional SaaS Suite Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl border border-violet-500/20 hover:border-violet-500/40 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/10 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Autonomous Agent Orchestrator
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
            Multi-agent task decomposition pipelines with self-correcting validation loops, structured tool calling, and high-concurrency event brokers.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-600 dark:text-violet-400">
            <span>SaaS Core · Active Pilot</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-violet-500/20 hover:border-violet-500/40 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
            <Database size={24} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Real-Time Vector Token Synthesizer
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
            Distributed vector indexing engine with private in-memory HNSW graphs and sub-5ms semantic similarity retrieval across millions of tokens.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <span>RAG Infrastructure · TRL-7</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  )
}
