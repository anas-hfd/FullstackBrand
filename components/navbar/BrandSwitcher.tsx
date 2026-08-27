'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FlaskConical, Layers } from 'lucide-react'

interface BrandSwitcherProps {
  brand: 'lab' | 'agency'
  onSelect?: () => void
  className?: string
}

export default function BrandSwitcher({ brand, onSelect, className = '' }: BrandSwitcherProps) {
  const isLab = brand === 'lab'

  return (
    <div
      className={`relative inline-flex items-center p-1 rounded-full bg-zinc-200/80 dark:bg-zinc-900/90 border border-zinc-300/80 dark:border-white/10 shadow-inner ${className}`}
      role="group"
      aria-label="Brand Switcher"
    >
      {/* AI Lab Option */}
      <Link
        href="/"
        onClick={onSelect}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-colors duration-200 ${
          isLab
            ? 'text-white'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
        }`}
        id="brand-switch-lab"
      >
        {isLab && (
          <motion.div
            layoutId="brand-pill-active"
            className="absolute inset-0 rounded-full bg-violet-600/90 shadow-[0_0_12px_rgba(139,92,246,0.6)] border border-violet-400/30"
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          />
        )}
        <FlaskConical size={13} className={`relative z-10 ${isLab ? 'text-white' : 'text-violet-500 dark:text-violet-400'}`} />
        <span className="relative z-10 tracking-tight">AI Lab</span>
      </Link>

      {/* Agency Option */}
      <Link
        href="/agency"
        onClick={onSelect}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-colors duration-200 ${
          !isLab
            ? 'text-white'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
        }`}
        id="brand-switch-agency"
      >
        {!isLab && (
          <motion.div
            layoutId="brand-pill-active"
            className="absolute inset-0 rounded-full bg-emerald-600/90 shadow-[0_0_12px_rgba(16,185,129,0.6)] border border-emerald-400/30"
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          />
        )}
        <Layers size={13} className={`relative z-10 ${!isLab ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'}`} />
        <span className="relative z-10 tracking-tight">Agency</span>
      </Link>
    </div>
  )
}
