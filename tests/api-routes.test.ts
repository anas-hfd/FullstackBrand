/**
 * Route-handler tests for the public /api/* endpoints.
 *
 * All outbound providers (Gemini / OpenAI / Brevo / Resend) are mocked — these
 * tests never touch the network and never send real email.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as newsletterGet, POST as newsletterPost } from '@/app/api/newsletter/route'
import { GET as leadsGet, POST as leadsPost } from '@/app/api/leads/submit/route'
import { GET as chatGet, POST as chatPost } from '@/app/api/agent/chat/route'

const ENV_KEYS = [
  'RESEND_API_KEY',
  'BREVO_API_KEY',
  'BREVO_SENDER_EMAIL',
  'TARGET_EMAIL',
  'GEMINI_API_KEY',
  'OPENAI_API_KEY',
] as const

let savedEnv: Record<string, string | undefined> = {}

beforeEach(() => {
  savedEnv = {}
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key]
    delete process.env[key]
  }
  vi.restoreAllMocks()
})

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key]
    else process.env[key] = savedEnv[key]
  }
  vi.unstubAllGlobals()
})

/** Build a POST request with a per-test client IP so rate-limit buckets never collide. */
function post(url: string, body: unknown, ip: string, rawBody?: string) {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip },
    body: rawBody ?? JSON.stringify(body),
  })
}

