'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface BrandSwitcherProps {
  brand: 'lab' | 'studio' | 'agency'
  onSelect?: () => void
  className?: string
}

export default function BrandSwitcher({ brand, onSelect, className = '' }: BrandSwitcherProps) {
  const router = useRouter()
  const isLab = brand === 'lab'

  // Pre-warm routes for fast seamless navigation
  useEffect(() => {
    router.prefetch('/')
    router.prefetch('/studio')
  }, [router])

  return (
    <div
      className={`relative inline-flex items-center p-1 rounded-full bg-zinc-300/80 dark:bg-[#1a1a1a]/90 border border-zinc-400/80 dark:border-white/10 shadow-inner ${className}`}
      role="group"
      aria-label="Brand Switcher"
    >
      {/* AI Lab Option */}
      <Link
        href="/"
        prefetch={true}
        onClick={onSelect}
        className={`relative z-10 flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full transition-colors duration-200 ${
          isLab
            ? 'text-white'
            : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
        }`}
        id="brand-switch-lab"
      >
        {isLab && (
          <motion.div
            layoutId="brand-pill-active"
            className="absolute inset-0 rounded-full bg-violet-600 shadow-[0_0_14px_rgba(139,92,246,0.65)] border border-violet-400/30"
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          />
        )}
        <span
          className={`relative z-10 w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors duration-200 ${
            isLab
              ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
              : 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.7)]'
          }`}
          aria-hidden="true"
        />
        <span className="relative z-10 tracking-tight">AI Lab</span>
      </Link>

      {/* Studio Option */}
      <Link
        href="/studio"
        prefetch={true}
        onClick={onSelect}
        className={`relative z-10 flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full transition-colors duration-200 ${
          !isLab
            ? 'text-white'
            : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
        }`}
        id="brand-switch-studio"
      >
        {!isLab && (
          <motion.div
            layoutId="brand-pill-active"
            className="absolute inset-0 rounded-full bg-emerald-600 shadow-[0_0_14px_rgba(16,185,129,0.65)] border border-emerald-400/30"
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          />
        )}
        <span
          className={`relative z-10 w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors duration-200 ${
            !isLab
              ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
              : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
          }`}
          aria-hidden="true"
        />
        <span className="relative z-10 tracking-tight">Studio</span>
      </Link>
    </div>
  )
}
