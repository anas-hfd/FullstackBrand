// FullstackBrand
'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

export default function CursorLight() {
  const blobRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -500, y: -500 })
  const curPosRef = useRef({ x: -500, y: -500 })
  const rafRef = useRef<number>(0)
  const hasMoved = useRef(false)
  const [mounted, setMounted] = useState(false)
  const nudgedRef = useRef<Map<HTMLElement, number>>(new Map())

  const lerp = (start: number, end: number, t: number) => start + (end - start) * t

  const animate = useCallback(() => {
    const blob = blobRef.current
    const dot = dotRef.current
    if (!blob || !dot) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    // Smooth lerp for blob
    curPosRef.current.x = lerp(curPosRef.current.x, posRef.current.x, 0.08)
    curPosRef.current.y = lerp(curPosRef.current.y, posRef.current.y, 0.08)

    blob.style.left = `${curPosRef.current.x}px`
    blob.style.top = `${curPosRef.current.y}px`

    // Dot snaps instantly to cursor
    dot.style.left = `${posRef.current.x}px`
    dot.style.top = `${posRef.current.y}px`

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }

      // On first move, also snap the lerp position so dot appears immediately
      if (!hasMoved.current) {
        curPosRef.current = { x: e.clientX, y: e.clientY }
        hasMoved.current = true
        const dot = dotRef.current
        if (dot) {
          dot.style.opacity = '1'
        }
        const blob = blobRef.current
        if (blob) {
          blob.style.opacity = '1'
        }
      }

      // Button nudge logic — reduced movement speed
      const buttons = Array.from(
        document.querySelectorAll<HTMLElement>('button, a[href], [data-interactive]')
      )

      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const threshold = Math.max(rect.width / 2 + 20, 60)

        if (dist < threshold) {
          // Reduced nudge distance (5px instead of 8px) for slower feel
          const nudgeX = (cx - e.clientX) > 0 ? -5 : 5
          btn.style.transition = 'transform 0.25s cubic-bezier(0.16,1,0.3,1)'
          btn.style.transform = `translateX(${nudgeX}px)`
          nudgedRef.current.set(btn, nudgeX)
        } else {
          if (nudgedRef.current.has(btn)) {
            btn.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)'
            btn.style.transform = 'translateX(0px)'
            nudgedRef.current.delete(btn)
          }
        }
      })
    }

    const handleMouseLeave = () => {
      nudgedRef.current.forEach((_, btn) => {
        btn.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)'
        btn.style.transform = 'translateX(0px)'
      })
      nudgedRef.current.clear()
    }

    rafRef.current = requestAnimationFrame(animate)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      nudgedRef.current.forEach((_, btn) => {
        btn.style.transform = ''
        btn.style.transition = ''
      })
    }
  }, [animate])

  if (!mounted) return null

  return (
    <>
      {/* Glowing orb — follows with lag */}
      <div
        ref={blobRef}
        aria-hidden="true"
        className="cursor-blob"
        style={{
          position: 'fixed',
          left: -500,
          top: -500,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,80,0.10) 0%, rgba(16,185,129,0.05) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'screen',
          willChange: 'left, top',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Precise dot — snaps to cursor */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="cursor-dot"
        style={{
          position: 'fixed',
          left: -500,
          top: -500,
          width: 7,
          height: 7,
          borderRadius: '50%',
          /* Light mode: rich green; dark mode handled via CSS class with a softer tint */
          background: '#00CC55',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 8px 2px rgba(0,204,85,0.55)',
          willChange: 'left, top',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </>
  )
}
