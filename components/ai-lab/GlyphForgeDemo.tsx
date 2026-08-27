'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Folder,
  FolderOpen,
  Play,
  RefreshCw,
  Download,
  Code2,
  Wand2,
  ChevronRight,
  Cpu,
  Zap,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface GlyphConfig {
  style: 'minimal' | 'gradient' | 'neon' | 'glassmorphic' | 'holographic'
  accent: string
  shape: 'round' | 'sharp' | 'pill'
  label: string
  icon: 'folder' | 'document' | 'data' | 'code' | 'neural'
  depth: 'flat' | 'elevated' | 'volumetric'
}

interface GeneratedGlyph {
  id: string
  config: GlyphConfig
  svg: string
  prompt: string
  timestamp: number
}

// ─── Preset Prompts ───────────────────────────────────────────────────────────

const EXAMPLE_PROMPTS = [
  'A neural vector folder with violet glow, glassmorphic depth, and quantum circuit accents',
  'Minimal obsidian document icon with neon indigo line art, TRL-7 badge',
  'Holographic data archive folder, chromatic aberration, depth-field blur shadow',
  'Sovereign AI agent icon — purple gradient mesh, deterministic grid overlay',
  'Autonomous orchestration hub icon, multi-ring concentric frame, emerald pulse',
]

const STYLE_OPTIONS: GlyphConfig['style'][] = ['minimal', 'gradient', 'neon', 'glassmorphic', 'holographic']
const ACCENT_OPTIONS = ['#8B5CF6', '#6366F1', '#C084FC', '#10B981', '#F59E0B', '#EC4899']
const SHAPE_OPTIONS: GlyphConfig['shape'][] = ['round', 'sharp', 'pill']

// ─── SVG Generator ─────────────────────────────────────────────────────────────
// Deterministic SVG generation from GlyphConfig (client-side, no external API)

