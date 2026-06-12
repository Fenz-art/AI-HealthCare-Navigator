import { ProviderType } from '@prisma/client';
import { prisma } from '@/lib/db';
import { determineSeverity } from '@/lib/severity/engine';
import { findLocalEquivalents } from '@/lib/medications/repository';
import { findNearbyProviders } from '@/lib/providers/geoapify';
import { buildInterpreterContext } from '@/lib/interpreter/builder';

export interface CreateSessionInput {
  userId?: string;
  location?: string;
  countryCode?: string;
  symptoms: string[];
  duration?: string;
  allergies?: string[];
  currentMeds?: string[];
  activeIngredient?: string;
  lat?: number;
  lng?: number;
  providerType?: ProviderType;
}

export async function createTravelHealthSession(input: CreateSessionInput) {
  const severity = await determineSeverity(
    input.symptoms,
    input.duration ?? 'Unknown',
    input.allergies ?? [],
    input.currentMeds ?? []
  );

  const medRecs = input.activeIngredient && input.countryCode
    ? await findLocalEquivalents(input.activeIngredient, input.countryCode)
    : [];

  const providerRecs = input.lat != null && input.lng != null && input.providerType
    ? await findNearbyProviders(input.lat, input.lng, input.providerType)
    : [];

  const createData: any = {
    symptoms: input.symptoms,
    duration: input.duration,
    allergies: input.allergies ?? [],
    currentMeds: input.currentMeds ?? [],
    severity: severity.severity,
    medRecs,
    providerRecs,
    interpreterContext: ''
  };

  if (input.userId) {
    createData.userId = input.userId;
  }

  if (input.location) {
    createData.location = input.location;
  }

  if (input.countryCode) {
    createData.country = { connect: { code: input.countryCode } };
  }

  const session = await prisma.travelHealthSession.create({
    data: createData
  });

  const interpreterContext = buildInterpreterContext({
    ...session,
    medRecs,
    providerRecs
  } as any);

  return prisma.travelHealthSession.update({
    where: { id: session.id },
    data: { interpreterContext }
  });
}
