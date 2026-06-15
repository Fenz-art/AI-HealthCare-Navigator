import { prisma } from '../db.js';
import type { OutcomeStatus } from '@prisma/client';
import { normalizeOptionalMedicationName } from './normalization.js';

export type JourneyLike = {
  id: string;
  userId: string;
  country: string;
  city: string | null;
  medicationId: string | null;
  providerId: string | null;
  interpreterUsed: boolean;
  outcomeStatus: OutcomeStatus;
  recoveryTimeDays: number | null;
  severity: string;
  condition?: string | null;
};

export function outcomeDaysToRecoveryDays(input: number | null | undefined): number | null {
  if (input == null) return null;
  if (!Number.isFinite(input)) return null;
  return Math.max(0, Math.floor(input));
}

export async function upsertOutcomeInsightForJourney(journey: JourneyLike) {
  const medication = normalizeOptionalMedicationName(journey.medicationId);
  const insightRows = [
    {
      insightType: 'RECOVERY_TREND' as const,
      condition: journey.condition ?? null,
      medication,
      country: journey.country,
      city: journey.city,
      outcomeStatus: journey.outcomeStatus,
      recoveryDays: outcomeDaysToRecoveryDays(journey.recoveryTimeDays),
      confidence: null,
      summary: null,
    },
    {
      insightType: 'MEDICATION_EFFECTIVENESS' as const,
      condition: journey.condition ?? null,
      medication,
      country: journey.country,
      city: journey.city,
      outcomeStatus: journey.outcomeStatus,
      recoveryDays: outcomeDaysToRecoveryDays(journey.recoveryTimeDays),
      confidence: null,
      summary: null,
    },
    {
      insightType: 'INTERPRETER_USAGE' as const,
      condition: journey.condition ?? null,
      medication,
      country: journey.country,
      city: journey.city,
      outcomeStatus: journey.outcomeStatus,
      recoveryDays: outcomeDaysToRecoveryDays(journey.recoveryTimeDays),
      confidence: null,
      summary: null,
    },
    {
      insightType: 'PROVIDER_PATTERN' as const,
      condition: journey.condition ?? null,
      medication,
      country: journey.country,
      city: journey.city,
      outcomeStatus: journey.outcomeStatus,
      recoveryDays: outcomeDaysToRecoveryDays(journey.recoveryTimeDays),
      confidence: null,
      summary: null,
    },
    {
      insightType: 'COUNTRY_PATTERN' as const,
      condition: journey.condition ?? null,
      medication,
      country: journey.country,
      city: journey.city,
      outcomeStatus: journey.outcomeStatus,
      recoveryDays: outcomeDaysToRecoveryDays(journey.recoveryTimeDays),
      confidence: null,
      summary: null,
    },
  ];

  await Promise.all(
    insightRows.map((row) =>
      prisma.outcomeInsight.upsert({
        where: {
          journeyId_insightType: {
            journeyId: journey.id,
            insightType: row.insightType,
          },
        },
        update: {
          userId: journey.userId,
          country: row.country,
          city: row.city,
          condition: row.condition,
          medication: row.medication,
          outcomeStatus: row.outcomeStatus,
          recoveryDays: row.recoveryDays,
          confidence: row.confidence,
          summary: row.summary,
        },
        create: {
          userId: journey.userId,
          journeyId: journey.id,
          insightType: row.insightType,
          country: row.country,
          city: row.city,
          condition: row.condition,
          medication: row.medication,
          outcomeStatus: row.outcomeStatus,
          recoveryDays: row.recoveryDays,
          confidence: row.confidence,
          summary: row.summary,
        },
      })
    )
  );

}