function generateSVGFromConfig(cfg: GlyphConfig): string {
  const accent = cfg.accent
  const accentDim = accent + '55'
  const accentFaint = accent + '1A'

  const rx =
    cfg.shape === 'round' ? '16' :
    cfg.shape === 'pill' ? '28' : '4'

  const hasGlow = cfg.style === 'neon' || cfg.style === 'holographic'
  const hasGlass = cfg.style === 'glassmorphic' || cfg.style === 'holographic'
  const hasGradient = cfg.style === 'gradient' || cfg.style === 'holographic'

  const depth3D = cfg.depth === 'volumetric' ? `
    <ellipse cx="64" cy="112" rx="36" ry="6" fill="${accent}20" />
    <ellipse cx="64" cy="110" rx="28" ry="4" fill="${accent}15" />
  ` : cfg.depth === 'elevated' ? `
    <rect x="20" y="108" width="88" height="4" rx="2" fill="${accent}18" />
  ` : ''

  const iconPath = (() => {
    switch (cfg.icon) {
      case 'document':
        return `<rect x="44" y="38" width="40" height="52" rx="4" fill="${accentFaint}" stroke="${accent}" stroke-width="1.5"/>
                <line x1="52" y1="52" x2="76" y2="52" stroke="${accent}" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="52" y1="60" x2="76" y2="60" stroke="${accent}" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="52" y1="68" x2="70" y2="68" stroke="${accent}" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="70" y="38" width="12" height="12" rx="0" fill="${accent}" opacity="0.6"/>`
      case 'data':
        return `<rect x="42" y="42" width="44" height="44" rx="4" fill="${accentFaint}" stroke="${accent}" stroke-width="1.5"/>
                <circle cx="56" cy="56" r="5" fill="${accent}" opacity="0.8"/>
                <circle cx="72" cy="56" r="5" fill="${accent}" opacity="0.4"/>
                <circle cx="64" cy="70" r="5" fill="${accent}" opacity="0.6"/>
                <line x1="56" y1="56" x2="72" y2="56" stroke="${accent}" stroke-width="1" opacity="0.5"/>
                <line x1="56" y1="56" x2="64" y2="70" stroke="${accent}" stroke-width="1" opacity="0.5"/>
                <line x1="72" y1="56" x2="64" y2="70" stroke="${accent}" stroke-width="1" opacity="0.5"/>`
      case 'code':
        return `<rect x="42" y="42" width="44" height="44" rx="4" fill="${accentFaint}" stroke="${accent}" stroke-width="1.5"/>
                <polyline points="58,54 50,64 58,74" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <polyline points="70,54 78,64 70,74" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <line x1="60" y1="76" x2="68" y2="52" stroke="${accent}" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>`
      case 'neural':
        return `<circle cx="64" cy="46" r="6" fill="${accent}" opacity="0.9"/>
                <circle cx="46" cy="66" r="5" fill="${accent}" opacity="0.7"/>
                <circle cx="82" cy="66" r="5" fill="${accent}" opacity="0.7"/>
                <circle cx="54" cy="84" r="4" fill="${accent}" opacity="0.5"/>
                <circle cx="74" cy="84" r="4" fill="${accent}" opacity="0.5"/>
                <line x1="64" y1="52" x2="46" y2="61" stroke="${accent}" stroke-width="1.2" opacity="0.6"/>
                <line x1="64" y1="52" x2="82" y2="61" stroke="${accent}" stroke-width="1.2" opacity="0.6"/>
                <line x1="46" y1="71" x2="54" y2="80" stroke="${accent}" stroke-width="1.2" opacity="0.4"/>
                <line x1="82" y1="71" x2="74" y2="80" stroke="${accent}" stroke-width="1.2" opacity="0.4"/>
                <line x1="46" y1="71" x2="74" y2="80" stroke="${accent}" stroke-width="0.8" opacity="0.2"/>
                <line x1="82" y1="71" x2="54" y2="80" stroke="${accent}" stroke-width="0.8" opacity="0.2"/>`
      default: // folder
        return `<path d="M 36 54 L 36 88 Q 36 92 40 92 L 92 92 Q 96 92 96 88 L 96 62 Q 96 58 92 58 L 66 58 L 62 54 Z" fill="${accentFaint}" stroke="${accent}" stroke-width="1.5"/>
                <path d="M 36 62 L 96 62" stroke="${accent}" stroke-width="1" opacity="0.4"/>`
    }
  })()

  const glassOverlay = hasGlass ? `
    <rect x="26" y="26" width="76" height="76" rx="${rx}" fill="url(#glass)" opacity="0.15"/>
    <rect x="26" y="26" width="76" height="30" rx="${rx}" fill="white" opacity="0.04"/>
  ` : ''

  const glowFilter = hasGlow ? `
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  ` : ''

  const holographicLines = cfg.style === 'holographic' ? `
    <line x1="26" y1="50" x2="102" y2="50" stroke="white" stroke-width="0.4" opacity="0.08"/>
    <line x1="26" y1="64" x2="102" y2="64" stroke="white" stroke-width="0.4" opacity="0.06"/>
    <line x1="26" y1="78" x2="102" y2="78" stroke="white" stroke-width="0.4" opacity="0.04"/>
  ` : ''

  const label = cfg.label.length > 12 ? cfg.label.slice(0, 12) + '…' : cfg.label

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    ${hasGradient ? `
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${accent}88" stop-opacity="0.08"/>
    </linearGradient>
    <radialGradient id="grd" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>` : ''}
    ${hasGlass ? `
    <linearGradient id="glass" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="white" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>` : ''}
    ${glowFilter}
  </defs>

  <!-- Drop shadow / depth -->
  ${depth3D}

  <!-- Background container -->
  <rect x="16" y="16" width="96" height="96" rx="${rx}"
    fill="${hasGradient ? 'url(#bg)' : accentFaint}"
    stroke="${accent}" stroke-width="1.2" opacity="${cfg.style === 'minimal' ? 0.7 : 1}"/>

  ${hasGradient ? `<rect x="16" y="16" width="96" height="96" rx="${rx}" fill="url(#grd)"/>` : ''}
  ${holographicLines}

  <!-- Icon -->
  <g filter="${hasGlow ? 'url(#glow)' : ''}">${iconPath}</g>

  <!-- Glass overlay -->
  ${glassOverlay}

  <!-- Label badge -->
  <rect x="24" y="100" width="${label.length * 5.5 + 12}" height="14" rx="7" fill="${accent}" opacity="0.85"/>
  <text x="${24 + (label.length * 5.5 + 12) / 2}" y="110" font-family="system-ui,monospace" font-size="6.5" font-weight="700"
    fill="white" text-anchor="middle" dominant-baseline="middle">${label}</text>

  <!-- Corner accent -->
  <circle cx="104" cy="24" r="4" fill="${accent}" opacity="0.6"/>
  <circle cx="104" cy="24" r="2" fill="${accent}"/>
</svg>`
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function GlyphForgeDemo() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedGlyphs, setGeneratedGlyphs] = useState<GeneratedGlyph[]>([])
  const [selectedStyle, setSelectedStyle] = useState<GlyphConfig['style']>('glassmorphic')
  const [selectedAccent, setSelectedAccent] = useState('#8B5CF6')
  const [selectedShape, setSelectedShape] = useState<GlyphConfig['shape']>('round')
  const [selectedIcon, setSelectedIcon] = useState<GlyphConfig['icon']>('folder')
  const [selectedDepth, setSelectedDepth] = useState<GlyphConfig['depth']>('elevated')
  const [activeGlyph, setActiveGlyph] = useState<GeneratedGlyph | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const parsePromptToConfig = useCallback((promptText: string): GlyphConfig => {
    const lower = promptText.toLowerCase()

    const style: GlyphConfig['style'] =
      lower.includes('holograph') ? 'holographic' :
      lower.includes('neon') || lower.includes('glow') ? 'neon' :
      lower.includes('glass') ? 'glassmorphic' :
      lower.includes('gradient') || lower.includes('mesh') ? 'gradient' :
      lower.includes('minimal') ? 'minimal' : selectedStyle

    const icon: GlyphConfig['icon'] =
      lower.includes('document') || lower.includes('doc') || lower.includes('file') ? 'document' :
      lower.includes('data') || lower.includes('archive') || lower.includes('vector') ? 'data' :
      lower.includes('code') || lower.includes('syntax') ? 'code' :
      lower.includes('neural') || lower.includes('agent') || lower.includes('ai') ? 'neural' : selectedIcon

    const depth: GlyphConfig['depth'] =
      lower.includes('volumetric') || lower.includes('3d') ? 'volumetric' :
      lower.includes('flat') ? 'flat' : selectedDepth

    // Extract a short label from significant nouns in the prompt
    const nouns = promptText.match(/\b([A-Z][a-z]+|AI|ML|API|RAG|TRL|LoRA)\b/g) || []
    const label = nouns.slice(0, 2).join(' ') || 'GlyphForge'

    return {
      style,
      accent: selectedAccent,
      shape: selectedShape,
      icon,
      depth,
      label,
    }
  }, [selectedStyle, selectedAccent, selectedShape, selectedIcon, selectedDepth])

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return
    setIsGenerating(true)

    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600))

    const cfg = parsePromptToConfig(prompt)
    const svg = generateSVGFromConfig(cfg)
    const glyph: GeneratedGlyph = {
      id: Math.random().toString(36).slice(2),
      config: cfg,
      svg,
      prompt,
      timestamp: Date.now(),
    }

    setGeneratedGlyphs((prev) => [glyph, ...prev].slice(0, 9))
    setActiveGlyph(glyph)
    setIsGenerating(false)
  }, [prompt, isGenerating, parsePromptToConfig])

  const handleDownload = useCallback((glyph: GeneratedGlyph) => {
    const blob = new Blob([glyph.svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `glyphforge-${glyph.id}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleExampleClick = useCallback((example: string) => {
    setPrompt(example)
    inputRef.current?.focus()
  }, [])

  return (
    <section id="glyphforge" className="max-w-7xl mx-auto px-6 py-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-violet-400 mb-4">
          <Cpu size={14} />
          GlyphForge AI Engine · Generative Icon Synthesis
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
          Neural{' '}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Glyph Generation
          </span>
        </h2>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
          GlyphForge is our applied neural synthesis engine for enterprise icon systems. Describe an icon in natural language — our deterministic AI pipeline generates production-ready SVG glyphs instantly, with zero hallucinations and consistent brand coherence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Style selector */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest mb-3">
              Icon Style
            </p>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStyle(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200"
                  style={{
                    background: selectedStyle === s ? `${selectedAccent}22` : 'rgba(255,255,255,0.04)',
                    color: selectedStyle === s ? selectedAccent : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${selectedStyle === s ? selectedAccent + '50' : 'transparent'}`,
                  }}
                  id={`glyph-style-${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Icon type */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest mb-3">
              Icon Type
            </p>
            <div className="flex flex-wrap gap-2">
              {(['folder', 'document', 'data', 'code', 'neural'] as const).map((ic) => (
                <button
                  key={ic}
                  onClick={() => setSelectedIcon(ic)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200"
                  style={{
                    background: selectedIcon === ic ? `${selectedAccent}22` : 'rgba(255,255,255,0.04)',
                    color: selectedIcon === ic ? selectedAccent : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${selectedIcon === ic ? selectedAccent + '50' : 'transparent'}`,
                  }}
                  id={`glyph-icon-${ic}`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest mb-3">
              Accent Color
            </p>
            <div className="flex gap-3 items-center">
              {ACCENT_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedAccent(c)}
                  className="w-7 h-7 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    background: c,
                    boxShadow: selectedAccent === c ? `0 0 12px ${c}80, 0 0 0 2px white` : `0 0 6px ${c}40`,
                    transform: selectedAccent === c ? 'scale(1.2)' : undefined,
                  }}
                  aria-label={`Select accent color ${c}`}
                  id={`glyph-accent-${c.replace('#', '')}`}
                />
              ))}
            </div>
          </div>

          {/* Shape & Depth */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
              <p className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest mb-3">Shape</p>
              <div className="flex flex-col gap-1.5">
                {SHAPE_OPTIONS.map((sh) => (
                  <button
                    key={sh}
                    onClick={() => setSelectedShape(sh)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize text-left transition-all duration-200"
                    style={{
                      background: selectedShape === sh ? `${selectedAccent}22` : 'transparent',
                      color: selectedShape === sh ? selectedAccent : 'rgba(255,255,255,0.45)',
                    }}
                    id={`glyph-shape-${sh}`}
                  >
                    {sh}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
              <p className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest mb-3">Depth</p>
              <div className="flex flex-col gap-1.5">
                {(['flat', 'elevated', 'volumetric'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDepth(d)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize text-left transition-all duration-200"
                    style={{
                      background: selectedDepth === d ? `${selectedAccent}22` : 'transparent',
                      color: selectedDepth === d ? selectedAccent : 'rgba(255,255,255,0.45)',
                    }}
                    id={`glyph-depth-${d}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Example prompts */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest mb-3">
              Example Prompts
            </p>
            <div className="space-y-2">
              {EXAMPLE_PROMPTS.slice(0, 3).map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(ex)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200 flex items-center gap-2 group"
                  id={`glyph-example-${i}`}
                >
                  <ChevronRight size={12} className="text-violet-500 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span className="line-clamp-1">{ex}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Generator + Preview */}
        <div className="lg:col-span-7 space-y-5">
          {/* Input + Generate */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
            <label htmlFor="glyph-prompt" className="block text-xs font-mono font-bold text-white/40 uppercase tracking-widest mb-3">
              Describe Your Icon
            </label>
            <div className="flex gap-3">
              <input
                id="glyph-prompt"
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Glassmorphic neural folder with violet quantum circuit overlay..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 disabled:opacity-40 hover:scale-[1.02] disabled:hover:scale-100 flex-shrink-0"
                style={{
                  background: isGenerating
                    ? 'rgba(139,92,246,0.3)'
                    : 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                  boxShadow: isGenerating ? 'none' : '0 4px 20px rgba(139,92,246,0.35)',
                }}
                id="glyph-generate-btn"
              >
                {isGenerating ? (
                  <><RefreshCw size={14} className="animate-spin" /> Generating…</>
                ) : (
                  <><Wand2 size={14} /> Generate</>
                )}
              </button>
            </div>
          </div>

          {/* Main Preview */}
          <AnimatePresence mode="wait">
            {activeGlyph ? (
              <motion.div
                key={activeGlyph.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 flex flex-col items-center gap-6"
              >
                {/* Large icon preview */}
                <div
                  className="w-48 h-48 flex items-center justify-center rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${selectedAccent}18, transparent 70%)`,
                    border: `1px solid ${selectedAccent}20`,
                  }}
                  dangerouslySetInnerHTML={{ __html: activeGlyph.svg.replace('width="128" height="128"', 'width="160" height="160"') }}
                />

                {/* Meta row */}
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <span className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                    style={{ background: `${selectedAccent}20`, color: selectedAccent }}>
                    {activeGlyph.config.style}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                    style={{ background: `${selectedAccent}15`, color: `${selectedAccent}cc` }}>
                    {activeGlyph.config.icon}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                    style={{ background: `${selectedAccent}10`, color: `${selectedAccent}99` }}>
                    {activeGlyph.config.depth}
                  </span>
                </div>

                {/* Prompt echo */}
                <p className="text-xs text-white/35 italic text-center max-w-xs line-clamp-2">
                  &ldquo;{activeGlyph.prompt}&rdquo;
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(activeGlyph)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07] transition-all"
                    id="glyph-download-btn"
                  >
                    <Download size={13} /> SVG
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeGlyph.svg)
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07] transition-all"
                    id="glyph-copy-btn"
                  >
                    <Code2 size={13} /> Copy SVG
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/[0.02] border border-dashed border-white/[0.08] rounded-2xl p-16 flex flex-col items-center justify-center gap-4 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                  <Sparkles size={28} className="text-violet-400 opacity-60" />
                </div>
                <div>
                  <p className="text-white/50 text-sm font-medium">Your generated glyph will appear here</p>
                  <p className="text-white/25 text-xs mt-1">Configure options and describe your icon above</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History Strip */}
          {generatedGlyphs.length > 1 && (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <p className="text-xs font-mono font-bold text-white/30 uppercase tracking-widest mb-4">Generation History</p>
              <div className="flex gap-3 flex-wrap">
                {generatedGlyphs.slice(1).map((g) => (
                  <motion.button
                    key={g.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setActiveGlyph(g)}
                    className="w-14 h-14 rounded-xl flex items-center justify-center hover:scale-105 transition-all duration-200 border"
                    style={{
                      background: `${g.config.accent}10`,
                      borderColor: activeGlyph?.id === g.id ? g.config.accent : 'rgba(255,255,255,0.07)',
                      boxShadow: activeGlyph?.id === g.id ? `0 0 12px ${g.config.accent}40` : undefined,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: g.svg.replace('width="128" height="128"', 'width="40" height="40"'),
                    }}
                    aria-label={`View glyph: ${g.prompt.slice(0, 30)}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
