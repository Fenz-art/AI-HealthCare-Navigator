import { z } from 'zod';
export declare const OutcomeSchema: z.ZodObject<{
    receivedHelp: z.ZodBoolean;
    purchasedMedication: z.ZodBoolean;
    symptomsImproved: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    receivedHelp: boolean;
    purchasedMedication: boolean;
    symptomsImproved: boolean;
}, {
    receivedHelp: boolean;
    purchasedMedication: boolean;
    symptomsImproved: boolean;
}>;
export type OutcomeInput = z.infer<typeof OutcomeSchema>;
export declare function recordOutcome(sessionId: string, data: OutcomeInput): Promise<{
    userId: string | null;
    location: string | null;
    symptoms: string;
    duration: string | null;
    allergies: string;
    currentMeds: string;
    includedPassport: boolean;
    includedDocuments: string | null;
    lat: number | null;
    lng: number | null;
    id: string;
    caseId: string;
    countryId: string | null;
    severity: string | null;
    medRecs: string | null;
    providerRecs: string | null;
    interpreterContext: string | null;
    interpreterContextTranslated: string | null;
    outcome: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function generateInsightsForJourney(journeyId: string): Promise<{
    success: boolean;
}>;
