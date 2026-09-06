// FullstackBrand
'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export default function CursorLight() {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio') || pathname?.startsWith('/agency')

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

    if (hasMoved.current && blob && dot) {
      // Responsive lerp for smooth trailing glow (0.18 = fast, fluid, zero sluggishness)
      curPosRef.current.x = lerp(curPosRef.current.x, posRef.current.x, 0.18)
      curPosRef.current.y = lerp(curPosRef.current.y, posRef.current.y, 0.18)

      // GPU hardware transform — zero layout thrashing or reflows
      blob.style.transform = `translate3d(${curPosRef.current.x}px, ${curPosRef.current.y}px, 0) translate(-50%, -50%)`
      dot.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`
    }

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
    window.addEventListener('resize', checkMobile, { passive: true })

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX
      posRef.current.y = e.clientY

      if (!hasMoved.current) {
        curPosRef.current.x = e.clientX
        curPosRef.current.y = e.clientY
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

  const blobBg = isStudio
    ? 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.06) 45%, transparent 70%)'
    : 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)'

  const dotBg = isStudio ? '#10B981' : '#8B5CF6'
  const dotShadow = isStudio
    ? '0 0 10px 2px rgba(16,185,129,0.65)'
    : '0 0 12px 3px rgba(139,92,246,0.7)'

  return (
    <>
      {/* Glowing orb — hardware-composited */}
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
          willChange: 'transform',
          opacity: 0,
          transition: 'opacity 0.2s ease, background 0.3s ease',
        }}
      />
      {/* Precise dot — instantaneous 120fps tracking */}
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
          willChange: 'transform',
          opacity: 0,
          transition: 'opacity 0.2s ease, background 0.3s ease, box-shadow 0.3s ease',
        }}
      />
    </>
  )
}
