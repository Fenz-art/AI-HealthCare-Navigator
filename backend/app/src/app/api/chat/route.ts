import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const SendMessageSchema = z.object({
  sessionId: z.string(),
  content: z.string().min(1),
  senderType: z.enum(['TRAVELER', 'ASSISTANT']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, content, senderType } = SendMessageSchema.parse(body);

    const message = await prisma.message.create({
      data: {
        sessionId,
        content,
        senderType,
      },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Message creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Message fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}
