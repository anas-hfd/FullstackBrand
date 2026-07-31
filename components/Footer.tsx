'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Instagram, Linkedin, ArrowUpRight, Mail, MapPin, Phone, MessageCircle } from 'lucide-react'

const footerLinks = {
  Services: [
    { label: 'Brand Design & Visual Identity', href: '#services' },
    { label: 'Digital Marketing & Brand Strategy', href: '#services' },
    { label: 'Web Development', href: '#services' },
    { label: 'AI Automation', href: '#ai' },
  ],
  Company: [
    { label: 'Our Services', href: '#services' },
    { label: 'How We Work', href: '#process' },
    { label: 'AI Automation', href: '#ai' },
    { label: 'Start a Project', href: '#start' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

// WhatsApp number (digits only for wa.me link)
const WA_NUMBER = '19459972019'

const socials = [
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/fullstackbrand/',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: `https://wa.me/${WA_NUMBER}`,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: '#',
  },
]

export default function Footer() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <footer className="relative mt-8 border-t border-slate-200/50 dark:border-white/10 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-light/5 dark:to-brand-dark/5 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-brand-light/5 dark:bg-brand-dark/5 blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-slate-200/50 dark:border-white/10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="inline-block mb-6">
                {mounted && (
                  <Image
                    src={theme === 'dark' ? '/logos/Full-V-W-desc.png' : '/logos/Full-H-B-desc.png'}
                    alt="FullstackBrand"
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                )}
              </Link>

              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mb-8">
                We engineer intelligent digital ecosystems — from cutting-edge web applications to autonomous AI agents that scale your business. Est. 2026.
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
                    className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-light dark:hover:text-brand-dark transition-colors duration-200 group"
                  >
                    <Icon size={14} className="text-brand-light dark:text-brand-dark flex-shrink-0 mt-0.5" />
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
                      className="group flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-light dark:hover:text-brand-dark transition-colors duration-200"
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
          {/* Copyright + small logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-3"
          >
            {mounted && (
              <Image
                src={theme === 'dark' ? '/logos/Logomark-W.png' : '/logos/logomark-B.png'}
                alt="FullstackBrand"
                width={28}
                height={28}
                className="object-contain opacity-60"
              />
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} FullstackBrand. All rights reserved.
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
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-brand-light dark:hover:text-brand-dark hover:border-brand-light/50 dark:hover:border-brand-dark/50 transition-all duration-200 hover:scale-110"
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

