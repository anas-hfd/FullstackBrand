import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { createRateLimiter, clientIpFrom } from '@/lib/rate-limit';

const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1).max(2500),
      })
    )
    .min(1, 'At least one message is required')
    .max(30, 'Conversation history exceeds maximum limit'),
  page: z.enum(['lab', 'studio', 'privacy', 'terms', 'other']).optional(),
});

// In-process rate limiter (10 requests/minute per IP)
const checkRateLimit = createRateLimiter({ limit: 10, windowMs: 60 * 1000 });

export async function GET() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}

const SYSTEM_PROMPT = `You are the Lead Systems Architect at FullstackBrand - the resident AI assistant on fullstackbrand.co. You sound like a sharp, friendly senior engineer who knows the company inside out, NOT a support chatbot. You have two jobs: answer questions precisely, and turn genuine interest into a real conversation with the team.

=== COMPANY ===
FullstackBrand is an applied AI engineering company (Sheridan, Wyoming) with two coordinated branches:
- AI LAB (page /) - the R&D branch, currently PROTOTYPE STAGE. Work: hybrid inference routing, sovereign non-egress pipelines, autonomous agent orchestration, and the GlyphForge generative asset engine.
- STUDIO (page /studio) - the commercial branch that ships for clients: brand design, digital marketing, web and SaaS platforms, and AI integration and automation.
Contact: contact@fullstackbrand.co - +1 945-997-2019 - 1309 Coffeen Avenue STE 1200, Sheridan, WY 82801, USA.
Open each conversation briefly and go deep only when the visitor asks.

=== AI LAB FACTS (precise, never overstated) ===
- TRL status: core systems are at TRL 3-4 (validated in prototype), ADVANCING TOWARD TRL-7 (system prototype demonstration). We use the NASA/ESA TRL framework and publish maturity honestly.
- Hybrid inference routing: small quantized models (SLMs) pre-route each task to the right tier, while frontier models handle deep execution. Internal prototype measurements: router stage under 28ms, roughly 84% lower compute observed, and 99.8% schema conformance on our own test set. All internal, not independently validated - say so if probed.
- Sovereign pipelines: non-egress architecture, zero-data-retention modes, air-gapped deployment options, and 0% data egress in sovereign mode when configured on customer infrastructure. AES-256 at rest, TLS 1.3 in transit, pre-flight PII scrubbing (regex plus NER). No fine-tuning on customer payloads.
- Autonomous agent orchestrator: multi-agent task decomposition, self-correcting validation loops, structured tool calling, high-concurrency pipelines.
- GlyphForge: experimental generative asset engine that synthesizes production-ready vector assets from natural-language prompts, deterministically. The on-page demo is a design prototype (UI demo only) and full model integration is on the roadmap. Never claim it is finished.
- Distributed pipeline and compute topology: five stages - edge ingestion, semantic cache, LLM router, vector store, distributed webhooks - engineered for extreme API concurrency. Prototyped, advancing toward TRL-7.
- Compliance scaffolding (architecture design targets, NOT certifications): SOC-2 Type II ready, HIPAA BAA capable, GDPR-aligned, ISO/IEC 27001 aligned. We are SOC 2-ALIGNED, not certified.

=== STUDIO SERVICE CATALOG (quote as indicative starting points, never as fixed quotes) ===
1. Brand Design and Visual Identity - naming, logo systems, visual identity, motion, design systems. From $2,000; typically 2-3 weeks.
2. Digital Marketing and Brand Strategy - positioning, SEO and content, paid on Google/Meta/LinkedIn, lifecycle marketing. From $4,000 per month.
3. Web and SaaS Platforms - marketing sites, SaaS dashboards, e-commerce, mobile. Next.js and modern stacks. From $3,000; typically 2-4 weeks for a site, longer for a platform.
4. AI Integration and Automation - agents, chatbots, RAG retrieval systems, workflow automation, model integration. From $5,000; typically 3-6 weeks.
5. Full Ecosystem - several practice areas coordinated by one team, priced as a tailored proposal.
Process: seven stages - Discovery, Strategy, Design, Development (two-week sprints with weekly demos), AI Integration, Launch (QA, security, performance), Growth.
Commercial terms: fixed-price milestones or monthly retainers; invoices due within 14 days; full code ownership transfers on final settlement. Typical MVP timeline is 4-6 weeks. The team replies within 24 hours.

=== WHEN SOMEONE DESCRIBES WHAT THEY WANT TO BUILD (this is the core of your job) ===
Do not answer with a service list. Work through these five steps in one tight reply:
1. MIRROR IT - restate their goal in one sentence, in their own words. Show you actually understood.
2. MAP IT - name the one or two catalog services that fit, using the exact service names. If it spans several, say Full Ecosystem.
3. SIZE IT - give the indicative starting price and a realistic timeline. Always frame it as starting at or typically; never as a firm quote.
4. QUALIFY IT - ask exactly ONE question that unlocks the next step. Pick the most valuable unknown: scope and surface area, deadline, budget band, or whether data has to stay inside their own infrastructure.
5. MOVE IT FORWARD - end with one concrete next step: the project intake form on the Studio page (anchors #start and #contact) or a free 30-minute discovery call. Mention the team replies within 24 hours.
Keep it to 2-4 short sentences plus that one question. Never dump the whole catalog. Never promise a fixed price, a delivery date, or a specific outcome.

=== READING INTENT, THEN ROUTING ===
- I want to build / we need / looking for / can you help with = a commercial opportunity. Run the five steps above.
- Brand, rebrand, identity, logo, naming, packaging, visual system = service 1.
- Growth, traffic, leads, SEO, ads, campaigns, positioning = service 2.
- Website, landing page, store, portal, dashboard, SaaS, app, mobile, platform = service 3.
- AI, agents, chatbots, RAG, automation, model integration, copilots = service 4.
- Proof, pilots, benchmarks, architecture review, sovereign or on-prem deployment, research or grant language = the AI Lab, and often a research partnership. Offer the architecture whitepaper and the technical artifacts on the Lab page.
- Exploratory visitors (just looking, curious, early days) = do not push. Answer, offer one useful comparison, and leave the door open with the whitepaper or a discovery call.
- Recruiters, vendors and unrelated questions = be pleasant and brief, then return to what we do.

=== ANSWERING RESEARCH QUESTIONS ===
Answer with the real numbers and keep the honesty label attached. Point to the live artifacts on the Lab page: benchmark explorer (#research), GlyphForge demo (#saas-development), topology visualizer (#architecture), sovereignty model (#sovereignty), TRL roadmap (#trl-roadmap), and the architecture whitepaper request.
If a question goes beyond what we have published, say what we have not published instead of inventing a figure.

=== HONESTY (non-negotiable) ===
Never fabricate statistics, certifications, client counts, case studies, logos or outcomes. Benchmarks are internal prototype measurements. Maturity is TRL 3-4. Compliance items are design targets, not certifications. If you do not know, say so and point to the team.

=== HOW TO TALK ===
1. ANSWER FIRST - reply to the actual question in the first sentence, then bridge. Never dodge, never answer a different question, never open with a pitch.
2. OUT OF YOUR DEPTH - if a question is truly unrelated to FullstackBrand (vacations, recipes, homework, medical or legal advice), do not fake it and do not give a bare refusal. Acknowledge it like a human, then invite: that one is outside my tuned context, I only really know FullstackBrand - our AI Lab research, GlyphForge, the TRL roadmap, and what the Studio builds and charges. Want one of those instead, or should I point you to the team?
3. HUMAN VOICE - contractions, plain words, short sentences. Zero corporate filler: never say Great question, never say I would be happy to help. Vary your openings, never repeat a sentence you already used, and never re-introduce yourself after the greeting.
4. ONE QUESTION MAXIMUM per reply, and always end with a natural next step. Never say visit our website - you are ON the site.
5. FORMAT - short paragraphs. Light markdown is rendered, so use bold for key terms and dash-prefixed lines for a list of four items or fewer. No headings, no tables, no emoji.

=== ERROR RESPONSE (use verbatim if generation fails) ===
"I'm having a moment - something went wrong on my end. Try me again, or reach the team directly at contact@fullstackbrand.co."`;

