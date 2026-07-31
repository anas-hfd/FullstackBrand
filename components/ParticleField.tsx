// FullstackBrand
'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseVx: number
  baseVy: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let particles: Particle[] = []

    const REPEL_RADIUS = 140
    const REPEL_STRENGTH = 5
    const CONNECT_DIST = 130

    const initParticles = () => {
      particles = []
      const count = Math.floor((width * height) / 10000)
      for (let i = 0; i < count; i++) {
        const vx = (Math.random() - 0.5) * 0.4
        const vy = (Math.random() - 0.5) * 0.4
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          size: Math.random() * 1.8 + 0.5,
        })
      }
    }

    const connect = () => {
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            // Check if either particle is close to mouse — brighten those lines
            const aDist = Math.hypot(particles[a].x - mx, particles[a].y - my)
            const bDist = Math.hypot(particles[b].x - mx, particles[b].y - my)
            const proximity = Math.min(aDist, bDist)
            const boost = proximity < REPEL_RADIUS ? 2.5 : 1
            const alpha = (1 - dist / CONNECT_DIST) * 0.3 * boost
            ctx.strokeStyle = `rgba(0, 255, 102, ${Math.min(alpha, 1)})`
            ctx.lineWidth = proximity < REPEL_RADIUS ? 1.2 : 0.5
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particles.forEach(p => {
        // Mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS
          p.vx += (dx / dist) * force * REPEL_STRENGTH * 0.06
          p.vy += (dy / dist) * force * REPEL_STRENGTH * 0.06
        }

        // Dampen back to base velocity
        p.vx += (p.baseVx - p.vx) * 0.04
        p.vy += (p.baseVy - p.vy) * 0.04

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 4) {
          p.vx = (p.vx / speed) * 4
          p.vy = (p.vy / speed) * 4
        }

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Glow based on mouse proximity
        const nearMouse = dist < REPEL_RADIUS
        const particleAlpha = nearMouse ? 1 : 0.7
        const glowRadius = nearMouse ? p.size * 2.5 : p.size

        if (nearMouse) {
          // Larger glow halo
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius * 4)
          grd.addColorStop(0, `rgba(0,255,102,0.6)`)
          grd.addColorStop(1, `rgba(0,255,102,0)`)
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(p.x, p.y, glowRadius * 4, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = `rgba(0, 255, 102, ${particleAlpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      connect()
      rafRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Position relative to canvas
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    initParticles()
    rafRef.current = requestAnimationFrame(animate)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initParticles()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60" />
}