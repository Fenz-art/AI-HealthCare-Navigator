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
    severity: import(".prisma/client").$Enums.SeverityLevel | null;
    id: string;
    countryId: string | null;
    userId: string | null;
    location: string | null;
    symptoms: string[];
    duration: string | null;
    allergies: string[];
    currentMeds: string[];
    medRecs: import("@prisma/client/runtime/library").JsonValue | null;
    providerRecs: import("@prisma/client/runtime/library").JsonValue | null;
    interpreterContext: string | null;
    outcome: import("@prisma/client/runtime/library").JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
}>;
