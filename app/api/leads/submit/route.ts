// FullstackBrand
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import nodemailer from 'nodemailer'

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional().default('N/A'),
  services: z.string(),
  budget: z.string().optional().default('N/A'),
  timeline: z.string().optional().default('N/A'),
  message: z.string().optional().default('N/A'),
})

const TARGET_EMAIL = process.env.TARGET_EMAIL || 'anas1.hfd@gmail.com'

let cachedTransporter: nodemailer.Transporter | null = null

function getTransporter(host: string, port: number, secure: boolean, user: string, pass: string) {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      auth: { user, pass },
    })
  }
  return cachedTransporter
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = LeadSchema.parse(body)

    const projectId = `FSB-${Date.now().toString(36).toUpperCase()}`
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC' })

    console.log('[Lead Submitted]', { projectId, ...validated })

    let emailSent = false
    let providerUsed = 'none'

    const host = process.env.SMTP_HOST || 'smtp.gmail.com'
    const port = Number(process.env.SMTP_PORT) || 465
    const secure = process.env.SMTP_SECURE === 'true' || port === 465
    const user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.TARGET_EMAIL
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS

    const mailOptions = {
      from: `"FullstackBrand Leads" <${user || TARGET_EMAIL}>`,
      to: TARGET_EMAIL,
      replyTo: validated.email,
      subject: `⚡ [New Inquiry] ${validated.name} - ${validated.services} (${projectId})`,
      html: `
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
      `,
    }

    // 1. Try Nodemailer if SMTP credentials exist
    if (user && pass) {
      try {
        const transporter = getTransporter(host, port, secure, user, pass)
        await transporter.sendMail(mailOptions)
        emailSent = true
        providerUsed = 'smtp'
        console.log('[Email Sent via SMTP to', TARGET_EMAIL, ']')
      } catch (err) {
        console.error('[SMTP Error on Cloudflare Worker]', err)
      }
    }

    // 2. Fallback to FormSubmit HTTP API (Always reliable on Cloudflare Edge via fetch)
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