const PAGE_CONTEXT: Record<string, string> = {
  lab: 'VISITOR IS CURRENTLY ON: the AI Lab home page (/). On this page right now: #research (live benchmark explorer), #saas-development (interactive GlyphForge demo), #architecture (topology visualizer), #sovereignty (zero-data-retention & air-gapping), #updates (research newsletter signup). The commercial Studio is one click away at /studio.',
  studio: 'VISITOR IS CURRENTLY ON: the Studio page (/studio). On this page right now: #services, #process (7-stage delivery), #ai-showcase, and #contact / #start (the project intake form — direct scheduling/quote requests HERE and say the form is on this page). The AI Lab research is at /. Lead-form CTAs should point at the on-page form, not email.',
  privacy: 'VISITOR IS CURRENTLY ON: the Privacy Policy (/privacy). Answer data-handling, AI sovereignty, and GDPR/CCPA questions precisely and consistently with the published policy sections.',
  terms: 'VISITOR IS CURRENTLY ON: the Terms of Service (/terms). Answer engagement, IP, and commercial questions consistently with the published terms (Wyoming governing law).',
  other: 'VISITOR IS CURRENTLY ON: a general site page. The AI Lab is at / and the Studio at /studio.',
};

// Tiny safe arithmetic evaluator for the no-API-key fallback path.
// Accepts only digits and + - * / % ( ) . — no eval, no Function.
function tryArithmetic(raw: string): string | null {
  let s = raw.toLowerCase().trim();
  s = s
    .replace(/^(what\s+is|what's|calculate|compute|how\s+much\s+is|solve)\s+/, '')
    .replace(/\?+\s*$/, '');
  s = s
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/(\d)\s*x\s*(\d)/g, '$1*$2')
    .replace(/\s+/g, '');
  if (!s || !/^[\d+\-*/().%]+$/.test(s) || !/\d/.test(s) || !/[+\-*/%]/.test(s)) return null;

  const tokens = s.match(/\d+\.?\d*|[+\-*/%()]/g);
  if (!tokens) return null;

  // Shunting-yard → RPN
  const output: string[] = [];
  const ops: string[] = [];
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };
  for (const t of tokens) {
    if (/^\d/.test(t)) output.push(t);
    else if (t === '(') ops.push(t);
    else if (t === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') output.push(ops.pop() as string);
      if (!ops.length) return null;
      ops.pop();
    } else {
      while (
        ops.length &&
        ops[ops.length - 1] !== '(' &&
        prec[ops[ops.length - 1]] >= prec[t]
      ) {
        output.push(ops.pop() as string);
      }
      ops.push(t);
    }
  }
  while (ops.length) {
    const op = ops.pop() as string;
    if (op === '(') return null;
    output.push(op);
  }

  // Evaluate RPN
  const stack: number[] = [];
  for (const t of output) {
    if (/^\d/.test(t)) {
      stack.push(parseFloat(t));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) return null;
      switch (t) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(b === 0 ? NaN : a / b); break;
        default: stack.push(a % b); break;
      }
    }
  }
  const result = stack.pop();
  if (result === undefined || !Number.isFinite(result)) return null;
  return `${raw.trim().replace(/\?+$/, '').trim()} = ${Number(result.toFixed(6))}`;
}

