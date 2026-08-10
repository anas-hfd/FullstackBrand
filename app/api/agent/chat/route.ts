import { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `You are the official AI Assistant for FullstackBrand (fullstackbrand.co) — an elite AI-powered full-stack digital agency.

COMPANY IDENTITY:
- Name: FullstackBrand | Email: contact@fullstackbrand.co | Phone: +1 945-997-2019
- Tagline: "We Build Intelligent Digital Brands"
- Location: 1309 Coffeen Avenue STE 1200, Sheridan, Wyoming 82801, USA

CREDENTIALS:
- 150+ Projects Delivered | 99.9% Uptime | <2s Load Times | 40+ AI Models integrated

SERVICES (4 Pillars):
1. Brand Design & Visual Identity — Logo, motion identity, UI/UX, product design
2. Digital Marketing & Brand Strategy — SEO, content, paid ads (Google/Meta/LinkedIn), growth funnels
3. Web Development — Websites, SaaS dashboards, mobile apps, e-commerce (Next.js/React)
4. AI Automation — Workflow automation, AI agents, chatbots, custom LLM products

HOW WE WORK (7 steps): Discovery → Strategy → Design → Development → AI Integration → Launch → Growth

PRICING ESTIMATES:
- Web Development: $3,000–$12,000+
- AI Agents & Automation: $5,000–$15,000+
- Branding: $2,000–$8,000+
- Digital Marketing: $4,000+/month

PAGE SECTIONS TO REFERENCE (never say "visit website", you ARE on the site):
- Services → scroll to #services
- Our Process → scroll to #process
- AI Automation → scroll to #ai
- Start a Project / Contact → scroll to #start

STRICT RULES:
- ONLY answer questions about FullstackBrand services, pricing, process, and capabilities.
- For off-topic questions (coding help, recipes, math, etc.): "I'm trained exclusively for FullstackBrand. Head to our Services section or Start a Project to discuss your needs!"
- Keep answers SHORT, direct, and action-oriented (2–4 sentences max).
- Always end with a clear next action (e.g., "Scroll to #start to kick off your project" or "Check the Services section below").
- Tone: confident, futuristic, premium — like a top-tier agency consultant.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const geminiApiKey = process.env.GEMINI_API_KEY?.replace(/[\"']/g, '').trim();
    const openAiApiKey = process.env.OPENAI_API_KEY?.replace(/[\"']/g, '').trim();

    // ─── 1. Google Gemini (primary — fastest, uses streaming generateContent) ───
    if (geminiApiKey && geminiApiKey.length > 5) {
      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Try models in priority order — fastest first
      const candidateModels = [
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
      ];

      for (const model of candidateModels) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: formattedContents,
                generationConfig: {
                  maxOutputTokens: 256,
                  temperature: 0.5,
                  topP: 0.85,
                },
              }),
            }
          );

          if (res.ok && res.body) {
            // Stream SSE from Gemini directly to client as plain text
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
                    const token =
                      parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                    if (token) {
                      controller.enqueue(encoder.encode(token));
                    }
                  } catch {
                    // Skip malformed SSE chunks
                  }
                }
              },
            });

            return new Response(res.body.pipeThrough(transformStream), {
              headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Accel-Buffering': 'no',
                'Cache-Control': 'no-cache',
              },
            });
          } else {
            const errText = await res.text().catch(() => '');
            console.warn(`Gemini model ${model} failed (${res.status}):`, errText);
          }
        } catch (e) {
          console.error(`Fetch error for model ${model}:`, e);
        }
      }

      // All Gemini attempts failed — fall through to OpenAI or mock
      console.error('All Gemini streaming models failed.');
    }

    // ─── 2. OpenAI (fallback — streaming) ────────────────────────────────────
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
          max_tokens: 256,
          temperature: 0.5,
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

    // ─── 3. Mock fallback (no API key) ────────────────────────────────────────
    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let mockResponse =
      lastUserMsg.includes('price') || lastUserMsg.includes('cost')
        ? 'Our pricing starts at $3,000 for web projects and $5,000 for AI automation. Scroll to the **Start Your Project** form below for a tailored quote!'
        : lastUserMsg.includes('service') || lastUserMsg.includes('what do')
        ? 'We offer Brand Design, Digital Marketing, Web Development, and AI Automation. Check the **Services** section below for full details!'
        : lastUserMsg.includes('contact') || lastUserMsg.includes('reach')
        ? 'Reach us at contact@fullstackbrand.co or +1 945-997-2019. Or scroll to **#start** to send a project brief!'
        : 'FullstackBrand builds intelligent digital ecosystems — web apps, AI agents, branding & marketing. Ready to start? Scroll to **#start**! *(Add GEMINI_API_KEY to .env.local for live AI)*';

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const words = mockResponse.split(' ');
        words.forEach((word, i) => {
          setTimeout(() => {
            controller.enqueue(encoder.encode((i === 0 ? '' : ' ') + word));
            if (i === words.length - 1) controller.close();
          }, 40 * i);
        });
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
