'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Rocket, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'Process', href: '/#process' },
  { label: 'AI Automation', href: '/#ai' },
  { label: 'Contact', href: '/#start' },
]

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`max-w-7xl mx-auto flex items-center justify-between p-3 px-6 rounded-2xl transition-all duration-500 ${
          scrolled
            ? 'glass shadow-xl shadow-black/10 dark:shadow-black/30'
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          {mounted && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Image
                src={theme === 'dark' ? '/logos/Horizontal-WhiteTXT.png' : '/logos/Horizontal-BlackTXT.png'}
                alt="FullstackBrand"
                width={180}
                height={40}
                className="object-contain"
                priority
              />
            </motion.div>
          )}
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-slate-600 dark:text-slate-300 hover:text-brand-light dark:hover:text-brand-dark transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-brand-light dark:bg-brand-dark scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle color theme"
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200 hover:scale-110"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mounted && (
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* CTA button */}
          <motion.a
            href="#start"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex items-center gap-2 bg-brand-light dark:bg-brand-dark text-white px-4 py-2 rounded-full text-sm font-bold shadow-md shadow-brand-light/25 dark:shadow-brand-dark/20"
          >
            <Rocket size={14} />
            Start a Project
          </motion.a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 mx-0 glass rounded-2xl p-4 shadow-xl"
          >
            {navLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 px-2 text-sm font-medium border-b border-slate-200/30 dark:border-white/10 last:border-0 hover:text-brand-light dark:hover:text-brand-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <motion.a
              href="#start"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 bg-brand-light dark:bg-brand-dark text-white px-4 py-2.5 rounded-full text-sm font-bold w-full"
            >
              <Rocket size={14} />
              Start a Project
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