function stubFetchOk() {
  const fetchMock = vi.fn(
    async (_input: RequestInfo | URL, _init?: RequestInit) => new Response('{}', { status: 200 }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('POST /api/newsletter', () => {
  it('accepts a valid email and returns ok', async () => {
    const res = await newsletterPost(post('http://localhost/api/newsletter', { email: 'reader@example.com' }, 'nl-ok'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('normalises the email to lowercase before use', async () => {
    const fetchMock = stubFetchOk()
    process.env.RESEND_API_KEY = 'test-key'
    const res = await newsletterPost(
      post('http://localhost/api/newsletter', { email: 'UPPER@Example.COM' }, 'nl-normalise'),
    )
    expect(res.status).toBe(200)
    const sent = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body ?? '{}'))
    expect(sent.reply_to).toBe('upper@example.com')
  })

  it('rejects an invalid email with 400', async () => {
    const res = await newsletterPost(
      post('http://localhost/api/newsletter', { email: 'not-an-email' }, 'nl-bad'),
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.ok).toBe(false)
  })

  it('rejects an oversized email with 400', async () => {
    const res = await newsletterPost(
      post('http://localhost/api/newsletter', { email: `${'a'.repeat(250)}@example.com` }, 'nl-long'),
    )
    expect(res.status).toBe(400)
  })

  it('rejects a malformed JSON body with 400', async () => {
    const res = await newsletterPost(
      post('http://localhost/api/newsletter', null, 'nl-json', '{not json'),
    )
    expect(res.status).toBe(400)
  })

  it('rejects non-POST methods with 405', async () => {
    const res = await newsletterGet()
    expect(res.status).toBe(405)
  })

  it('throttles the fourth request from one IP with 429 + Retry-After', async () => {
    const ip = 'nl-throttle'
    for (let i = 0; i < 3; i += 1) {
      const res = await newsletterPost(post('http://localhost/api/newsletter', { email: 'a@b.com' }, ip))
      expect(res.status).toBe(200)
    }

    const blocked = await newsletterPost(post('http://localhost/api/newsletter', { email: 'a@b.com' }, ip))
    expect(blocked.status).toBe(429)
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0)
  })
})

describe('POST /api/leads/submit', () => {
  const validLead = {
    name: 'Dana Client',
    email: 'dana@example.com',
    company: 'Acme',
    services: 'Web Development',
    budget: '$1,000 - $5,000',
    timeline: '1-3 Months',
    message: 'We need a new marketing site.',
  }

  it('delivers a valid lead through Brevo and returns the project id', async () => {
    const fetchMock = stubFetchOk()
    process.env.BREVO_API_KEY = 'test-key'
    process.env.TARGET_EMAIL = 'contact@fullstackbrand.co'

    const res = await leadsPost(post('http://localhost/api/leads/submit', validLead, 'lead-ok'))
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.projectId).toMatch(/^FSB-/)
    expect(body.provider).toBe('brevo')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('falls back to Resend when Brevo is not configured', async () => {
    const fetchMock = stubFetchOk()
    process.env.RESEND_API_KEY = 'test-key'

    const res = await leadsPost(post('http://localhost/api/leads/submit', validLead, 'lead-resend'))
    expect(res.status).toBe(200)
    expect((await res.json()).provider).toBe('resend')
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('api.resend.com')
  })

  it('escapes HTML in the outbound email body', async () => {
    const fetchMock = stubFetchOk()
    process.env.BREVO_API_KEY = 'test-key'

    await leadsPost(
      post(
        'http://localhost/api/leads/submit',
        { ...validLead, message: '<script>alert(1)</script>' },
        'lead-xss',
      ),
    )

    const sent = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body ?? '{}'))
    expect(sent.htmlContent).toContain('&lt;script&gt;')
    expect(sent.htmlContent).not.toContain('<script>alert(1)</script>')
  })

  it('rejects a missing name with 400', async () => {
    const res = await leadsPost(
      post('http://localhost/api/leads/submit', { ...validLead, name: '' }, 'lead-noname'),
    )
    expect(res.status).toBe(400)
    expect((await res.json()).success).toBe(false)
  })

  it('rejects an oversized message with 400', async () => {
    const res = await leadsPost(
      post(
        'http://localhost/api/leads/submit',
        { ...validLead, message: 'x'.repeat(2001) },
        'lead-bigmsg',
      ),
    )
    expect(res.status).toBe(400)
  })

  it('returns 502 when no email provider is configured', async () => {
    const res = await leadsPost(post('http://localhost/api/leads/submit', validLead, 'lead-noprovider'))
    expect(res.status).toBe(502)
    expect((await res.json()).success).toBe(false)
  })

  it('rejects non-POST methods with 405', async () => {
    expect((await leadsGet()).status).toBe(405)
  })
})

describe('POST /api/agent/chat', () => {
  const validChat = { messages: [{ role: 'user', content: 'What does FullstackBrand do?' }] }

  it('answers offline when no model provider is configured', async () => {
    const res = await chatPost(post('http://localhost/api/agent/chat', validChat, 'chat-offline'))
    expect(res.status).toBe(200)
    // Offline fallback streams a grounded reply rather than failing the request.
    const body = await res.text()
    expect(body.trim().length).toBeGreaterThan(0)
  })

  it('solves arithmetic offline without a model provider', async () => {
    const res = await chatPost(
      post(
        'http://localhost/api/agent/chat',
        { messages: [{ role: 'user', content: 'what is 4 * 5' }] },
        'chat-math',
      ),
    )
    expect(res.status).toBe(200)
    expect(await res.text()).toContain('= 20')
  })

  it('rejects an empty message list with 400', async () => {
    const res = await chatPost(post('http://localhost/api/agent/chat', { messages: [] }, 'chat-empty'))
    expect(res.status).toBe(400)
  })

  it('rejects an unknown role with 400', async () => {
    const res = await chatPost(
      post('http://localhost/api/agent/chat', { messages: [{ role: 'hacker', content: 'hi' }] }, 'chat-role'),
    )
    expect(res.status).toBe(400)
  })

  it('rejects an oversized message with 400', async () => {
    const res = await chatPost(
      post(
        'http://localhost/api/agent/chat',
        { messages: [{ role: 'user', content: 'x'.repeat(2501) }] },
        'chat-long',
      ),
    )
    expect(res.status).toBe(400)
  })

  it('rejects a conversation longer than 30 messages with 400', async () => {
    const messages = Array.from({ length: 31 }, () => ({ role: 'user', content: 'hi' }))
    const res = await chatPost(post('http://localhost/api/agent/chat', { messages }, 'chat-many'))
    expect(res.status).toBe(400)
  })

  it('rejects a malformed JSON body with 400', async () => {
    const res = await chatPost(post('http://localhost/api/agent/chat', null, 'chat-json', '{oops'))
    expect(res.status).toBe(400)
  })

  it('rejects non-POST methods with 405', async () => {
    expect((await chatGet()).status).toBe(405)
  })

  it('throttles beyond 10 requests/minute per IP with 429 + Retry-After', async () => {
    const ip = 'chat-throttle'
    for (let i = 0; i < 10; i += 1) {
      const res = await chatPost(post('http://localhost/api/agent/chat', validChat, ip))
      expect(res.status).toBe(200)
    }

    const blocked = await chatPost(post('http://localhost/api/agent/chat', validChat, ip))
    expect(blocked.status).toBe(429)
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0)
  })

  /* ---- idea capture: what they want to build -> service -> next step ---- */

  const askOffline = (content: string, ip: string) =>
    chatPost(post('http://localhost/api/agent/chat', { messages: [{ role: 'user', content }] }, ip)).then(r =>
      r.text()
    )

  it('maps a platform request onto the Web and SaaS service with pricing and a next step', async () => {
    const body = await askOffline('I want to build a SaaS dashboard for our logistics team', 'chat-build')
    expect(body).toContain('Web and SaaS Platforms')
    expect(body).toContain('$3,000')
    expect(body.toLowerCase()).toContain('form')
  })

  it('routes a rebrand request to the brand service', async () => {
    const body = await askOffline('We need a full rebrand for our fintech startup', 'chat-rebrand')
    expect(body).toContain('Brand Design and Visual Identity')
    expect(body).toContain('$2,000')
  })

  it('routes an agent request to the AI integration service', async () => {
    const body = await askOffline('Can you build an AI agent that answers our support tickets?', 'chat-agent')
    expect(body).toContain('AI Integration and Automation')
    expect(body).toContain('$5,000')
  })

  it('asks exactly one qualifying question and offers one next step', async () => {
    const body = await askOffline('I want to launch an online store', 'chat-qualify')
    expect((body.match(/\?/g) || []).length).toBe(1)
    expect(body).toContain('Web and SaaS Platforms')
  })

  it('answers lab research questions with the internal-measurement caveat', async () => {
    const body = await askOffline('What is your TRL status?', 'chat-trl')
    expect(body).toContain('TRL 3-4')
    expect(body).toContain('internal prototype numbers')
  })

  it('answers pricing questions with the full indicative bands', async () => {
    const body = await askOffline('How much does a project cost?', 'chat-pricing')
    expect(body).toContain('$2,000')
    expect(body).toContain('$4,000 per month')
  })

  /* ---- the exact regression reported: plain questions must never be refused ---- */

  it('answers "what are your services" instead of refusing', async () => {
    const body = await askOffline('can you tell me what are your services', 'chat-services')
    expect(body).toContain('Brand Design and Visual Identity')
    expect(body).toContain('Web and SaaS Platforms')
    expect(body).not.toContain('outside my tuned context')
  })

  it('answers general "what do you do" style questions', async () => {
    const body = await askOffline('what does FullstackBrand do?', 'chat-whatdo')
    expect(body).toContain('Studio')
    expect(body).not.toContain('outside my tuned context')
  })

  it('answers who-are-you and location questions', async () => {
    const body = await askOffline('who are you and where are you based?', 'chat-who')
    expect(body).toContain('Sheridan, Wyoming')
    expect(body).not.toContain('outside my tuned context')
  })

  it('answers timeline questions', async () => {
    const body = await askOffline('how long does a project take to build?', 'chat-timeline')
    expect(body).toContain('4-6 weeks')
  })

  it('answers a plain greeting without refusing', async () => {
    const body = await askOffline('hello', 'chat-hello')
    expect(body).toContain('AI Lab')
    expect(body).not.toContain('outside my tuned context')
  })
})
