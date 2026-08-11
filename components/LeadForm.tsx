// FullstackBrand
'use client'
import { useState } from 'react'
import { Loader2, CheckCircle, Mail, User, Building2, Clock, DollarSign, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const budgetRanges = [
  '$1,000 – $5,000',
  '$5,000 – $10,000',
  '$10,000 – $15,000',
  '$15,000+',
]

const timelines = ['1–3 Months', '3–6 Months', '6–12 Months', 'Ongoing Retainer']

const serviceOptions = [
  { id: 'brand-design', label: 'Brand Design & Visual Identity', icon: '🎨' },
  { id: 'digital-marketing', label: 'Digital Marketing & Brand Strategy', icon: '📣' },
  { id: 'web-dev', label: 'Web Development', icon: '🌐' },
  { id: 'ai-automation', label: 'AI Automation', icon: '🤖' },
  { id: 'full-ecosystem', label: 'Full Ecosystem', icon: '⚡', highlight: true },
]

function sanitize(str: string, maxLen = 200) {
  return str.trim().slice(0, maxLen)
}

export default function LeadForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    budget: '$1,000 – $5,000',
    timeline: '1–3 Months',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  const toggleService = (id: string) => {
    if (id === 'full-ecosystem') {
      setSelectedServices(prev =>
        prev.includes('full-ecosystem') ? [] : ['full-ecosystem']
      )
      return
    }
    setSelectedServices(prev => {
      const without = prev.filter(s => s !== 'full-ecosystem')
      return without.includes(id) ? without.filter(s => s !== id) : [...without, id]
    })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Full name is required.'
    if (!form.email.trim()) newErrors.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email address.'
    if (selectedServices.length === 0) newErrors.services = 'Please select at least one service.'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      // Map service IDs back to readable service labels
      const readableServices = selectedServices.map(
        id => serviceOptions.find(opt => opt.id === id)?.label || id
      )

      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sanitize(form.name),
          email: sanitize(form.email, 100),
          company: sanitize(form.company),
          services: readableServices.join(', '),
          budget: form.budget,
          timeline: form.timeline,
          message: sanitize(form.message, 1000),
        }),
      })
      if (res.ok) setSuccess(true)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  const setField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <section id="start" className="max-w-4xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-brand-light dark:text-brand-dark font-semibold mb-3 block">
          Let&apos;s build together
        </span>
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Start Your Project</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Tell us about your vision — we&apos;ll respond within 24 hours with a tailored proposal.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass p-12 rounded-3xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-full bg-brand-light/10 dark:bg-brand-dark/15 flex items-center justify-center mb-6"
            >
              <CheckCircle className="w-10 h-10 text-brand-light dark:text-brand-dark" />
            </motion.div>
            <h3 className="text-3xl font-bold mb-2">Thank you, {form.name}!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-1">
              We&apos;ve received your inquiry and will reach out to{' '}
              <span className="text-brand-light dark:text-brand-dark font-semibold">{form.email}</span> within 24 hours.
            </p>
            <p className="text-xs text-slate-400 mt-4 font-mono">
              REF: FSB-{Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
            className="glass p-8 md:p-10 rounded-3xl space-y-7"
          >
            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    placeholder="Full Name *"
                    value={form.name}
                    autoComplete="name"
                    maxLength={100}
                    onChange={e => setField('name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border ${errors.name ? 'border-red-400' : 'border-slate-200 dark:border-white/10'} focus:border-brand-light dark:focus:border-brand-dark outline-none transition-colors text-sm`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
              </div>
              <div>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="email"
                    placeholder="Email Address *"
                    value={form.email}
                    autoComplete="email"
                    maxLength={100}
                    onChange={e => setField('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border ${errors.email ? 'border-red-400' : 'border-slate-200 dark:border-white/10'} focus:border-brand-light dark:focus:border-brand-dark outline-none transition-colors text-sm`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>
            </div>

            {/* Row 2: Company */}
            <div className="relative">
              <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Company Name"
                value={form.company}
                autoComplete="organization"
                maxLength={100}
                onChange={e => setField('company', e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-slate-200 dark:border-white/10 focus:border-brand-light dark:focus:border-brand-dark outline-none transition-colors text-sm"
              />
            </div>

            {/* Row 3: Services (multi-select chips) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Services Needed *
              </label>
              <div className="flex flex-wrap gap-2.5">
                {serviceOptions.map(({ id, label, icon, highlight }) => {
                  const active = selectedServices.includes(id)
                  return (
                    <motion.button
                      key={id}
                      type="button"
                      onClick={() => toggleService(id)}
                      whileHover={{ x: active ? 0 : 4 }}
                      whileTap={{ x: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={`
                        relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                        ${active
                          ? highlight
                            ? 'bg-brand-light dark:bg-brand-dark text-white shadow-lg shadow-brand-light/30 dark:shadow-brand-dark/20'
                            : 'bg-brand-light/15 dark:bg-brand-dark/20 text-brand-light dark:text-brand-dark border border-brand-light/50 dark:border-brand-dark/50'
                          : 'glass border-slate-200 dark:border-white/10 hover:border-brand-light/30 dark:hover:border-brand-dark/30 text-slate-600 dark:text-slate-300'
                        }
                        ${highlight ? 'ring-1 ring-brand-light/30 dark:ring-brand-dark/20' : ''}
                      `}
                    >
                      <span>{icon}</span>
                      {label}
                      {active && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center"
                        >
                          <Check size={10} className="text-current" />
                        </motion.span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
              {errors.services && <p className="text-red-400 text-xs mt-2">{errors.services}</p>}
            </div>

            {/* Row 4: Budget + Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Budget Range
                </label>
                <div className="relative">
                  <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                  <select
                    value={form.budget}
                    onChange={e => setField('budget', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-offwhite dark:bg-brand-obsidian border border-slate-200 dark:border-white/10 focus:border-brand-light dark:focus:border-brand-dark outline-none transition-colors text-sm appearance-none"
                  >
                    {budgetRanges.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Timeline
                </label>
                <div className="relative">
                  <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                  <select
                    value={form.timeline}
                    onChange={e => setField('timeline', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-offwhite dark:bg-brand-obsidian border border-slate-200 dark:border-white/10 focus:border-brand-light dark:focus:border-brand-dark outline-none transition-colors text-sm appearance-none"
                  >
                    {timelines.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 5: Message */}
            <div>
              <textarea
                placeholder="Tell us more about your project (optional)"
                value={form.message}
                maxLength={1000}
                rows={3}
                onChange={e => setField('message', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-slate-200 dark:border-white/10 focus:border-brand-light dark:focus:border-brand-dark outline-none transition-colors text-sm resize-none"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { x: 6 } : {}}
              whileTap={!loading ? { x: 0 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-light dark:bg-brand-dark text-white font-bold text-base disabled:opacity-60 shadow-lg shadow-brand-light/30 dark:shadow-brand-dark/20 transition-opacity"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending...
                </>
              ) : (
                'Submit Inquiry →'
              )}
            </motion.button>

            <p className="text-center text-xs text-slate-400">
              No spam, ever. We respect your privacy. Response guaranteed within 24 hours.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  )
}