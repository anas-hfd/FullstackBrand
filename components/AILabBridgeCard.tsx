'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, FlaskConical } from 'lucide-react'

export default function AILabBridgeCard() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass-lab p-8 md:p-12 rounded-3xl border border-violet-500/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold font-mono">
            <FlaskConical size={14} /> FullstackBrand AI Research Lab
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
            Looking for Frontier AI Research &amp; Generative Systems?
          </h3>
          <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed">
            Explore our deep-tech applied research branch — engineering deterministic multi-agent architectures, GlyphForge icon synthesis, and sovereign non-egress AI pipelines.
          </p>
        </div>

        <motion.div
          whileHover={{ x: 6 }}
          whileTap={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Link
            href="/"
            prefetch={true}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-violet-600/30 group transition-colors duration-200"
            id="lab-bridge-cta"
          >
            <Sparkles size={16} />
            <span>Visit AI Research Lab</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
