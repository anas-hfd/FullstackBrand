import { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `You are the official AI Assistant for FullstackBrand — an elite, AI-powered full-stack digital agency at fullstackbrand.co.

━━━ COMPANY IDENTITY ━━━
Name: FullstackBrand
Website: fullstackbrand.co
Email: contact@fullstackbrand.co
Phone: +1 945-997-2019
Location: 1309 Coffeen Avenue STE 1200, Sheridan, Wyoming 82801, USA
Est: 2026
Tagline: "We Build Intelligent Digital Brands"

━━━ PROVEN RESULTS ━━━
• 150+ Projects Delivered
• 99.9% Uptime Guaranteed on all hosted products
• <2s average page load times
• 40+ AI models integrated across client solutions
• SOC2-compliant AI infrastructure, sub-100ms response times
• Deployed in 12+ countries
• 5-star satisfaction across all engagements

━━━ SERVICES — 4 CORE PILLARS ━━━

01. BRAND DESIGN & VISUAL IDENTITY
  • Brand Visual & Motion Identity — logos, animation, full visual system
  • Brand Guidelines & Systems — typography, color, tone of voice at scale
  • UI/UX Design — user research, wireframes, high-fidelity prototypes
  • Product & Dashboard Design — end-to-end SaaS product design, design systems

02. DIGITAL MARKETING & BRAND STRATEGY
  • Brand Positioning & Strategy — market differentiation, messaging, narrative
  • SEO & Content Strategy — organic visibility and long-term authority building
  • Paid Advertising — ROI-focused Google, Meta, and LinkedIn campaigns
  • Growth & Retention Marketing — full-funnel acquisition and lifecycle systems

03. WEB DEVELOPMENT
  • Websites & Landing Pages — conversion-optimized, SEO-ready web presence
  • Web Applications & SaaS Dashboards — complex Next.js/React platforms and internal tools
  • Mobile Applications — cross-platform iOS & Android experiences
  • E-Commerce & Custom Solutions — scalable storefronts and bespoke platforms

04. AI AUTOMATION & INTELLIGENT AGENTS
  • Workflow Automation — end-to-end process automation across enterprise stacks
  • AI Agent Integration — autonomous agents using LangChain, OpenAI, Gemini for multi-step tasks
  • Chatbots & Voice Agents — conversational AI for 24/7 support, sales, and operations
  • Custom AI Products & SaaS — tailored LLM models, RAG pipelines, AI-native applications

━━━ HOW WE WORK — 7 STAGES ━━━
01 Discovery — deep dive into goals, audience, competitors, market dynamics
02 Strategy — data-backed architecture, tech stack, content hierarchy, KPI benchmarks
03 Design — high-fidelity prototypes and brand identity tested before any code
04 Development — agile 2-week sprints, weekly client demos, clean maintainable code
05 AI Integration — layering in AI agents, automation pipelines, and custom models
06 Launch — zero-downtime deployment, QA, security checks, performance audits
07 Growth — post-launch analytics, A/B testing, SEO refinements, feature scaling

━━━ PRICING ESTIMATES ━━━
• Brand Design: $2,000 – $8,000+
• Web Development: $3,000 – $12,000+ (typical 2–4 weeks)
• AI Agents & Automation: $5,000 – $15,000+ (typical 3–6 weeks)
• Digital Marketing: $4,000+/month
• Full Custom Ecosystem: tailored proposal after strategy call

━━━ PAGE NAVIGATION (you ARE embedded on the site — never say "visit our website") ━━━
• Services details → direct to #services section
• Process / How we work → direct to #process section
• AI Automation capabilities → direct to #ai section
• Contact, book a call, schedule a meeting, start a project, get a quote → ALWAYS direct to #start section

━━━ RESPONSE RULES ━━━
1. SCOPE: Only answer questions about FullstackBrand — services, pricing, process, results, contact, scheduling. For anything outside this scope, use the exact off-topic response below.
2. DEPTH: Give concise answers by default (2–4 sentences). If the user explicitly asks for more detail, elaboration, or explanation — provide it fully and thoroughly.
3. SCHEDULING / MEETINGS / QUOTES: If the user wants to book a call, schedule a meeting, get a quote, or start a project — ALWAYS tell them to scroll to the #start section on this page and fill in the inquiry form. The team responds within 24 hours.
4. TONE: Confident, premium, futuristic, helpful — like a top-tier agency consultant. Never robotic.
5. FORMAT: Use short paragraphs. No bullet lists unless the user asks for a breakdown. Always end with a natural next step.
6. NEVER say: "visit our website", "go to fullstackbrand.co", "check online" — you are already on the site.

━━━ OFF-TOPIC RESPONSE (use verbatim) ━━━
"I'm specifically here to help with FullstackBrand's services — web development, AI automation, branding, and digital marketing. Is there something I can help you with about what we offer or how we work?"

━━━ ERROR / FAILURE RESPONSE (use verbatim) ━━━
"I'm having a moment — something went wrong on my end. Please try again, or reach out directly at contact@fullstackbrand.co and we'll be happy to help!"`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const geminiApiKey = process.env.GEMINI_API_KEY?.replace(/["']/g, '').trim();
    const openAiApiKey = process.env.OPENAI_API_KEY?.replace(/["']/g, '').trim();

    // ─── 1. Google Gemini (primary — SSE streaming for real-time token delivery) ─
    if (geminiApiKey && geminiApiKey.length > 5) {
      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Models in priority order — fastest/most capable first
      const candidateModels = [
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-pro',
      ];

      for (const model of candidateModels) {
        try {
          // First try SSE streaming endpoint
          const streamRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: formattedContents,
                generationConfig: {
                  maxOutputTokens: 512,
                  temperature: 0.6,
                  topP: 0.9,
                },
              }),
            }
          );

          if (streamRes.ok && streamRes.body) {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            const transformStream = new TransformStream<Uint8Array, Uint8Array>({
              transform(chunk, controller) {
                const text = decoder.decode(chunk, { stream: true });
                const lines = text.split('\n');

                for (const line of lines) {
                  if (!line.startsWith('data: ')) continue;
                  const jsonStr = line.slice(6).trim();
                  if (!jsonStr || jsonStr === '[DONE]') continue;

                  try {
                    const parsed = JSON.parse(jsonStr);
                    const token = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                    if (token) controller.enqueue(encoder.encode(token));
                  } catch {
                    // Skip malformed SSE chunks silently
                  }
                }
              },
            });

            return new Response(streamRes.body.pipeThrough(transformStream), {
              headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Accel-Buffering': 'no',
                'Cache-Control': 'no-cache',
              },
            });
          }

          // If streaming fails, try non-streaming generateContent for same model
          const nonStreamRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: formattedContents,
                generationConfig: {
                  maxOutputTokens: 512,
                  temperature: 0.6,
                },
              }),
            }
          );

          if (nonStreamRes.ok) {
            const data = await nonStreamRes.json();
            const text =
              data?.candidates?.[0]?.content?.parts?.[0]?.text ??
              "I'm having a moment — something went wrong on my end. Please try again, or reach out directly at contact@fullstackbrand.co and we'll be happy to help!";

            // Word-by-word stream to keep UX consistent
            const encoder = new TextEncoder();
            const words = text.split(' ');
            const stream = new ReadableStream({
              start(controller) {
                words.forEach((word: string, i: number) => {
                  setTimeout(() => {
                    controller.enqueue(encoder.encode((i === 0 ? '' : ' ') + word));
                    if (i === words.length - 1) controller.close();
                  }, 25 * i);
                });
              },
            });

            return new Response(stream, {
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            });
          }

          const errText = await (streamRes.text().catch(() => ''));
          console.warn(`Gemini ${model} failed (${streamRes.status}):`, errText.slice(0, 200));
        } catch (e) {
          console.error(`Gemini fetch error for ${model}:`, e);
        }
      }

      console.error('All Gemini model attempts failed — falling through.');
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
          temperature: 0.6,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        }),
      });

      return new Response(res.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'X-Accel-Buffering': 'no',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // ─── 3. Smart keyword fallback (no API key available) ────────────────────
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

    const smartReply = (() => {
      if (/schedul|meet|book|call|appointment|consult/.test(lastMsg))
        return "I'd love to set that up! Scroll down to the Start Your Project section on this page — fill in the form and our team will reach out within 24 hours to schedule your strategy call.";

      if (/price|cost|budget|how much|quote|estimate/.test(lastMsg))
        return "Our pricing depends on scope: Brand Design starts at $2,000, Web Development from $3,000, and AI Automation from $5,000. For an exact quote tailored to your project, scroll to the Start Your Project section and submit your brief — we'll respond within 24 hours.";

      if (/service|offer|do you|what can|capabilities/.test(lastMsg))
        return "We offer four core services: Brand Design & Visual Identity, Digital Marketing & Brand Strategy, Web Development (websites, SaaS, mobile apps), and AI Automation (agents, chatbots, workflows). Scroll to the Services section below for the full breakdown.";

      if (/ai|automat|agent|chatbot|workflow|llm/.test(lastMsg))
        return "Our AI Automation pillar covers end-to-end workflow automation, autonomous AI agent integration, chatbots & voice agents, and custom AI products. We use LangChain, OpenAI, and Gemini to build intelligent systems that work 24/7. Scroll to the AI section below for a live demo.";

      if (/web|site|app|develop|build|saas|ecommerce|mobile/.test(lastMsg))
        return "We build high-performance web applications, SaaS dashboards, mobile apps (iOS & Android), and e-commerce platforms using Next.js and modern frameworks. Every project is SEO-optimized, fast-loading, and built to scale. Scroll to Services below to see the full scope.";

      if (/brand|design|logo|identity|visual|ui|ux/.test(lastMsg))
        return "Our Brand Design pillar covers everything from logo creation and motion identity to full UI/UX design and product dashboard systems. We create premium visual identities that communicate value instantly. Check the Services section below for details.";

      if (/market|seo|paid|ads|google|meta|growth/.test(lastMsg))
        return "Our Digital Marketing pillar includes SEO & content strategy, paid advertising on Google/Meta/LinkedIn, brand positioning, and full-funnel growth systems. We engineer measurable outcomes, not just campaigns. Explore the Services section below.";

      if (/contact|email|phone|reach|talk|speak/.test(lastMsg))
        return "You can reach us at contact@fullstackbrand.co or call/WhatsApp +1 945-997-2019. Or scroll to the Start Your Project section below to send a project brief — we respond within 24 hours.";

      if (/process|how do you work|methodology|steps|workflow/.test(lastMsg))
        return "We follow a 7-stage process: Discovery → Strategy → Design → Development → AI Integration → Launch → Growth. Each stage has clear deliverables and weekly client demos so you're always in the loop. Scroll to How We Work below for the full breakdown.";

      if (/result|case|portfolio|project|success|achieve/.test(lastMsg))
        return "We've delivered 150+ projects across 12+ countries with consistent results — brands seeing 3–5× revenue growth, 60% faster time-to-market, and up to 80% ops automation. Every engagement is built for measurable outcomes, not just deliverables.";

      return "I'm the FullstackBrand AI Assistant — here to help you explore our web development, AI automation, branding, and digital marketing services. What would you like to know?";
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
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    const errorMsg = "I'm having a moment — something went wrong on my end. Please try again, or reach out directly at contact@fullstackbrand.co and we'll be happy to help!";
    return new Response(errorMsg, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
