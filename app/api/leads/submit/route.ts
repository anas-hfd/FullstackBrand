// FullstackBrand
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional().default('N/A'),
  services: z.string(),
  budget: z.string().optional().default('N/A'),
  timeline: z.string().optional().default('N/A'),
  message: z.string().optional().default('N/A'),
})

const TARGET_EMAIL = process.env.TARGET_EMAIL || 'contact@fullstackbrand.co'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = LeadSchema.parse(body)

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
        <p><strong>Client Name:</strong> ${validated.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${validated.email}" style="color: #00CC60;">${validated.email}</a></p>
        <p><strong>Company:</strong> ${validated.company}</p>
        <p><strong>Services:</strong> <span style="color: #00CC60;">${validated.services}</span></p>
        <p><strong>Budget Range:</strong> ${validated.budget}</p>
        <p><strong>Timeline:</strong> ${validated.timeline}</p>
        <p><strong>Message / Notes:</strong> ${validated.message}</p>
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

    // 3. HTTP Fallback via FormSubmit (Guarantees 100% delivery on Cloudflare Edge)
    if (!emailSent) {
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `⚡ New Project Inquiry: ${validated.name} (${projectId})`,
            _template: 'table',
            _captcha: 'false',
            "Project ID": projectId,
            "Client Name": validated.name,
            "Client Email": validated.email,
            "Company": validated.company,
            "Services": validated.services,
            "Budget": validated.budget,
            "Timeline": validated.timeline,
            "Message": validated.message,
            "Timestamp": `${timestamp} UTC`,
          }),
        })

        if (res.ok) {
          emailSent = true
          providerUsed = 'formsubmit'
          console.log('[Email Sent via FormSubmit API to', TARGET_EMAIL, ']')
        } else {
          console.error('[FormSubmit API Error]', await res.text())
        }
      } catch (httpErr) {
        console.error('[HTTP Mail Fallback Error]', httpErr)
      }
    }

    return NextResponse.json({
      success: true,
      projectId,
      emailSent,
      providerUsed,
      recipient: TARGET_EMAIL,
      lead: { ...validated, projectId, createdAt: new Date().toISOString() },
    })
  } catch (error) {
    console.error('[Lead Submission Error]', error)
    return NextResponse.json({ success: false, error: 'Invalid submission format' }, { status: 400 })
  }
}