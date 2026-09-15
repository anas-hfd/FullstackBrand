'use client'

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { MessageSquare, X, Send, Sparkles, Copy, Check, RotateCcw, Square, Trash2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

/* Conversation survives in-session navigation; each page keeps its own thread */
const MAX_STORED_MESSAGES = 40

type PageKind = 'lab' | 'studio' | 'privacy' | 'terms' | 'other'

/*
 * Each page opens with its own short greeting. Depth is deliberately withheld
 * here — specifics are delivered once the visitor actually asks for them.
 */
const GREETINGS: Record<PageKind, string> = {
  lab: "Hi, I'm the FullstackBrand assistant. You're in the AI Lab — ask me about our research and I'll go as deep as you want.",
  studio: "Hi, I'm the FullstackBrand assistant. You're on the Studio side — tell me what you're building and I'll help you scope it.",
  privacy: "Hi, I'm the FullstackBrand assistant. Ask me anything about how we handle privacy and data.",
  terms: "Hi, I'm the FullstackBrand assistant. Ask me anything about our terms, IP and commercial engagements.",
  other: "Hi, I'm the FullstackBrand assistant. Ask me about the AI Lab's research or the Studio's services.",
}

const greetingFor = (kind: PageKind): Message => ({ role: 'assistant', content: GREETINGS[kind] })
const storageKeyFor = (kind: PageKind) => `fsb-ai-chat-v1:${kind}`

/* Animated thinking dots shown while the first token is still pending */
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3" aria-hidden="true">
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

/*
 * Minimal, dependency-free inline formatter for assistant replies.
 * Only **bold**, `code` and http(s) markdown links are recognised, and they are
 * rendered as React nodes — never via innerHTML — so model output can never
 * inject markup into the page.
 */
const INLINE_RE = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\))/g

function inlineNodes(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  let match: RegExpExecArray | null
  INLINE_RE.lastIndex = 0

  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index))
    const token = match[0]
    const key = `${keyBase}-${i++}`

    if (token.startsWith('**')) {
      out.push(
        <strong key={key} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      )
    } else if (token.startsWith('`')) {
      out.push(
        <code
          key={key}
          className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[0.85em]"
        >
          {token.slice(1, -1)}
        </code>
      )
    } else {
      const linkMatch = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(token)
      if (linkMatch) {
        out.push(
          <a
            key={key}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80"
          >
            {linkMatch[1]}
          </a>
        )
      } else {
        out.push(token)
      }
    }

    last = match.index + token.length
  }

  if (last < text.length) out.push(text.slice(last))
  return out
}

/** Renders a short list when the reply uses "- " lines, paragraphs otherwise. */
function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  let bullets: string[] = []

  const flushBullets = (key: string) => {
    if (bullets.length === 0) return
    blocks.push(
      <ul key={key} className="list-disc pl-4 space-y-1">
        {bullets.map((b, i) => (
          <li key={`${key}-${i}`}>{inlineNodes(b, `${key}-${i}`)}</li>
        ))}
      </ul>
    )
    bullets = []
  }

  text.split('\n').forEach((line, idx) => {
    const trimmed = line.trim()
    if (/^[-*•]\s+/.test(trimmed)) {
      bullets.push(trimmed.replace(/^[-*•]\s+/, ''))
      return
    }
    flushBullets(`ul-${idx}`)
    if (trimmed) blocks.push(<p key={`p-${idx}`}>{inlineNodes(trimmed, `p-${idx}`)}</p>)
  })
  flushBullets('ul-final')

  return <div className="space-y-2">{blocks}</div>
}

