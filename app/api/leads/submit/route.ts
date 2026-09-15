// FullstackBrand
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createRateLimiter, clientIpFrom } from '@/lib/rate-limit'

const LeadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  company: z.string().max(200).optional().default('N/A'),
  services: z.string().max(500),
  budget: z.string().max(50).optional().default('N/A'),
  timeline: z.string().max(50).optional().default('N/A'),
  message: z.string().max(2000).optional().default('N/A'),
})

// Escape HTML to prevent XSS in email body
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const TARGET_EMAIL = process.env.TARGET_EMAIL || 'contact@fullstackbrand.co'

// Rate limiter: max 5 submissions per 10 minutes per IP
const checkRateLimit = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 })

// Block non-POST methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function POST(req: NextRequest) {
  // IP rate limiting
  const ip = clientIpFrom(req.headers)

  const rate = checkRateLimit(ip)
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many project inquiries from this address. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
    )
  }

  try {
    const body = await req.json()
    const parsed = LeadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Invalid submission format' },
        { status: 400 }
      )
    }
    const validated = parsed.data

    const projectId = `FSB-${Date.now().toString(36).toUpperCase()}`
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC' })

    console.log('[Lead Submitted]', { projectId, ...validated })

    let emailSent = false
    let providerUsed = 'none'

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; background: #111318; color: #fff; padding: 24px; border-radius: 12px; max-width: 600px;">
        <h2 style="color: #00CC60; margin-top: 0;">⚡ New Project Inquiry</h2>
        <p style="color: #888;">Ref: ${projectId}</p>
        <hr style="border: 0; border-top: 1px solid #333;" />
        <p><strong>Client Name:</strong> ${esc(validated.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${esc(validated.email)}" style="color: #00CC60;">${esc(validated.email)}</a></p>
        <p><strong>Company:</strong> ${esc(validated.company)}</p>
        <p><strong>Services:</strong> <span style="color: #00CC60;">${esc(validated.services)}</span></p>
        <p><strong>Budget Range:</strong> ${esc(validated.budget)}</p>
        <p><strong>Timeline:</strong> ${esc(validated.timeline)}</p>
        <p><strong>Message / Notes:</strong> ${esc(validated.message)}</p>
        <hr style="border: 0; border-top: 1px solid #333;" />
        <p style="font-size: 12px; color: #666;">Submitted via FullstackBrand website on ${timestamp} UTC</p>
      </div>
    `

    const brevoApiKey = process.env.BREVO_API_KEY
    const resendApiKey = process.env.RESEND_API_KEY

    // 1. Send via Brevo HTTP API (300 free emails/day — Native fetch for Cloudflare Edge Workers & Pages)
    if (brevoApiKey) {
      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            sender: {
              name: 'FullstackBrand Leads',
              email: process.env.BREVO_SENDER_EMAIL || TARGET_EMAIL,
            },
            to: [{ email: TARGET_EMAIL, name: 'FullstackBrand Team' }],
            replyTo: { email: validated.email, name: validated.name },
            subject: `⚡ [New Inquiry] ${validated.name} - ${validated.services} (${projectId})`,
            htmlContent: htmlBody,
          }),
        })

        if (brevoRes.ok) {
          emailSent = true
          providerUsed = 'brevo'
          console.log('[Email Sent via Brevo HTTP API to', TARGET_EMAIL, ']')
        } else {
          console.error('[Brevo API Error]', await brevoRes.text())
        }
      } catch (brevoErr) {
        console.error('[Brevo HTTP Exception]', brevoErr)
      }
    }

    // 2. Send via Resend HTTP REST API if Brevo is not configured or fails
    if (!emailSent && resendApiKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'Website Contact Form <onboarding@resend.dev>',
            to: [TARGET_EMAIL],
            reply_to: validated.email,
            subject: `⚡ [New Inquiry] ${validated.name} - ${validated.services} (${projectId})`,
            html: htmlBody,
          }),
        })

        if (resendRes.ok) {
          emailSent = true
          providerUsed = 'resend'
          console.log('[Email Sent via Resend HTTP API to', TARGET_EMAIL, ']')
        } else {
          console.error('[Resend API Error]', await resendRes.text())
        }
      } catch (resendErr) {
        console.error('[Resend HTTP Exception]', resendErr)
      }
    }

    // No third-party redirect endpoints: delivery relies solely on the configured
    // transactional email providers (Brevo → Resend). If none is configured or all
    // fail, we return a structured error the client can surface honestly.
    if (!emailSent) {
      console.error('[Lead Delivery Failed] No email provider succeeded. Providers configured:', {
        brevo: Boolean(brevoApiKey),
        resend: Boolean(resendApiKey),
      })
      return NextResponse.json(
        {
          success: false,
          error: 'We could not deliver your inquiry right now. Please email us directly at contact@fullstackbrand.co.',
        },
        { status: 502 }
      )
    }

    // Return minimal success response (no sensitive internal data)
    return NextResponse.json({
      success: true,
      projectId,
      provider: providerUsed,
    })
  } catch (error) {
    console.error('[Lead Submission Error]', error)
    return NextResponse.json({ success: false, error: 'Invalid submission format' }, { status: 400 })
  }
}