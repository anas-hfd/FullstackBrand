'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Instagram, ArrowUpRight, Mail, MapPin, Phone, MessageCircle, Linkedin } from 'lucide-react'

// WhatsApp number (digits only for wa.me link)
const WA_NUMBER = '19459972019'

/* Custom icon components for platforms not in lucide-react */
function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function ThreadsIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.471 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-.505-1.808-1.403-3.232-2.671-4.234-1.32-1.03-3.084-1.582-5.24-1.6-2.766.016-4.906.72-6.352 2.09-1.389 1.318-2.096 3.338-2.118 5.995.022 2.659.729 4.679 2.118 6.001 1.449 1.373 3.59 2.073 6.355 2.087 2.406-.003 4.105-.616 5.226-1.874.98-1.103 1.524-2.76 1.535-4.769-.005-.21-.012-.42-.023-.63-.126.038-.25.07-.375.095-1.74.353-3.457.305-4.98-.144-.936-.277-1.75-.744-2.361-1.358-.61-.614-.974-1.367-1.044-2.166-.07-.8.143-1.64.615-2.393C12.795 4.4 14.09 3.8 15.7 3.679c.963-.072 1.934.081 2.803.44.76.318 1.414.8 1.886 1.39l-1.524 1.235c-.283-.35-.667-.638-1.121-.834-.558-.233-1.177-.323-1.8-.276-.93.07-1.706.442-2.2 1.07-.297.37-.444.819-.412 1.25.032.432.264.848.665 1.203.4.355.956.62 1.604.784 1.197.304 2.613.316 3.898-.02.173-.045.344-.099.514-.16.143-.052.284-.111.424-.176.078-.036.156-.075.234-.115l.001-.001a10.47 10.47 0 0 0 .233-.129c.204-.117.404-.245.596-.383l.003-.002c.065-.047.13-.095.195-.145.204-.155.403-.323.59-.501.044-.042.087-.085.13-.129l.044-.046.046-.051c.195-.215.377-.448.537-.693.08-.123.155-.252.223-.385.094-.182.176-.37.243-.565.09-.262.154-.539.189-.826.034-.287.039-.57.013-.847-.062-.648-.294-1.27-.661-1.801a4.83 4.83 0 0 0-.252-.316c-.21-.237-.45-.451-.714-.636-.57-.396-1.26-.655-2.05-.773a7.12 7.12 0 0 0-1.044-.055c-.338.004-.679.033-1.018.086A8.093 8.093 0 0 0 12.19 5.5" />
    </svg>
  )
}

const socials = [
  {
    IconComponent: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/fullstackbrand/',
  },
  {
    IconComponent: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/fullstackbrand_agency?fbclid=IwY2xjawTmmQpwZG9mBWV4dG4DYWVtAjEwAGJyaWQRMW5DMVZDUjJOcGJ5ZGE0eTlzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEeIXwj96kRJ6oLMpsDHTCG_NlsPWaBGHqCjXF1S-kQ5wD7dVVI7wwwhoICWjQ_aem_HcjC39ISUbCh0OlUwbnzSA',
  },
  {
    IconComponent: MessageCircle,
    label: 'WhatsApp',
    href: `https://wa.me/${WA_NUMBER}`,
  },
  {
    IconComponent: FacebookIcon,
    label: 'Facebook',
    href: 'https://web.facebook.com/FullstackBrand?rdid=f79B74CRK9H3iHoj&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1DNuYZvKbD%2F%3F_rdc%3D1%26_rdr#',
  },
  {
    IconComponent: ThreadsIcon,
    label: 'Threads',
    href: 'https://www.threads.com/@fullstackbrand_agency?xmt=AQG0ArfPmQmfznz-vVWHYfU0qRec81Tc1PgXbuWGTxoZXkI',
  },
]

export default function Footer() {
  const { theme } = useTheme()
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio') || pathname?.startsWith('/agency')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const footerLinks = {
    [isStudio ? 'Studio Services' : 'Services']: [
      { label: 'Brand Design & Identity', href: '/studio#services' },
      { label: 'Marketing & Strategy', href: '/studio#services' },
      { label: 'Web & SaaS Platforms', href: '/studio#services' },
      { label: 'AI Agent Systems', href: '/studio#ai' },
    ],
    Ecosystem: [
      { label: 'AI Research Lab (Root)', href: '/' },
      { label: 'FullstackBrand Studio', href: '/studio' },
      { label: 'How We Work', href: '/studio#process' },
      { label: 'Start a Project', href: '/studio#contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  }

  return (
    <footer className="relative mt-8 border-t border-zinc-400/40 dark:border-white/10 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-zinc-400/40 dark:border-white/10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href={isStudio ? '/studio' : '/'} className="inline-block mb-6">
                {mounted ? (
                  <Image
                    src={theme === 'dark' ? '/logos/Asset 27-8.png' : '/logos/Asset 26-8.png'}
                    alt="FullstackBrand"
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-[200px] h-[80px]" />
                )}
              </Link>

              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mb-8">
                We engineer intelligent digital ecosystems — from cutting-edge web applications to autonomous AI agents that scale your business.
              </p>

              {/* Contact info */}
              <div className="space-y-3">
                {[
                  {
                    icon: Mail,
                    text: 'contact@fullstackbrand.co',
                    href: 'mailto:contact@fullstackbrand.co',
                  },
                  {
                    icon: Phone,
                    text: '+1 945-997-2019',
                    href: `https://wa.me/${WA_NUMBER}`,
                  },
                  {
                    icon: MapPin,
                    text: '1309 Coffeen Avenue STE 1200\nSheridan, Wyoming 82801',
                    href: 'https://maps.google.com/?q=1309+Coffeen+Avenue+STE+1200+Sheridan+Wyoming+82801',
                  },
                ].map(({ icon: Icon, text, href }) => (
                  <a
                    key={text}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-200 group ${
                      isStudio
                        ? 'hover:text-emerald-600 dark:hover:text-emerald-400'
                        : 'hover:text-violet-600 dark:hover:text-violet-400'
                    }`}
                  >
                    <Icon
                      size={14}
                      className={`flex-shrink-0 mt-0.5 transition-colors ${
                        isStudio
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-violet-600 dark:text-violet-400'
                      }`}
                    />
                    <span className="whitespace-pre-line leading-snug">{text}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links], colIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (colIdx + 1) }}
            >
              <h3 className="font-bold text-sm uppercase tracking-wider mb-5 text-slate-900 dark:text-white">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`group flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-200 ${
                        isStudio
                          ? 'hover:text-emerald-600 dark:hover:text-emerald-400'
                          : 'hover:text-violet-600 dark:hover:text-violet-400'
                      }`}
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 -translate-y-0.5 translate-x-0 group-hover:translate-x-0.5 group-hover:-translate-y-1 transition-all duration-200"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright + logomark */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-3"
          >
            {mounted ? (
              <Image
                src={theme === 'dark' ? '/logos/Logomark-White.png' : '/logos/Logomark-Black.png'}
                alt="FullstackBrand Reserved Rights"
                width={28}
                height={28}
                className="object-contain opacity-80"
              />
            ) : (
              <div className="w-7 h-7" />
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500">
              © 2026 Fullstack Brand LLC. All rights reserved.
            </span>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-3"
          >
            {socials.map(({ IconComponent: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full glass flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all duration-200 hover:scale-110 ${
                  isStudio
                    ? 'hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50'
                    : 'hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500/50'
                }`}
              >
                <Icon size={15} />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
