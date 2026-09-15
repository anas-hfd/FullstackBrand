// FullstackBrand — custom cursor: an instant dot plus a trailing glow.
'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/** Trailing factor for the glow, tuned per 60Hz frame. */
const GLOW_SMOOTHING = 0.18
/** The frame length GLOW_SMOOTHING was tuned against. */
const BASE_FRAME_MS = 1000 / 60
/** Clamp dt so returning from a background tab never teleports the glow. */
const MAX_FRAME_MS = 50
/** Below this movement (px) the glow is treated as settled and stops being written. */
const SETTLE_EPSILON = 0.05

export default function CursorLight() {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio') || pathname?.startsWith('/agency')

  const blobRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  // Pointer target, smoothed glow position, and visibility live in refs so the
  // animation loop never depends on a particular render having happened.
  const targetRef = useRef({ x: 0, y: 0 })
  const glowRef = useRef({ x: 0, y: 0 })
  const visibleRef = useRef(false)

  const [enabled, setEnabled] = useState(false)

  /*
   * Gate on the SAME condition the CSS uses to hide the system cursor, rather
   * than a viewport-width heuristic. The old `innerWidth <= 768` test disabled
   * the cursor for any narrow desktop window and, worse, flipped mid-session.
   */
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const apply = () => setEnabled(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const html = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const show = () => {
      if (visibleRef.current) return
      visibleRef.current = true
      // Snap the glow on reveal so it never streaks in from a stale position.
      glowRef.current.x = targetRef.current.x
      glowRef.current.y = targetRef.current.y
    }
    const hide = () => {
      visibleRef.current = false
    }

    const onPointerMove = (e: PointerEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
      show()
    }

    // Leaving the document (relatedTarget === null) hides the cursor; moving
    // back in re-shows it on the next move.
    const onPointerOut = (e: PointerEvent) => {
      if (e.relatedTarget) return
      hide()
    }

    let lastFrame = performance.now()
    let rafId = 0

    const loop = (now: number) => {
      const dt = Math.min(now - lastFrame, MAX_FRAME_MS)
      lastFrame = now

      const blob = blobRef.current
      const dot = dotRef.current

      if (blob && dot) {
        /*
         * Reconcile opacity from the ref every frame. This is the fix for the
         * "cursor vanishes until reload" bug: the old code set opacity only once,
         * on the first mousemove, so any re-render that recreated these nodes
         * left them permanently transparent.
         */
        const opacity = visibleRef.current ? '1' : '0'
        if (blob.style.opacity !== opacity) blob.style.opacity = opacity
        if (dot.style.opacity !== opacity) dot.style.opacity = opacity

        if (visibleRef.current) {
          // Own the system cursor only while we are genuinely drawing one.
          if (html.dataset.cursor !== 'custom') html.dataset.cursor = 'custom'

          // Frame-rate independent smoothing: identical trailing feel at 60, 120 or 144Hz.
          const t = reducedMotion ? 1 : 1 - Math.pow(1 - GLOW_SMOOTHING, dt / BASE_FRAME_MS)
          const dx = targetRef.current.x - glowRef.current.x
          const dy = targetRef.current.y - glowRef.current.y

          if (Math.abs(dx) > SETTLE_EPSILON || Math.abs(dy) > SETTLE_EPSILON) {
            glowRef.current.x += dx * t
            glowRef.current.y += dy * t
            blob.style.transform = `translate3d(${glowRef.current.x}px, ${glowRef.current.y}px, 0) translate(-50%, -50%)`
          }

          dot.style.transform = `translate3d(${targetRef.current.x}px, ${targetRef.current.y}px, 0) translate(-50%, -50%)`
        } else if (html.dataset.cursor) {
          delete html.dataset.cursor
        }
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })
    window.addEventListener('blur', hide)

    // Stop burning a frame loop while the tab is in the background.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId)
        rafId = 0
        hide()
      } else if (!rafId) {
        lastFrame = performance.now()
        rafId = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerMove)
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('blur', hide)
      document.removeEventListener('visibilitychange', onVisibility)
      delete html.dataset.cursor
    }
  }, [enabled])

  if (!enabled) return null

  const blobBg = isStudio
    ? 'radial-gradient(circle, rgba(0,204,96,0.18) 0%, rgba(0,204,96,0.06) 45%, transparent 70%)'
    : 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)'

  const dotBg = isStudio ? '#00CC60' : '#8B5CF6'
  const dotShadow = isStudio
    ? '0 0 10px 2px rgba(0,204,96,0.65)'
    : '0 0 12px 3px rgba(139,92,246,0.7)'

  return (
    <>
      {/* Trailing glow — hardware-composited */}
      <div
        ref={blobRef}
        aria-hidden="true"
        className="cursor-blob"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: blobBg,
          transform: 'translate3d(-500px, -500px, 0) translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform, opacity',
          opacity: 0,
          transition: 'opacity 0.2s ease, background 0.3s ease',
        }}
      />
      {/* Precise dot — tracks the pointer 1:1 */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: dotBg,
          transform: 'translate3d(-500px, -500px, 0) translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: dotShadow,
          willChange: 'transform, opacity',
          opacity: 0,
          transition: 'opacity 0.2s ease, background 0.3s ease, box-shadow 0.3s ease',
        }}
      />
    </>
  )
}
