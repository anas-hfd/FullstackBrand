/**
 * Best-effort, per-isolate in-memory rate limiting.
 *
 * IMPORTANT: counters live in the module scope of a single runtime isolate. On
 * Cloudflare Workers (OpenNext) every isolate keeps its own counters and they
 * reset on cold start, so this is best-effort abuse mitigation against casual
 * spam — NOT a distributed guarantee. A production-hardened deployment would
 * move the same three-function interface to a shared store (Workers KV,
 * Durable Object, or Redis) without changing any caller.
 */

export type RateLimitVerdict = {
  /** Whether the request may proceed. */
  allowed: boolean
  /** Seconds to wait before retrying. Only meaningful when `allowed` is false. */
  retryAfterSeconds: number
}

export type RateLimiter = (key: string) => RateLimitVerdict

export type RateLimiterOptions = {
  /** Maximum number of requests allowed inside the window. */
  limit: number
  /** Window length in milliseconds. */
  windowMs: number
}

/** Expired buckets are swept on this interval so long-lived isolates cannot leak memory. */
const SWEEP_INTERVAL_MS = 5 * 60 * 1000

/** Hard cap on tracked keys, so a spoofed-IP flood cannot grow the map without bound. */
const MAX_TRACKED_KEYS = 10_000

export function createRateLimiter({ limit, windowMs }: RateLimiterOptions): RateLimiter {
  const buckets = new Map<string, { count: number; resetAt: number }>()
  let lastSweep = Date.now()

  function sweep(now: number) {
    for (const [key, bucket] of buckets) {
      if (now >= bucket.resetAt) buckets.delete(key)
    }
    lastSweep = now
  }

  return function check(key: string): RateLimitVerdict {
    const now = Date.now()

    if (now - lastSweep >= SWEEP_INTERVAL_MS) {
      sweep(now)
    }

    // Still saturated after sweeping: fail closed instead of growing unbounded.
    if (buckets.size >= MAX_TRACKED_KEYS && !buckets.has(key)) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(windowMs / 1000)) }
    }

    const bucket = buckets.get(key)

    if (!bucket || now >= bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs })
      return { allowed: true, retryAfterSeconds: 0 }
    }

    if (bucket.count >= limit) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      }
    }

    bucket.count += 1
    return { allowed: true, retryAfterSeconds: 0 }
  }
}

/**
 * Resolve the real client IP behind Cloudflare / common reverse proxies.
 * Returns 'unknown' when no forwarding header is present, so a shared limit
 * still applies instead of silently disabling throttling entirely.
 */
export function clientIpFrom(headers: Headers): string {
  const candidates = [
    headers.get('cf-connecting-ip'),
    headers.get('x-forwarded-for')?.split(',')[0],
    headers.get('x-real-ip'),
  ]

  for (const candidate of candidates) {
    const value = candidate?.trim()
    if (value) return value
  }

  return 'unknown'
}
