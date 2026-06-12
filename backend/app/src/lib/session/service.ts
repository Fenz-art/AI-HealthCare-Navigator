import { prisma } from '@/lib/db';
import { getTargetLanguage } from '@/lib/interpreter/translator';
import { CreateSessionInput } from '@/lib/session/schema';
import { generateCaseId } from '@/lib/session/case-id';

export async function createTravelHealthSession(input: CreateSessionInput) {
  const data: Parameters<typeof prisma.travelHealthSession.create>[0]['data'] = {
    caseId: generateCaseId(),
    symptoms: input.symptoms,
    duration: input.duration,
    allergies: input.allergies ?? [],
    currentMeds: input.currentMeds ?? [],
    includedPassport: input.includedPassport ?? false,
    includedDocuments:
      input.includedDocuments && input.includedDocuments.length > 0
        ? input.includedDocuments
        : undefined,
    lat: input.lat,
    lng: input.lng,
  };

  if (input.userId) {
    data.userId = input.userId;
  }

  if (input.location) {
    data.location = input.location;
  }

  if (input.countryCode) {
    data.country = { connect: { code: input.countryCode.toUpperCase() } };
  }

  return prisma.travelHealthSession.create({ data });
}

export async function getTravelHealthSession(sessionId: string) {
  const session = await prisma.travelHealthSession.findUnique({
    where: { id: sessionId },
    include: { country: true }
  });

  if (!session) {
    return null;
  }

  const countryCode = session.country?.code ?? null;

  return {
    ...session,
    countryCode,
    targetLanguage: countryCode ? getTargetLanguage(countryCode) : 'English'
  };
}
