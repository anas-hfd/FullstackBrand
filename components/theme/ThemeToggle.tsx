'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 ${className}`}
        aria-hidden="true"
      >
        <span className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
      </div>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white shadow-sm hover:scale-105 active:scale-95 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      id="theme-toggle-btn"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <Moon size={16} className="text-violet-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <Sun size={16} className="text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
