'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send } from 'lucide-react'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Welcome to FullstackBrand. How can I help scale your business today?' }
  ])
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    "What does an AI agent cost?",
    "How do you handle branding?",
    "Book a strategy call"
  ]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (prompt?: string) => {
    const text = prompt || input
    if (!text || isStreaming) return

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        
        // Handle OpenAI SSE stream ("data: {chunk}") or plain text mock stream
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim() !== '')
        
        for (const line of lines) {
          const jsonString = line.startsWith('data: ') ? line.replace('data: ', '') : line
          if (jsonString === '[DONE]') continue
          
          try {
            const parsed = JSON.parse(jsonString)
            const token = parsed.choices?.[0]?.delta?.content || ''
            if (token) {
              aiResponse += token
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1].content = aiResponse
                return updated
              })
            }
          } catch {
            // Fallback for plain text mock stream
            aiResponse += jsonString
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1].content = aiResponse
              return updated
            })
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-light dark:bg-brand-dark flex items-center justify-center shadow-lg shadow-brand-light/40 hover:scale-110 transition-transform"
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md h-[500px] glass rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-brand-light/20"
          >
            <div className="p-4 border-b border-slate-200/50 dark:border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-bold">Fullstack AI Assistant</span>
            </div>

            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-brand-light dark:bg-brand-dark text-white' : 'glass'}`}>
                    {msg.content || '...'}
                  </div>
                </div>
              ))}
              {isStreaming && messages[messages.length-1].content === '' && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl glass flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 flex flex-wrap gap-2 border-t border-slate-200/50 dark:border-white/10">
              {quickPrompts.map(p => (
                <button key={p} onClick={() => handleSend(p)} className="text-xs px-3 py-1 rounded-full glass hover:bg-slate-100 dark:hover:bg-white/10">
                  {p}
                </button>
              ))}
            </div>

            <div className="p-3 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about our services..."
                className="flex-1 p-2 rounded-xl bg-transparent border border-slate-200 dark:border-white/10 focus:border-brand-light outline-none text-sm"
              />
              <button onClick={() => handleSend()} className="p-2 rounded-xl bg-brand-light dark:bg-brand-dark">
                <Send size={16} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
