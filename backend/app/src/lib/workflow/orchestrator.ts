import { prisma } from '../db.js';
import { determineSeverity, SeverityResult } from '../severity/engine.js';
import { extractActiveIngredients } from '../medications/extractor.js';
import { findLocalEquivalents } from '../medications/repository.js';
import { findNearbyProviders, ProviderType } from '../providers/geoapify.js';
import { buildInterpreterContext } from '../interpreter/builder.js';
import { getTargetLanguage, translateInterpreterContext } from '../interpreter/translator.js';

// SeverityLevel — matches the string values stored in the Prisma schema
type SeverityLevel = 'SELF_CARE' | 'PHARMACY' | 'CLINIC' | 'HOSPITAL' | 'EMERGENCY';

export type WorkflowAction =
  | 'SELF_CARE'
  | 'CALL_EMERGENCY_SERVICES'
  | 'PHARMACY'
  | 'CLINIC'
  | 'HOSPITAL';

export interface WorkflowInput {
  sessionId:   string;
  lat:         number;
  lng:         number;
  countryCode: string;
}

export interface WorkflowResult {
  sessionId:                    string;
  severity:                     SeverityResult;
  action:                       WorkflowAction;
  medications:                  unknown[];
  providers:                    unknown[];
  interpreterContext:           string;
  interpreterContextTranslated: string;
  targetLanguage:               string;
}

// Helper — parse a JSON-string field back to array
function parseArr<T = unknown>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try { return JSON.parse(value) as T[]; } catch { return []; }
  }
  return [];
}

function severityToProviderType(severity: SeverityLevel): ProviderType | null {
  switch (severity) {
    case 'PHARMACY':  return 'PHARMACY';
    case 'CLINIC':    return 'CLINIC';
    case 'HOSPITAL':
    case 'EMERGENCY': return 'HOSPITAL';
    default:          return null;
  }
}

function severityToAction(severity: SeverityLevel): WorkflowAction {
  switch (severity) {
    case 'SELF_CARE':  return 'SELF_CARE';
    case 'EMERGENCY':  return 'CALL_EMERGENCY_SERVICES';
    case 'PHARMACY':   return 'PHARMACY';
    case 'CLINIC':     return 'CLINIC';
    case 'HOSPITAL':   return 'HOSPITAL';
    default:           return 'CLINIC';
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
    where:   { id: input.sessionId },
    include: {
      country: true,
      user: {
        include: {
          healthPassport:  true,
          healthDocuments: true,
        },
      },
    },
  });

  if (!session) throw new Error('Session not found');

  const countryCode = input.countryCode.toUpperCase();

  // Deserialise JSON-string fields
  const symptoms    = parseArr<string>(session.symptoms);
  const allergies   = parseArr<string>(session.allergies);
  const currentMeds = parseArr<string>(session.currentMeds);

  const severityResult = await determineSeverity(
    symptoms,
    session.duration ?? 'Unknown',
    allergies,
    currentMeds,
  );

  const action        = severityToAction(severityResult.severity as SeverityLevel);
  let medRecs:      unknown[] = [];
  let providerRecs: unknown[] = [];

  if (severityResult.severity === 'PHARMACY') {
    const activeIngredients = await extractActiveIngredients(symptoms);
    for (const ingredient of activeIngredients) {
      const equivalents = await findLocalEquivalents(ingredient, countryCode);
      medRecs.push(...equivalents);
    }
    medRecs     = dedupeMedications(medRecs);
    providerRecs = await findNearbyProviders(input.lat, input.lng, 'PHARMACY');
  } else if (severityResult.severity === 'CLINIC') {
    providerRecs = await findNearbyProviders(input.lat, input.lng, 'CLINIC');
  } else if (severityResult.severity === 'HOSPITAL' || severityResult.severity === 'EMERGENCY') {
    providerRecs = await findNearbyProviders(input.lat, input.lng, 'HOSPITAL');
  }

  // Build interpreter context (builder accepts raw session but reads fields via parseArr internally)
  const sessionForContext = { ...session, medRecs, providerRecs };
  const interpreterContext = buildInterpreterContext(
    sessionForContext as any,
    session.user?.healthPassport ?? null,
    session.user?.healthDocuments ?? [],
  );
  const interpreterContextTranslated = await translateInterpreterContext(
    interpreterContext,
    countryCode,
  );

  // Persist results — stored as JSON strings
  await prisma.travelHealthSession.update({
    where: { id: input.sessionId },
    data: {
      severity:                     severityResult.severity,
      lat:                          input.lat,
      lng:                          input.lng,
      medRecs:                      medRecs.length > 0      ? JSON.stringify(medRecs)      : undefined,
      providerRecs:                 providerRecs.length > 0 ? JSON.stringify(providerRecs) : undefined,
      interpreterContext,
      interpreterContextTranslated,
      country: { connect: { code: countryCode } },
    },
  });

  return {
    sessionId:                    input.sessionId,
    severity:                     severityResult,
    action,
    medications:                  medRecs,
    providers:                    providerRecs,
    interpreterContext,
    interpreterContextTranslated,
    targetLanguage:               getTargetLanguage(countryCode),
  };
}

export { severityToProviderType };
