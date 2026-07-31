// FullstackBrand
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Loader2 } from 'lucide-react'

const serviceOptions = [
  { id: 'Branding', name: 'Branding', price: 5000 },
  { id: 'Web Development', name: 'Web Development', price: 12000 },
  { id: 'AI Agent', name: 'AI Agent', price: 8000 },
  { id: 'AI Automation', name: 'AI Automation', price: 6000 },
  { id: 'Digital Marketing', name: 'Digital Marketing', price: 4000 },
]

export default function ProjectConfigurator() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const toggleService = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const total = selected.reduce((acc, id) => acc + (serviceOptions.find(s => s.id === id)?.price || 0), 0)

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate API Call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 2000)
  }

  return (
    <section id="configurator" className="max-w-5xl mx-auto px-6 py-24">
      <h2 className="text-4xl font-black mb-2 text-center">Project Cost Estimator</h2>
      <p className="text-slate-500 text-center mb-12">Build your custom agency package.</p>

      <div className="glass p-8 rounded-3xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{opacity: 0, x: 50}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -50}}>
              <h3 className="text-2xl font-bold mb-6">Select Your Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceOptions.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => toggleService(opt.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${selected.includes(opt.id) ? 'border-brand-light dark:border-brand-dark bg-brand-light/10' : 'border-slate-200 dark:border-white/10'}`}
                  >
                    <span className="font-medium">{opt.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">${opt.price.toLocaleString()}</span>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${selected.includes(opt.id) ? 'bg-brand-light dark:bg-brand-dark' : 'bg-slate-200 dark:bg-white/10'}`}>
                        {selected.includes(opt.id) && <Check size={14} className="text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between items-center">
                <div>
                  <span className="text-sm text-slate-500">Estimated Budget</span>
                  <div className="text-3xl font-black text-brand-light dark:text-brand-dark">${total.toLocaleString()}</div>
                </div>
                <button onClick={() => setStep(2)} disabled={selected.length === 0} className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-light dark:bg-brand-dark text-white font-bold disabled:opacity-50">
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{opacity: 0, x: 50}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -50}}>
              {!success ? (
                <>
                  <h3 className="text-2xl font-bold mb-6">Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Full Name" className="p-3 rounded-xl bg-transparent border border-slate-200 dark:border-white/10 focus:border-brand-light outline-none" />
                    <input placeholder="Email Address" className="p-3 rounded-xl bg-transparent border border-slate-200 dark:border-white/10 focus:border-brand-light outline-none" />
                    <input placeholder="Company Name" className="md:col-span-2 p-3 rounded-xl bg-transparent border border-slate-200 dark:border-white/10 focus:border-brand-light outline-none" />
                  </div>
                  <div className="mt-8 flex justify-between items-center">
                    <button onClick={() => setStep(1)} className="text-slate-500 hover:text-white">Back</button>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-light dark:bg-brand-dark text-white font-bold">
                      {loading ? <Loader2 className="animate-spin" size={18} /> : 'Submit Project Brief'}
                    </button>
                  </div>
                </>
              ) : (
                <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="text-center py-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-brand-light/20 dark:bg-brand-dark/20 flex items-center justify-center mb-4">
                    <Check className="text-brand-light dark:text-brand-dark" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold">Project Brief Received!</h3>
                  <p className="text-slate-500 mt-2">Your Project ID is <span className="text-brand-light dark:text-brand-dark font-mono">FSB-{Math.random().toString(36).substr(2, 5).toUpperCase()}</span></p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}