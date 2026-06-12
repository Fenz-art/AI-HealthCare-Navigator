import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateCaseId } from '@/lib/session/case-id';
import { z } from 'zod';

const CreateSessionSchema = z.object({
  symptoms: z.array(z.string().min(1)).min(1, "At least one symptom is required"),
  duration: z.string().optional().default("Unknown"),
  allergies: z.array(z.string()).optional().default([]),
  currentMeds: z.array(z.string()).optional().default([]),
  location: z.string().optional(),
  countryId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  userId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreateSessionSchema.parse(body);

    const session = await prisma.travelHealthSession.create({
      data: {
        caseId: generateCaseId(),
        symptoms: data.symptoms,
        duration: data.duration,
        allergies: data.allergies,
        currentMeds: data.currentMeds,
        location: data.location,
        countryId: data.countryId,
        lat: data.lat,
        lng: data.lng,
        userId: data.userId,
      },
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Session creation error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
