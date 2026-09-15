// FullstackBrand — First-party newsletter subscription handler
// Replaces formsubmit.co redirect with a proper POST-only API
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createRateLimiter, clientIpFrom } from '@/lib/rate-limit'

// ── Schema ───────────────────────────────────────────────────────────────────
const NewsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .transform((e) => e.toLowerCase().trim()),
})

// ── Basic in-process rate limiter (resets on cold start; upgrade to KV/Redis for production) ──
const checkRateLimit = createRateLimiter({ limit: 3, windowMs: 60 * 60 * 1000 })

// ── POST only ────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = clientIpFrom(req.headers)

  const rate = checkRateLimit(ip)
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
    )
  }

  // Parse + validate body
  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request body.' },
      { status: 400 }
    )
  }

  const parsed = NewsletterSchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.errors[0]?.message ?? 'Invalid email address.' },
      { status: 400 }
    )
  }

  const { email } = parsed.data
  const timestamp = new Date().toISOString()

  // Log on server (never exposes to client)
  console.log('[Newsletter] Subscription:', { email: email.replace(/(?<=.{3}).(?=.*@)/g, '*'), timestamp })

  // ── 1. Resend SDK (primary) ────────────────────────────────────────────────
  const resendApiKey = process.env.RESEND_API_KEY
  const targetEmail = process.env.TARGET_EMAIL || 'contact@fullstackbrand.co'

  if (resendApiKey) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'FullstackBrand AI Lab <onboarding@resend.dev>',
          to: [targetEmail],
          reply_to: email,
          subject: `[AI Lab] New Research Updates Subscriber`,
          html: `
            <div style="font-family: Arial, sans-serif; background: #111318; color: #fff; padding: 24px; border-radius: 12px; max-width: 600px;">
              <h2 style="color: #8B5CF6; margin-top: 0;">📬 New AI Lab Subscriber</h2>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #8B5CF6;">${email}</a></p>
              <p style="font-size: 12px; color: #666;">Subscribed via FullstackBrand AI Lab on ${timestamp} UTC</p>
            </div>
          `,
        }),
      })

      if (resendRes.ok) {
        return NextResponse.json({ ok: true })
      }

      const errBody = await resendRes.text().catch(() => '')
      console.error('[Newsletter] Resend error:', resendRes.status, errBody.slice(0, 200))
    } catch (err) {
      console.error('[Newsletter] Resend exception:', err)
    }
  }

  // ── 2. Brevo HTTP fallback ─────────────────────────────────────────────────
  const brevoApiKey = process.env.BREVO_API_KEY
  if (brevoApiKey) {
    try {
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'FullstackBrand AI Lab',
            email: process.env.BREVO_SENDER_EMAIL || targetEmail,
          },
          to: [{ email: targetEmail, name: 'FullstackBrand Team' }],
          replyTo: { email },
          subject: '[AI Lab] New Research Updates Subscriber',
          htmlContent: `<p>New subscriber: <a href="mailto:${email}">${email}</a></p><p>Time: ${timestamp}</p>`,
        }),
      })

      if (brevoRes.ok) {
        return NextResponse.json({ ok: true })
      }

      console.error('[Newsletter] Brevo error:', brevoRes.status)
    } catch (err) {
      console.error('[Newsletter] Brevo exception:', err)
    }
  }

  // ── 3. Accept but warn (no provider configured) ────────────────────────────
  // Still return ok:true so UX doesn't break when no email provider is configured locally
  console.warn('[Newsletter] No email provider configured — subscriber not notified:', email)
  return NextResponse.json({ ok: true })
}

// Block all other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
