// FullstackBrand
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional().default('N/A'),
  services: z.string(),
  budget: z.number(),
  timeline: z.string()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = LeadSchema.parse(body);

    const projectId = `FSB-${Date.now().toString(36).toUpperCase()}`;

    const lead = await prisma.lead.create({
      data: { ...validated, projectId }
    });

    return NextResponse.json({ success: true, projectId: lead.projectId, lead });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Invalid submission' }, { status: 400 });
  }
}