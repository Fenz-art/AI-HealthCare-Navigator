import { prisma } from '../db.js';
export function outcomeDaysToRecoveryDays(input) {
    if (input == null)
        return null;
    if (!Number.isFinite(input))
        return null;
    return Math.max(0, Math.floor(input));
}
export async function upsertOutcomeInsightForJourney(journey) {
    // We store one row per (journeyId, insightType). Idempotency relies on
    // a UNIQUE(journeyId, insightType) constraint in Prisma.
    const insightRows = [
        {
            insightType: 'RECOVERY_TREND',
            condition: journey.condition ?? null,
            medication: journey.medicationId,
            country: journey.country,
            city: journey.city,
            outcomeStatus: journey.outcomeStatus,
            recoveryDays: outcomeDaysToRecoveryDays(journey.recoveryTimeDays),
            confidence: null,
            summary: null,
        },
        {
            insightType: 'MEDICATION_EFFECTIVENESS',
            condition: journey.condition ?? null,
            medication: journey.medicationId,
            country: journey.country,
            city: journey.city,
            outcomeStatus: journey.outcomeStatus,
            recoveryDays: outcomeDaysToRecoveryDays(journey.recoveryTimeDays),
            confidence: null,
            summary: null,
        },
        {
            insightType: 'INTERPRETER_USAGE',
            condition: journey.condition ?? null,
            medication: journey.medicationId,
            country: journey.country,
            city: journey.city,
            outcomeStatus: journey.outcomeStatus,
            recoveryDays: outcomeDaysToRecoveryDays(journey.recoveryTimeDays),
            confidence: null,
            summary: null,
        },
        {
            insightType: 'PROVIDER_PATTERN',
            condition: journey.condition ?? null,
            medication: journey.medicationId,
            country: journey.country,
            city: journey.city,
            outcomeStatus: journey.outcomeStatus,
            recoveryDays: outcomeDaysToRecoveryDays(journey.recoveryTimeDays),
            confidence: null,
            summary: null,
        },
        {
            insightType: 'COUNTRY_PATTERN',
            condition: journey.condition ?? null,
            medication: journey.medicationId,
            country: journey.country,
            city: journey.city,
            outcomeStatus: journey.outcomeStatus,
            recoveryDays: outcomeDaysToRecoveryDays(journey.recoveryTimeDays),
            confidence: null,
            summary: null,
        },
    ];
    await Promise.all(insightRows.map((row) => prisma.outcomeInsight.upsert({
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
    })));
}
//# sourceMappingURL=aggregator.js.map