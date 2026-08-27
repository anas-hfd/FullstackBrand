// FullstackBrand
'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export default function CursorLight() {
  const pathname = usePathname()
  const isAgency = pathname?.startsWith('/agency')

  const blobRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -500, y: -500 })
  const curPosRef = useRef({ x: -500, y: -500 })
  const rafRef = useRef<number>(0)
  const hasMoved = useRef(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
    const checkMobile = () => {
      const mobile =
        window.innerWidth <= 768 ||
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }

      // On first move, also snap the lerp position so dot appears immediately
      if (!hasMoved.current) {
        curPosRef.current = { x: e.clientX, y: e.clientY }
        hasMoved.current = true
        if (dotRef.current) dotRef.current.style.opacity = '1'
        if (blobRef.current) blobRef.current.style.opacity = '1'
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [animate])

  if (!mounted || isMobile) return null

  const blobBg = isAgency
    ? 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.06) 40%, transparent 70%)'
    : 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)'

  const dotBg = isAgency ? '#10B981' : '#8B5CF6'
  const dotShadow = isAgency
    ? '0 0 10px 2px rgba(16,185,129,0.65)'
    : '0 0 12px 3px rgba(139,92,246,0.7)'

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
          background: blobBg,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'screen',
          willChange: 'left, top',
          opacity: 0,
          transition: 'opacity 0.3s ease, background 0.4s ease',
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
          background: dotBg,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: dotShadow,
          willChange: 'left, top',
          opacity: 0,
          transition: 'opacity 0.3s ease, background 0.4s ease, box-shadow 0.4s ease',
        }}
      />
    </>
  )
}
