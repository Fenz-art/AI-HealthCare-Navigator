import { prisma } from '../db.js';
import { outcomeDaysToRecoveryDays } from './aggregator.js';
import { normalizeMedicationName } from './normalization.js';


export type AvgWithCount = { avg: number | null; count: number };

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export async function computeRecoveryStatsForJourneys(journeyIds: string[]): Promise<AvgWithCount> {
  const rows = await prisma.healthcareJourney.findMany({
    where: { id: { in: journeyIds } },
    select: { recoveryTimeDays: true },
  });

  const numbers = rows
    .map((r) => outcomeDaysToRecoveryDays(r.recoveryTimeDays))
    .filter((x): x is number => x != null);

  return { avg: avg(numbers), count: numbers.length };
}

export async function generateJourneyInsights(journeyId: string) {
  const journey = await prisma.healthcareJourney.findUnique({
    where: { id: journeyId },
    select: {
      id: true,
      userId: true,
      country: true,
      city: true,
      medicationId: true,
      providerId: true,
      interpreterUsed: true,
      outcomeStatus: true,
      recoveryTimeDays: true,
      severity: true,
      symptoms: true,
    },
  });
  if (!journey) throw new Error('Journey not found');

  // condition extraction from symptoms JSON is left conservative:
  // symptoms are already collected; we won't hallucinate diagnosis.
  let condition: string | null = null;
  try {
    if (Array.isArray(journey.symptoms) && journey.symptoms.length > 0) condition = String(journey.symptoms[0]);
  } catch {
    // ignore
  }

  // Insert OutcomeInsight rows (aggregations computed later)
  // aggregator.ts will insert per insightType rows.
  const { upsertOutcomeInsightForJourney } = await import('./aggregator.js');

  const medicationId = normalizeMedicationName(journey.medicationId ?? '');

  await upsertOutcomeInsightForJourney({
    id: journey.id,
    userId: journey.userId,
    country: journey.country,
    city: journey.city,
    medicationId: medicationId || null,
    providerId: journey.providerId,
    interpreterUsed: journey.interpreterUsed,
    outcomeStatus: journey.outcomeStatus,
    recoveryTimeDays: journey.recoveryTimeDays,
    severity: journey.severity,
    condition,
  });

  // Update provider outcome aggregates if providerId exists
  if (journey.providerId) {
    await generateProviderInsights(journey.providerId);
  }

  // Update medication aggregate if medicationId exists
  if (medicationId) {
    await generateMedicationInsights(medicationId);
  }

  // (country/user summaries are computed via endpoints using raw data for now)
  return { success: true };
}

export async function generateMedicationInsights(medicationId: string) {
  const normalizedMedicationId = normalizeMedicationName(medicationId);
  if (!normalizedMedicationId) return { success: true, count: 0 };

  const rows = await prisma.healthcareJourney.findMany({
    where: {
      medicationId: normalizedMedicationId,
      recoveryTimeDays: { not: null },
    },
    select: {
      country: true,
      outcomeStatus: true,
      recoveryTimeDays: true,
    },
  });


  // We don't have a condition column in HealthcareJourney.
  // MedicationOutcome is still created using outcomeStatus + country.
  // Clear and recreate is expensive; but for now we create records as signals.
  // Later we can switch to upsert with unique constraints.
  await prisma.medicationOutcome.createMany({
    data: rows.map((r) => ({
      id: undefined,
      medicationId: normalizedMedicationId,
      country: r.country,
      condition: null,
      outcomeStatus: r.outcomeStatus,
      recoveryDays: r.recoveryTimeDays,
      createdAt: new Date(),
    })),
  });

  return { success: true, count: rows.length };
}

export async function generateProviderInsights(providerId: string) {
  const rows = await prisma.healthcareJourney.findMany({
    where: {
      providerId: providerId,
      recoveryTimeDays: { not: null },
    },
    select: {
      id: true,
      interpreterUsed: true,
      recoveryTimeDays: true,
    },
  });

  const interpreterUsedCount = rows.filter((r) => r.interpreterUsed).length;
  const recoveryNumbers = rows
    .map((r) => outcomeDaysToRecoveryDays(r.recoveryTimeDays))
    .filter((x): x is number => x != null);
  const avgRecovery = recoveryNumbers.length === 0
    ? null
    : recoveryNumbers.reduce((a, b) => a + b, 0) / recoveryNumbers.length;

  const journeysCount = rows.length;

  await prisma.providerOutcome.upsert({
    where: { providerId },
    update: {
      journeys: journeysCount,
      interpreterUsageRate: journeysCount === 0 ? 0 : interpreterUsedCount / journeysCount,
      avgRecoveryDays: avgRecovery,
      updatedAt: new Date(),
    },
    create: {
      providerId,
      journeys: journeysCount,
      interpreterUsageRate: journeysCount === 0 ? 0 : interpreterUsedCount / journeysCount,
      avgRecoveryDays: avgRecovery,
      updatedAt: new Date(),
    },
  });

  return { success: true };
}

