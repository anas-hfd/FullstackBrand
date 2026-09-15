import { afterEach, describe, expect, it, vi } from 'vitest'
import { clientIpFrom, createRateLimiter } from '@/lib/rate-limit'

afterEach(() => {
  vi.useRealTimers()
})

describe('createRateLimiter', () => {
  it('allows requests up to the limit, then blocks', () => {
    const check = createRateLimiter({ limit: 3, windowMs: 60_000 })

    expect(check('1.2.3.4').allowed).toBe(true)
    expect(check('1.2.3.4').allowed).toBe(true)
    expect(check('1.2.3.4').allowed).toBe(true)

    const blocked = check('1.2.3.4')
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(60)
  })

  it('tracks each key independently', () => {
    const check = createRateLimiter({ limit: 1, windowMs: 60_000 })

    expect(check('a').allowed).toBe(true)
    expect(check('a').allowed).toBe(false)
    // A different key is unaffected by the first key's exhausted bucket.
    expect(check('b').allowed).toBe(true)
  })

  it('resets the bucket once the window has elapsed', () => {
    vi.useFakeTimers()
    const check = createRateLimiter({ limit: 1, windowMs: 1_000 })

    expect(check('k').allowed).toBe(true)
    expect(check('k').allowed).toBe(false)

    vi.advanceTimersByTime(1_001)

    expect(check('k').allowed).toBe(true)
  })

  it('reports a positive Retry-After even at window boundaries', () => {
    vi.useFakeTimers()
    const check = createRateLimiter({ limit: 1, windowMs: 500 })

    check('k')
    const blocked = check('k')
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThanOrEqual(1)
  })
})

describe('clientIpFrom', () => {
  it('prefers cf-connecting-ip', () => {
    const headers = new Headers({
      'cf-connecting-ip': '203.0.113.7',
      'x-forwarded-for': '198.51.100.1, 198.51.100.2',
    })
    expect(clientIpFrom(headers)).toBe('203.0.113.7')
  })

  it('falls back to the first x-forwarded-for entry', () => {
    const headers = new Headers({ 'x-forwarded-for': '198.51.100.1, 198.51.100.2' })
    expect(clientIpFrom(headers)).toBe('198.51.100.1')
  })

  it('falls back to x-real-ip', () => {
    const headers = new Headers({ 'x-real-ip': '192.0.2.9' })
    expect(clientIpFrom(headers)).toBe('192.0.2.9')
  })

  it('returns "unknown" when no forwarding header is present', () => {
    expect(clientIpFrom(new Headers())).toBe('unknown')
  })
})
