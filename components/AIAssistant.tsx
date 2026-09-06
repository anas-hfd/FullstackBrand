'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { MessageSquare, X, Send, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

/* Animated thinking dots shown while streaming is pending */
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-brand-light dark:bg-brand-dark"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio') || pathname?.startsWith('/agency')
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm FullstackBrand's AI assistant. Ask me anything about our AI research, technology solutions, pricing, or custom machine learning systems — I'm here to help.",
    },
  ])
  const [isThinking, setIsThinking] = useState(false)
  const [hasError, setHasError] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  /* Auto-scroll on new messages */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  /* Focus input when chat opens; return focus to launcher when closed */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    } else {
      launcherRef.current?.focus()
    }
  }, [isOpen])

  /* Escape key closes the dialog */
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  /* Focus trap: keep Tab/Shift+Tab inside the dialog */
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [isOpen])

  const handleSend = useCallback(async (prompt?: string) => {
    const text = (prompt ?? input).trim()
    if (!text || isThinking) return

    // Cancel any pending request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setIsThinking(true)
    setHasError(false)

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let aiContent = ''
      let firstChunk = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        const lines = chunk.split('\n')
        for (const line of lines) {
          let token = ''

          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim()
            if (!jsonStr || jsonStr === '[DONE]') continue
            try {
              const parsed = JSON.parse(jsonStr)
              token = parsed?.choices?.[0]?.delta?.content ?? ''
            } catch {
              token = jsonStr
            }
          } else {
            token = line
          }

          if (!token) continue

          aiContent += token

          if (firstChunk) {
            firstChunk = false
            setIsThinking(false)
            setMessages(prev => [...prev, { role: 'assistant', content: aiContent }])
          } else {
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: aiContent }
              return updated
            })
          }
        }
      }

      if (firstChunk) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: "I'm having a moment — something went wrong on my end. Please try again, or reach out directly at contact@fullstackbrand.co and we'll be happy to help!" },
        ])
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      console.error('Chat error:', error)
      setHasError(true)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "I'm having a moment — something went wrong on my end. Please try again, or reach out directly at contact@fullstackbrand.co and we'll be happy to help!" },
      ])
    } finally {
      setIsThinking(false)
    }
  }, [messages, input, isThinking])

  const handleRetry = useCallback(() => {
    setHasError(false)
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    if (lastUser) {
      setMessages(prev => prev.slice(0, -1)) // remove error message
      handleSend(lastUser.content)
    }
  }, [messages, handleSend])

  const accentBorder = isStudio ? 'border-emerald-500/30' : 'border-violet-500/30'
  const accentBg = isStudio ? 'bg-emerald-600' : 'bg-violet-600'
  const accentFocus = isStudio ? 'focus:border-emerald-500' : 'focus:border-violet-500'
  const accentIconBg = isStudio ? 'bg-emerald-500/15 text-emerald-500' : 'bg-violet-500/15 text-violet-500 dark:text-violet-400'
  const launcherColors = isStudio
    ? 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:shadow-[0_0_28px_rgba(16,185,129,0.65)]'
    : 'bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.45)] hover:shadow-[0_0_28px_rgba(139,92,246,0.65)]'

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        ref={launcherRef}
        onClick={() => setIsOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${launcherColors}`}
        id="ai-assistant-launcher"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.18 }}
          >
            {isOpen ? <X className="text-white" size={20} /> : <MessageSquare className="text-white" size={20} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="FullstackBrand AI Assistant"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed z-50 glass rounded-2xl flex flex-col shadow-2xl border ${accentBorder}`}
            style={{
              bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))',
              right: '1.5rem',
              width: 'min(92vw, 400px)',
              maxHeight: '85vh',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] flex-shrink-0 rounded-t-2xl">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${accentIconBg}`}>
                <Sparkles size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm leading-tight">Fullstack AI Assistant</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-slate-400">Online · Powered by Gemini</span>
                </div>
              </div>
              {/* Explicit accessible close button in header */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages — scrollable interior */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0"
              aria-live="polite"
              aria-label="Conversation messages"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                      msg.role === 'user'
                        ? `${accentBg} text-white rounded-br-sm`
                        : 'glass rounded-bl-sm text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Thinking animation */}
              <AnimatePresence>
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18 }}
                    className="flex justify-start"
                    aria-label="Assistant is thinking"
                  >
                    <div className="glass rounded-2xl rounded-bl-sm">
                      <ThinkingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error retry state */}
              <AnimatePresence>
                {hasError && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center"
                  >
                    <button
                      onClick={handleRetry}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline transition-colors"
                    >
                      Retry last message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input bar */}
            <div className="p-3 flex gap-2 border-t border-slate-200/50 dark:border-white/10 flex-shrink-0">
              <label htmlFor="ai-chat-input" className="sr-only">Type your message</label>
              <input
                id="ai-chat-input"
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about our services or AI research…"
                disabled={isThinking}
                aria-label="Type your message"
                maxLength={500}
                className={`flex-1 min-w-0 px-3 py-2 rounded-xl bg-transparent border border-slate-200 dark:border-white/10 outline-none text-sm placeholder:text-slate-400 disabled:opacity-50 transition-colors ${accentFocus}`}
              />
              <motion.button
                onClick={() => handleSend()}
                disabled={isThinking || !input.trim()}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Send message"
                className={`p-2.5 rounded-xl disabled:opacity-40 transition-opacity flex-shrink-0 text-white min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center ${accentBg}`}
              >
                <Send size={15} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
