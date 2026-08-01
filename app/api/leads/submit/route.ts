// FullstackBrand
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional().default('N/A'),
  services: z.string(),
  budget: z.number(),
  timeline: z.string()
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = LeadSchema.parse(body);

    // Generate a unique project ID for this lead
    const projectId = `FSB-${Date.now().toString(36).toUpperCase()}`;

    // Log lead data (in production, forward to CRM/email/webhook)
    console.log('[Lead Submitted]', { projectId, ...validated });

    return NextResponse.json({
      success: true,
      projectId,
      lead: { ...validated, projectId, createdAt: new Date().toISOString() }
    });
  } catch (error) {
    console.error('[Lead Error]', error);
    return NextResponse.json({ success: false, error: 'Invalid submission' }, { status: 400 });
  }
}