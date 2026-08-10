'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm FullstackBrand's AI assistant. Ask me anything about our services, pricing, process, or how we can help your business — I'm here to help.",
    },
  ])
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  /* Auto-scroll on new messages */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  /* Focus input when chat opens */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  const handleSend = useCallback(async (prompt?: string) => {
    const text = (prompt ?? input).trim()
    if (!text || isThinking) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setIsThinking(true)

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
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

        // Handle both plain-text streaming (Gemini) and SSE (OpenAI)
        const lines = chunk.split('\n')
        for (const line of lines) {
          let token = ''

          if (line.startsWith('data: ')) {
            // OpenAI SSE format
            const jsonStr = line.slice(6).trim()
            if (!jsonStr || jsonStr === '[DONE]') continue
            try {
              const parsed = JSON.parse(jsonStr)
              token = parsed?.choices?.[0]?.delta?.content ?? ''
            } catch {
              token = jsonStr
            }
          } else {
            // Plain text (Gemini streaming)
            token = line
          }

          if (!token) continue

          aiContent += token

          if (firstChunk) {
            // Add assistant message on first token
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

      // Ensure we always stop thinking even if no content came through
      if (firstChunk) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: "I'm having a moment — something went wrong on my end. Please try again, or reach out directly at contact@fullstackbrand.co and we'll be happy to help!" },
        ])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "I'm having a moment — something went wrong on my end. Please try again, or reach out directly at contact@fullstackbrand.co and we'll be happy to help!" },
      ])
    } finally {
      setIsThinking(false)
    }
  }, [messages, input, isThinking])

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-light dark:bg-brand-dark flex items-center justify-center shadow-lg shadow-brand-light/40 dark:shadow-brand-dark/30 transition-shadow"
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
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-[400px] h-[520px] glass rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-brand-light/20 dark:border-brand-dark/20"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-brand-light/15 dark:bg-brand-dark/20 flex items-center justify-center">
                <Sparkles size={14} className="text-brand-light dark:text-brand-dark" />
              </div>
              <div>
                <div className="font-bold text-sm leading-tight">Fullstack AI Assistant</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-slate-400">Online · Powered by Gemini</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-light dark:bg-brand-dark text-white rounded-br-sm'
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
                  >
                    <div className="glass rounded-2xl rounded-bl-sm">
                      <ThinkingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Input bar */}
            <div className="p-3 flex gap-2 border-t border-slate-200/50 dark:border-white/10 flex-shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about our services…"
                disabled={isThinking}
                aria-label="Type your message"
                className="flex-1 px-3 py-2 rounded-xl bg-transparent border border-slate-200 dark:border-white/10 focus:border-brand-light dark:focus:border-brand-dark outline-none text-sm placeholder:text-slate-400 disabled:opacity-50 transition-colors"
              />
              <motion.button
                onClick={() => handleSend()}
                disabled={isThinking || !input.trim()}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Send message"
                className="p-2.5 rounded-xl bg-brand-light dark:bg-brand-dark disabled:opacity-40 transition-opacity flex-shrink-0"
              >
                <Send size={15} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
