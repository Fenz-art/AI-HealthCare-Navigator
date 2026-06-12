import { Prisma, ProviderType, SeverityLevel } from '@prisma/client';
import { prisma } from '@/lib/db';
import { determineSeverity, SeverityResult } from '@/lib/severity/engine';
import { extractActiveIngredients } from '@/lib/medications/extractor';
import { findLocalEquivalents } from '@/lib/medications/repository';
import { findNearbyProviders } from '@/lib/providers/geoapify';
import { buildInterpreterContext } from '@/lib/interpreter/builder';
import { getTargetLanguage, translateInterpreterContext } from '@/lib/interpreter/translator';

export type WorkflowAction =
  | 'SELF_CARE'
  | 'CALL_EMERGENCY_SERVICES'
  | 'PHARMACY'
  | 'CLINIC'
  | 'HOSPITAL';

export interface WorkflowInput {
  sessionId: string;
  lat: number;
  lng: number;
  countryCode: string;
}

export interface WorkflowResult {
  sessionId: string;
  severity: SeverityResult;
  action: WorkflowAction;
  medications: unknown[];
  providers: unknown[];
  interpreterContext: string;
  interpreterContextTranslated: string;
  targetLanguage: string;
}

function severityToProviderType(severity: SeverityLevel): ProviderType | null {
  switch (severity) {
    case 'PHARMACY':
      return 'PHARMACY';
    case 'CLINIC':
      return 'CLINIC';
    case 'HOSPITAL':
    case 'EMERGENCY':
      return 'HOSPITAL';
    default:
      return null;
  }
}

function severityToAction(severity: SeverityLevel): WorkflowAction {
  switch (severity) {
    case 'SELF_CARE':
      return 'SELF_CARE';
    case 'EMERGENCY':
      return 'CALL_EMERGENCY_SERVICES';
    case 'PHARMACY':
      return 'PHARMACY';
    case 'CLINIC':
      return 'CLINIC';
    case 'HOSPITAL':
      return 'HOSPITAL';
    default:
      return 'CLINIC';
  }
}

function dedupeMedications(meds: unknown[]): unknown[] {
  const seen = new Set<string>();
  return meds.filter((med: any) => {
    const key = med?.brand?.id ?? med?.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function executeWorkflow(input: WorkflowInput): Promise<WorkflowResult> {
  const session = await prisma.travelHealthSession.findUnique({
    where: { id: input.sessionId },
    include: {
      country: true,
      user: {
        include: {
          healthPassport: true,
          healthDocuments: true,
        }
      }
    }
  });

  if (!session) {
    throw new Error('Session not found');
  }

  const countryCode = input.countryCode.toUpperCase();

  const severityResult = await determineSeverity(
    (session.symptoms as string[]) ?? [],
    session.duration ?? 'Unknown',
    (session.allergies as string[]) ?? [],
    (session.currentMeds as string[]) ?? []
  );

  const action = severityToAction(severityResult.severity);
  let medRecs: unknown[] = [];
  let providerRecs: unknown[] = [];

  if (severityResult.severity === 'PHARMACY') {
    const activeIngredients = await extractActiveIngredients(session.symptoms as string[]);

    for (const ingredient of activeIngredients) {
      const equivalents = await findLocalEquivalents(ingredient, countryCode);
      medRecs.push(...equivalents);
    }

    medRecs = dedupeMedications(medRecs);
    providerRecs = await findNearbyProviders(input.lat, input.lng, 'PHARMACY');
  } else if (severityResult.severity === 'CLINIC') {
    providerRecs = await findNearbyProviders(input.lat, input.lng, 'CLINIC');
  } else if (
    severityResult.severity === 'HOSPITAL' ||
    severityResult.severity === 'EMERGENCY'
  ) {
    providerRecs = await findNearbyProviders(input.lat, input.lng, 'HOSPITAL');
  }

  const sessionWithRecs = {
    ...session,
    severity: severityResult.severity,
    medRecs,
    providerRecs,
    location: session.location ?? undefined
  };

  const interpreterContext = buildInterpreterContext(
    sessionWithRecs as any,
    session.user?.healthPassport ?? null,
    session.user?.healthDocuments ?? []
  );
  const interpreterContextTranslated = await translateInterpreterContext(
    interpreterContext,
    countryCode
  );

  await prisma.travelHealthSession.update({
    where: { id: input.sessionId },
    data: {
      severity: severityResult.severity,
      lat: input.lat,
      lng: input.lng,
      medRecs: medRecs.length > 0 ? (medRecs as Prisma.InputJsonValue) : undefined,
      providerRecs:
        providerRecs.length > 0 ? (providerRecs as Prisma.InputJsonValue) : undefined,
      interpreterContext,
      interpreterContextTranslated,
      country: { connect: { code: countryCode } }
    }
  });

  return {
    sessionId: input.sessionId,
    severity: severityResult,
    action,
    medications: medRecs,
    providers: providerRecs,
    interpreterContext,
    interpreterContextTranslated,
    targetLanguage: getTargetLanguage(countryCode)
  };
}

export { severityToProviderType };