export async function POST(req: NextRequest) {
  // 1. IP rate limiting
  const ip = clientIpFrom(req.headers);

  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many chat requests. Please slow down.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rate.retryAfterSeconds),
        },
      }
    );
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON request body.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const parseResult = ChatRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: parseResult.error.errors[0]?.message || 'Invalid messages format.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages, page } = parseResult.data;
    const systemInstruction =
      SYSTEM_PROMPT + (page ? `\n\n━━━ ${PAGE_CONTEXT[page]}` : '');

    const geminiApiKey = process.env.GEMINI_API_KEY?.replace(/["']/g, '').trim();
    const openAiApiKey = process.env.OPENAI_API_KEY?.replace(/["']/g, '').trim();

    // ─── 1. Google Gemini via official SDK (primary — real-time token streaming) ─
    if (geminiApiKey && geminiApiKey.length > 5) {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });

      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: m.content }],
      }));

      // Models in priority order — most capable first
      // The -latest alias tracks Google's current flash model, so this list does not
      // silently rot the way pinned, retired model ids do. Verify with:
      // GET https://generativelanguage.googleapis.com/v1beta/models
      // Verified against GET https://generativelanguage.googleapis.com/v1beta/models
      // Concrete ids first for speed, then the auto-updating alias as a last resort.
      const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];

      for (const model of candidateModels) {
        try {
          const stream = await ai.models.generateContentStream({
            model,
            contents,
            config: {
              systemInstruction,
              maxOutputTokens: 700,
              temperature: 0.7,
              topP: 0.9,
            },
          });

          // Prime the first chunk here so model/auth errors surface before we
          // commit to a Response, keeping the fallback chain intact.
          const iterator = stream[Symbol.asyncIterator]();
          const first = await iterator.next();
          if (first.done) continue;

          const encoder = new TextEncoder();
          const firstText = first.value?.text ?? '';
          const readable = new ReadableStream<Uint8Array>({
            async start(controller) {
              try {
                if (firstText) controller.enqueue(encoder.encode(firstText));
                while (true) {
                  const { done, value } = await iterator.next();
                  if (done) break;
                  const token = value?.text;
                  if (token) controller.enqueue(encoder.encode(token));
                }
              } catch (e) {
                console.error(`Gemini stream error (${model}):`, e);
              } finally {
                controller.close();
              }
            },
          });

          return new Response(readable, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'X-Accel-Buffering': 'no',
              'Cache-Control': 'no-cache',
              'X-Assistant-Mode': 'gemini',
            },
          });
        } catch (e) {
          console.warn(`Gemini ${model} unavailable, trying next model:`, e);
        }
      }

      console.error(
        '[Assistant] Every Gemini model attempt failed - serving deterministic fallback replies. ' +
          'Check GEMINI_API_KEY and that the ids in candidateModels still exist.',
      );
    }

    // ─── 2. OpenAI fallback (streaming) ──────────────────────────────────────
    if (openAiApiKey) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          stream: true,
          max_tokens: 512,
          temperature: 0.7,
          messages: [{ role: 'system', content: systemInstruction }, ...messages],
        }),
      });

      return new Response(res.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'X-Accel-Buffering': 'no',
          'Cache-Control': 'no-cache',
          'X-Assistant-Mode': 'openai',
        },
      });
    }

    // ─── 3. Offline fallback (no API key configured) ─────────────────────────
    // Honest, non-canned replies grounded in current site content. The assistant
    // answers simple arithmetic directly and handles high-intent topics; for
    // anything else it admits its limits instead of pitching.
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

    const smartReply = (() => {
      // Direct arithmetic still wins
      const math = tryArithmetic(messages[messages.length - 1]?.content || '')
      if (math) return math

      // 1. Idea capture: map whatever they describe onto the Studio service catalog
      const LANES: { match: RegExp; name: string; price: string; timeline: string }[] = [
        { match: /\b(brand|rebrand|branding|logo|identity|naming|packaging|visual)\b/, name: 'Brand Design and Visual Identity', price: 'from $2,000', timeline: '2-3 weeks' },
        { match: /\b(marketing|seo|ads|advertising|paid|campaign|growth|funnel|content|traffic|leads)\b/, name: 'Digital Marketing and Brand Strategy', price: 'from $4,000 per month', timeline: 'an ongoing monthly retainer' },
        { match: /\b(website|site|landing|ecommerce|e-commerce|shop|store|portal|dashboard|saas|app|mobile|platform)\b/, name: 'Web and SaaS Platforms', price: 'from $3,000', timeline: '2-4 weeks for a site, longer for a platform' },
        { match: /\b(ai|agent|agents|chatbot|bot|automation|rag|llm|copilot|workflow|integration|integrate)\b/, name: 'AI Integration and Automation', price: 'from $5,000', timeline: '3-6 weeks' },
      ]
      const lanes = LANES.filter(l => l.match.test(lastMsg))

      if (lanes.length > 0) {
        const named = lanes.slice(0, 2).map(l => l.name).join(' and ')
        const first = lanes[0]
        return `That reads like a ${named} project. Work like that typically starts ${first.price}, and a realistic timeline is ${first.timeline} - scope decides the final number. Quick question so I point you at the right thing: is the deadline the fixed part, or the budget? Either way, the intake form on this page gets you a tailored proposal from the team within 24 hours.`
      }

      // 2. Topical answers, most specific first. Order matters: the broad rules sit last.
      const RULES: { match: RegExp; reply: string }[] = [
        {
          match: /glyphforge|glyph|icon|svg/,
          reply:
            "GlyphForge is our generative asset engine: describe an icon in plain language and it synthesizes a production-ready vector asset, deterministically - same prompt, same glyph. The demo on the AI Lab page is a design prototype, and full model integration is on the roadmap. Want the technical architecture, or the commercial angle for your own product?",
        },
        {
          match: /research|benchmark|trl|readiness|maturity|sovereign|air.?gap|non.?egress|routing|vector|architecture|latency|compute/,
          reply:
            "Our core systems sit at TRL 3-4 - validated in prototype - advancing toward TRL-7, and we publish that honestly. Internally we measure a sub-28ms router stage and roughly 84% lower compute, both internal prototype numbers rather than independently validated ones. Which thread do you want to pull: the routing benchmarks, the sovereign non-egress pipeline, or GlyphForge?",
        },
        {
          match: /\bservices?\b|\boffering|\bcapabilit|solutions?\b|what (do|does) (you|fullstackbrand|the company)|what can you (do|build|offer)|what do you build/,
          reply:
            "The Studio runs four practice areas: - Brand Design and Visual Identity, from $2,000 - Digital Marketing and Brand Strategy, from $4,000 per month - Web and SaaS Platforms, from $3,000 - AI Integration and Automation, from $5,000. Underneath sits the AI Lab, our R&D arm - hybrid routing, sovereign pipelines, and GlyphForge. Which of those is closest to what you need?",
        },
        {
          match: /who are you|about (you|us|the company|fullstackbrand)|what is fullstackbrand|your company|where are you|located|location|address|based/,
          reply:
            "FullstackBrand is an applied AI engineering company with two branches: the AI Lab, our R&D arm (hybrid inference routing, sovereign non-egress pipelines, autonomous agents, GlyphForge), and the Studio, which ships client work (brand, marketing, web and SaaS, AI automation). We work from 1309 Coffeen Avenue STE 1200, Sheridan, Wyoming, and the team answers at contact@fullstackbrand.co. Are you here for the research side, or to build something?",
        },
        {
          match: /price|cost|budget|how much|quote|estimate|pricing|rate|charge/,
          reply:
            "Indicative studio pricing: brand design from $2,000, web and SaaS platforms from $3,000, AI agents and automation from $5,000, and digital marketing from $4,000 per month. Typical MVPs run 4-6 weeks. Scope drives the final number, so the fastest path is the intake form on this page - you get a tailored proposal within 24 hours.",
        },
        {
          match: /how long|timeline|duration|deadline|turnaround|when can you/,
          reply:
            "Typical timelines: brand work 2-3 weeks, marketing sites 2-4 weeks, a full SaaS platform longer, and AI integration 3-6 weeks - most MVPs land in 4-6 weeks. We work in two-week sprints with weekly demos, so progress stays visible. What is your target date?",
        },
        {
          match: /schedul|meet|book|call|appointment|consult|discovery/,
          reply:
            "Let us do it - the project intake form on this page gets a reply within 24 hours, and that first call is a free strategy session, not a sales pitch. If you would rather email, it is contact@fullstackbrand.co.",
        },
        {
          match: /contact|email|phone|reach|talk|speak|human/,
          reply:
            "contact@fullstackbrand.co or +1 945-997-2019 - a human answers within 24 hours. Or use the form on this page and we will come to you.",
        },
        {
          match: /process|how do you work|methodology|steps|engagement/,
          reply:
            "Seven stages: Discovery, Strategy, Design, Development, AI Integration, Launch, Growth - two-week sprints with weekly demos so you always see progress. The Process section on the Studio page walks through it. Want me to map that onto your specific project?",
        },
        {
          match: /result|case|portfolio|success|achieve|client|reference/,
          reply:
            "We are an applied AI engineering company founded in 2026 - early engagements are happening now, and we would rather show you a live demo (try GlyphForge on the Lab page) than inflate a portfolio. Bring us your hardest problem and we will scope it within 24 hours.",
        },
        {
          match: /\b(hi|hello|hey|good (morning|afternoon|evening)|thanks|thank you|cheers|bye|goodbye)\b/,
          reply:
            "Hey - good to have you here. I can walk you through the AI Lab research (sovereign pipelines, hybrid routing, GlyphForge, the TRL roadmap) or the Studio side (brand, marketing, web and SaaS, AI automation). Which one are you curious about?",
        },
      ]

      for (const rule of RULES) {
        if (rule.match.test(lastMsg)) return rule.reply
      }

      // Nothing matched: stay useful instead of refusing a simple question.
      return "Happy to help - the two things I know best are the AI Lab research (sovereign pipelines, hybrid routing, GlyphForge, the TRL roadmap) and everything the Studio builds: brand, marketing, web and SaaS platforms, and AI automation. Which of those is closest to what you need?"
    })();

    const encoder = new TextEncoder();
    const words = smartReply.split(' ');
    const stream = new ReadableStream({
      start(controller) {
        words.forEach((word: string, i: number) => {
          setTimeout(() => {
            controller.enqueue(encoder.encode((i === 0 ? '' : ' ') + word));
            if (i === words.length - 1) controller.close();
          }, 30 * i);
        });
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Assistant-Mode': 'offline' },
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    const errorMsg = "I'm having a moment — something went wrong on my end. Try me again, or reach the team directly at contact@fullstackbrand.co.";
    return new Response(errorMsg, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
