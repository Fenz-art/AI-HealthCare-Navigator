export declare function getOutcomeInsightsByUser(userId: string): Promise<{
    userId: string;
    id: string;
    country: string | null;
    journeyId: string;
    insightType: import(".prisma/client").$Enums.InsightType;
    city: string | null;
    condition: string | null;
    medication: string | null;
    outcomeStatus: import(".prisma/client").$Enums.OutcomeStatus;
    recoveryDays: number | null;
    confidence: number | null;
    summary: string | null;
    generatedAt: Date;
}[]>;
export declare function getOutcomeInsightsByJourney(journeyId: string): Promise<{
    userId: string;
    id: string;
    country: string | null;
    journeyId: string;
    insightType: import(".prisma/client").$Enums.InsightType;
    city: string | null;
    condition: string | null;
    medication: string | null;
    outcomeStatus: import(".prisma/client").$Enums.OutcomeStatus;
    recoveryDays: number | null;
    confidence: number | null;
    summary: string | null;
    generatedAt: Date;
}[]>;
export declare function getOutcomeInsightsByCountry(country: string): Promise<{
    userId: string;
    id: string;
    country: string | null;
    journeyId: string;
    insightType: import(".prisma/client").$Enums.InsightType;
    city: string | null;
    condition: string | null;
    medication: string | null;
    outcomeStatus: import(".prisma/client").$Enums.OutcomeStatus;
    recoveryDays: number | null;
    confidence: number | null;
    summary: string | null;
    generatedAt: Date;
}[]>;
export declare function getMedicationOutcomesByMedication(medicationId: string): Promise<{
    id: string;
    createdAt: Date;
    country: string;
    condition: string | null;
    outcomeStatus: import(".prisma/client").$Enums.OutcomeStatus;
    recoveryDays: number | null;
    medicationId: string;
}[]>;
export declare function getProviderOutcome(providerId: string): Promise<{
    id: string;
    updatedAt: Date;
    providerId: string;
    journeys: number;
    interpreterUsageRate: number;
    avgRecoveryDays: number | null;
} | null>;
export declare function getUserOutcomeSummary(userId: string): Promise<{
    journeys: number;
    avgRecoveryDays: number | null;
    interpreterUsage: number;
    topCountries: {
        country: string;
        count: number;
    }[];
    topConditions: {
        condition: string;
        count: number;
    }[];
    topMedications: {
        medicationId: string;
        count: number;
    }[];
}>;
