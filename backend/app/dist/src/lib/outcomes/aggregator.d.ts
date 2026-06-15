import type { OutcomeStatus } from '@prisma/client';
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
export declare function outcomeDaysToRecoveryDays(input: number | null | undefined): number | null;
export declare function upsertOutcomeInsightForJourney(journey: JourneyLike): Promise<void>;
