'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import {
  FlaskConical,
  Layers,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Cpu,
  Bot,
  Bell,
} from 'lucide-react'
import BrandSwitcher from './BrandSwitcher'
import ThemeToggle from '@/components/theme/ThemeToggle'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const LAB_NAV_ITEMS: NavItem[] = [
  { label: 'Research', href: '#research', icon: FlaskConical },
  { label: 'SaaS Development', href: '#saas-development', icon: Sparkles },
  { label: 'Architecture', href: '#architecture', icon: GitBranch },
  { label: 'Sovereignty', href: '#sovereignty', icon: ShieldCheck },
]

const AGENCY_NAV_ITEMS: NavItem[] = [
  { label: 'Services', href: '/agency#services', icon: Layers },
  { label: 'AI Showcase', href: '/agency#ai-showcase', icon: Bot },
  { label: 'Process', href: '/agency#process', icon: Cpu },
  { label: 'Contact', href: '/agency#contact', icon: ChevronRight },
]

export default function DualBrandNav() {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAgency = pathname?.startsWith('/agency')
  const brand = isAgency ? 'agency' : 'lab'
  const isLab = !isAgency
  const navItems = isLab ? LAB_NAV_ITEMS : AGENCY_NAV_ITEMS
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)

    const faviconHref = isLab ? '/logos/Asset 25-8.png' : '/logos/Logomark.png'
    const iconLinks: NodeListOf<HTMLLinkElement> = document.querySelectorAll("link[rel*='icon']")
    if (iconLinks.length > 0) {
      iconLinks.forEach((link) => {
        link.href = faviconHref
      })
    } else {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/png'
      link.href = faviconHref
      document.head.appendChild(link)
    }
  }, [pathname, isLab])

  const logoSrc = isLab
    ? isDark
      ? '/logos/Asset 28-8.png'
      : '/logos/Asset 24-8.png'
    : isDark
    ? '/logos/Horizontal-WhiteTXT.png'
    : '/logos/Horizontal-BlackTXT.png'

  const actionHref = isLab ? '#updates' : isAgency ? '#contact' : '/agency#contact'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <nav
            aria-label="Main Navigation"
            className={`pointer-events-auto w-full flex items-center justify-between gap-2 sm:gap-4 xl:gap-6 px-3.5 sm:px-6 py-2 rounded-2xl sm:rounded-full transition-all duration-300 backdrop-blur-xl border shadow-xl flex-nowrap ${
              scrolled
                ? 'bg-white/35 dark:bg-[#0c0d11]/45 border-zinc-300/40 dark:border-white/10 shadow-zinc-950/15'
                : 'bg-white/20 dark:bg-[#0c0d11]/25 border-zinc-200/40 dark:border-white/10 shadow-zinc-950/5'
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link
                href={isLab ? '/' : '/agency'}
                className="flex items-center gap-2 group py-1"
                id="main-nav-logo"
                aria-label="FullstackBrand Home"
              >
                {mounted ? (
                  <div className="relative h-8 sm:h-9 w-36 sm:w-44 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={logoSrc}
                      alt="FullstackBrand Logo"
                      fill
                      priority
                      className="object-contain object-left"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-36 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-lg animate-pulse" />
                )}
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-shrink-0">
              {navItems.map((item) => {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
                    id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="hidden sm:block">
                <BrandSwitcher brand={brand} />
              </div>

              <a
                href={actionHref}
                className={`hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-md ${
                  isLab
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-violet-500/25 hover:shadow-lg'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-emerald-500/25 hover:shadow-lg'
                }`}
                id="nav-action-button"
              >
                {isLab ? (
                  <>
                    <Bell size={13} />
                    <span>Get Updates</span>
                  </>
                ) : (
                  <>
                    <span>Start Project</span>
                    <ChevronRight size={13} />
                  </>
                )}
              </a>

              <ThemeToggle />

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white bg-white/50 dark:bg-white/10 border border-zinc-200 dark:border-white/10 transition-colors"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
                id="mobile-nav-toggle"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-[320px] bg-white/95 dark:bg-[#0c0d11]/95 backdrop-blur-2xl border-l border-zinc-200 dark:border-white/10 p-6 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto"
              role="dialog"
              aria-label="Mobile Navigation"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10">
                  <div className="relative h-7 w-32">
                    {mounted && (
                      <Image
                        src={logoSrc}
                        alt="FullstackBrand Logo"
                        fill
                        className="object-contain object-left"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-white/10"
                    aria-label="Close menu"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Active Brand Context
                  </span>
                  <BrandSwitcher brand={brand} onSelect={() => setMobileOpen(false)} className="w-full justify-center" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
                    Navigation
                  </span>
                  {navItems.map((item) => {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
              <div className="pt-6 border-t border-zinc-200 dark:border-white/10 space-y-3">
                <a
                  href={actionHref}
                  onClick={() => setMobileOpen(false)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
                    isLab
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-violet-500/25'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-emerald-500/25'
                  }`}
                >
                  {isLab ? <><Bell size={14} /> Get Updates</> : <><ChevronRight size={14} /> Start Project</>}
                </a>
                <div className="flex items-center justify-between px-2 pt-1 text-xs text-zinc-500">
                  <span>Theme Mode</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