export default function AIAssistant() {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio') || pathname?.startsWith('/agency')

  /* Drives the per-page greeting, thread storage key and backend page context */
  const pageContext: PageKind =
    pathname === '/'
      ? 'lab'
      : isStudio
        ? 'studio'
        : pathname?.startsWith('/privacy')
          ? 'privacy'
          : pathname?.startsWith('/terms')
            ? 'terms'
            : 'other'
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(() => [greetingFor(pageContext)])
  const [isThinking, setIsThinking] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Restore this page's conversation once, after mount (panel is closed on first paint) */
  useEffect(() => {
    let restored: Message[] | null = null
    try {
      const raw = sessionStorage.getItem(storageKeyFor(pageContext))
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(
            (m): m is Message =>
              !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
          )
          if (clean.length > 0) restored = clean
        }
      }
    } catch {
      // Storage unavailable (private mode / disabled) - start fresh.
    }
    setMessages(restored ?? [greetingFor(pageContext)])
    setHydrated(true)
  }, [pageContext])

  /* Persist this page's conversation for the rest of the browser session */
  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(
        storageKeyFor(pageContext),
        JSON.stringify(messages.slice(-MAX_STORED_MESSAGES))
      )
    } catch {
      // Storage unavailable - persistence is a convenience, not a requirement.
    }
  }, [messages, hydrated, pageContext])

  /* Auto-scroll, but never hijack the reader's scroll position */
  useEffect(() => {
    if (!autoScroll || !scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isThinking, autoScroll])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setAutoScroll(el.scrollHeight - el.scrollTop - el.clientHeight < 80)
  }, [])

  /* Focus input when chat opens; return focus to the launcher on close */
  useEffect(() => {
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current)
    if (isOpen) {
      focusTimerRef.current = setTimeout(() => inputRef.current?.focus(), 150)
    } else {
      launcherRef.current?.focus()
    }
    return () => {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current)
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
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [isOpen])

  /* Clear pending copy feedback timer on unmount */
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      abortRef.current?.abort()
    }
  }, [])

  /* Tell the backend which page the visitor is on so replies stay relevant */
  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsThinking(false)
    setIsStreaming(false)
  }, [])

  const handleSend = useCallback(
    async (prompt?: string, baseMessages?: Message[]) => {
      const text = (prompt ?? input).trim()
      if (!text || isThinking) return

      // Cancel any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const history = baseMessages ?? messages
      const newMessages: Message[] = [...history, { role: 'user', content: text }]
      setMessages(newMessages)
      setInput('')
      setIsThinking(true)
      setIsStreaming(false)
      setHasError(false)
      setAutoScroll(true)

      try {
        const res = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages, page: pageContext }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let aiContent = ''
        let firstChunk = true
        let buffer = ''

        const pushToken = () => {
          if (firstChunk) {
            firstChunk = false
            setIsThinking(false)
            setIsStreaming(true)
            setMessages(prev => [...prev, { role: 'assistant', content: aiContent }])
          } else {
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: aiContent }
              return updated
            })
          }
        }

        const parseSseLine = (line: string): string => {
          const jsonStr = line.slice(6).trim()
          if (!jsonStr || jsonStr === '[DONE]') return ''
          try {
            const parsed = JSON.parse(jsonStr)
            return parsed?.choices?.[0]?.delta?.content ?? ''
          } catch {
            return jsonStr
          }
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? '' // keep the trailing partial line buffered

          for (const line of lines) {
            const token = line.startsWith('data: ') ? parseSseLine(line) : line + '\n'
            if (!token) continue
            aiContent += token
            pushToken()
          }
        }

        // Flush whatever is left in the buffer (final line without a trailing newline)
        if (buffer) {
          const token = buffer.startsWith('data: ') ? parseSseLine(buffer) : buffer
          if (token) {
            aiContent += token
            pushToken()
          }
        }

        // Trim trailing whitespace left by line-break preservation
        if (!firstChunk) {
          const finalContent = aiContent.replace(/\s+$/, '')
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'assistant', content: finalContent }
            return updated
          })
        }

        if (firstChunk) {
          setHasError(true)
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content:
                "I'm having a moment — something went wrong on my end. Try again, or reach the team directly at contact@fullstackbrand.co.",
            },
          ])
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        console.error('Chat error:', error)
        setHasError(true)
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content:
              "I couldn't reach my backend just now — that's on my side, not yours. Retry, or email the team directly at contact@fullstackbrand.co.",
          },
        ])
      } finally {
        setIsThinking(false)
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [messages, input, isThinking, pageContext]
  )

  const handleRetry = useCallback(() => {
    setHasError(false)

    // Drop the failed answer(s) and the question, then re-ask it cleanly.
    const trimmed = [...messages]
    while (trimmed.length > 0 && trimmed[trimmed.length - 1].role === 'assistant') trimmed.pop()
    const lastUser = trimmed[trimmed.length - 1]
    if (!lastUser || lastUser.role !== 'user') return

    trimmed.pop()
    setMessages(trimmed)
    handleSend(lastUser.content, trimmed)
  }, [messages, handleSend])

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopiedIndex(null), 1500)
    } catch {
      // Clipboard blocked (insecure context / permissions) - stay silent.
    }
  }, [])

  const handleClear = useCallback(() => {
    stopStreaming()
    setMessages([greetingFor(pageContext)])
    setHasError(false)
    setInput('')
    try {
      sessionStorage.removeItem(storageKeyFor(pageContext))
    } catch {
      // Nothing to clean up if storage is unavailable.
    }
    inputRef.current?.focus()
  }, [stopStreaming, pageContext])

  const accentBorder = isStudio ? 'border-brand-light/30' : 'border-violet-500/30'
  const accentBg = isStudio ? 'bg-brand-light dark:bg-brand-dark' : 'bg-violet-600'
  const accentFocus = isStudio ? 'focus:border-brand-light dark:focus:border-brand-dark' : 'focus:border-violet-500'
  const accentIconBg = isStudio
    ? 'bg-brand-light/15 text-brand-light dark:text-brand-dark'
    : 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
  const launcherColors = isStudio
    ? 'bg-brand-light dark:bg-brand-dark shadow-[0_0_20px_rgba(0,204,96,0.45)] hover:shadow-[0_0_28px_rgba(0,204,96,0.65)]'
    : 'bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.45)] hover:shadow-[0_0_28px_rgba(139,92,246,0.65)]'

  const lastUserIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === 'user') return i
    }
    return -1
  })()

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

      {/* Chat panel — surface is intentionally 30% darker than the site canvas */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="FullstackBrand AI Assistant"
            aria-busy={isThinking}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed z-50 chat-surface rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl border bottom-0 left-0 right-0 w-full max-h-[85vh] sm:bottom-24 sm:left-auto sm:right-6 sm:w-[400px] sm:max-w-[calc(100vw-3rem)] sm:max-h-[600px] ${accentBorder}`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.08] dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05] flex-shrink-0 rounded-t-2xl">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${accentIconBg}`}>
                <Sparkles size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm leading-tight text-slate-900 dark:text-white">
                  Fullstack AI Assistant
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {isStreaming || isThinking ? 'Responding…' : 'Online · Powered by Gemini'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClear}
                aria-label="Start a new conversation"
                title="Start a new conversation"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-black/[0.04] dark:bg-white/10 hover:bg-black/[0.08] dark:hover:bg-white/20 transition-colors flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-black/[0.04] dark:bg-white/10 hover:bg-black/[0.08] dark:hover:bg-white/20 transition-colors flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages - scrollable interior */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0"
              aria-live="polite"
              aria-label="Conversation messages"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={`${msg.role}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%]">
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                        msg.role === 'user'
                          ? `${accentBg} text-white rounded-br-sm whitespace-pre-wrap`
                          : 'bg-black/[0.04] dark:bg-white/[0.07] text-slate-900 dark:text-slate-100 rounded-bl-sm border border-black/5 dark:border-white/10'
                      }`}
                    >
                      {msg.role === 'assistant' ? <RichText text={msg.content} /> : msg.content}
                      {/* Streaming caret */}
                      {msg.role === 'assistant' && isStreaming && i === messages.length - 1 && (
                        <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-current opacity-60 animate-pulse" />
                      )}
                    </div>

                    {/* Per-answer actions */}
                    {msg.role === 'assistant' && i > 0 && (
                      <div className="mt-1 flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(msg.content, i)}
                          aria-label="Copy answer"
                          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:bg-black/[0.06] dark:hover:bg-white/10 transition-colors"
                        >
                          {copiedIndex === i ? <Check size={11} /> : <Copy size={11} />}
                          {copiedIndex === i ? 'Copied' : 'Copy'}
                        </button>
                        {i === messages.length - 1 && (
                          <button
                            onClick={handleRetry}
                            disabled={lastUserIndex === -1}
                            aria-label="Regenerate answer"
                            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:bg-black/[0.06] dark:hover:bg-white/10 disabled:opacity-40 transition-colors"
                          >
                            <RotateCcw size={11} />
                            Retry
                          </button>
                        )}
                      </div>
                    )}
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
                    <div className="bg-black/[0.04] dark:bg-white/[0.07] rounded-2xl rounded-bl-sm border border-black/5 dark:border-white/10">
                      <ThinkingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input bar */}
            <div className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3 flex gap-2 border-t border-black/10 dark:border-white/10 flex-shrink-0">
              <label htmlFor="ai-chat-input" className="sr-only">
                Type your message
              </label>
              <textarea
                id="ai-chat-input"
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask about our services or AI research."
                disabled={isThinking}
                aria-label="Type your message"
                maxLength={500}
                rows={1}
                className={`flex-1 min-w-0 px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 disabled:opacity-50 transition-colors resize-none ${accentFocus}`}
              />
              {isThinking || isStreaming ? (
                <motion.button
                  onClick={stopStreaming}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Stop generating"
                  title="Stop generating"
                  className="p-2.5 rounded-xl text-white flex-shrink-0 min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center bg-slate-700 dark:bg-slate-600"
                >
                  <Square size={14} />
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Send message"
                  className={`p-2.5 rounded-xl disabled:opacity-40 transition-opacity flex-shrink-0 text-white min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center ${accentBg}`}
                >
                  <Send size={15} />
                </motion.button>
              )}
            </div>

            {/* Error / retry affordance */}
            <AnimatePresence>
              {hasError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-3 flex-shrink-0"
                >
                  <button
                    onClick={handleRetry}
                    className="w-full text-xs py-2 rounded-lg bg-black/[0.06] dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-black/[0.1] dark:hover:bg-white/15 transition-colors font-semibold"
                  >
                    Retry the last question
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
