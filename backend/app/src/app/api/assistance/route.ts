import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const RequestAssistanceSchema = z.object({
  sessionId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = RequestAssistanceSchema.parse(body);

    // Check if session exists
    const session = await prisma.travelHealthSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Upsert assistance request
    const request = await prisma.assistanceRequest.upsert({
      where: { sessionId },
      update: { status: 'PENDING' },
      create: {
        sessionId,
        status: 'PENDING',
      },
    });

    // System message
    await prisma.message.create({
      data: {
        sessionId,
        senderType: 'SYSTEM',
        content: 'Assistance requested. A CareCompass assistant will be with you shortly.',
      },
    });

    return NextResponse.json({ success: true, data: request });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Assistance request error:', error);
    return NextResponse.json({ success: false, error: 'Failed to request assistance' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const request = await prisma.assistanceRequest.findUnique({
      where: { sessionId },
      include: { messages: true },
    });

    return NextResponse.json({ success: true, data: request });
  } catch (error) {
    console.error('Assistance fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch assistance' }, { status: 500 });
  }
}
