import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are the FullstackBrand Sales & Agency Assistant. 
You help clients understand our services: Branding, Marketing, Web Development, Design, AI Agents, AI Automation, and Digital Marketing. 
Be concise, futuristic, and helpful. Guide them to book a strategy call or use the project configurator.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // Fallback Mock Streaming if no API key is provided
  if (!process.env.OPENAI_API_KEY) {
    const mockResponse = `Based on your request, an AI Agent integration typically ranges from $5k-$15k depending on complexity. We use LangChain and OpenAI to build autonomous workflows. Would you like me to draft a high-level architecture plan? *(Mock response - add OPENAI_API_KEY to .env for live AI)*`;
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        mockResponse.split('').forEach((char, i) => {
          setTimeout(() => {
            controller.enqueue(encoder.encode(char));
            if (i === mockResponse.length - 1) controller.close();
          }, 20 * i);
        });
      },
    });
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // Live OpenAI response using native fetch to avoid SDK version conflicts
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        stream: true,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      })
    });

    return new Response(res.body, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    return new Response('Error connecting to AI', { status: 500 });
  }
}
