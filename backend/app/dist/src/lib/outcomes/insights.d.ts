export type AvgWithCount = {
    avg: number | null;
    count: number;
};
export declare function computeRecoveryStatsForJourneys(journeyIds: string[]): Promise<AvgWithCount>;
export declare function generateJourneyInsights(journeyId: string): Promise<{
    success: boolean;
}>;
export declare function generateMedicationInsights(medicationId: string): Promise<{
    success: boolean;
    count: number;
}>;
export declare function generateProviderInsights(providerId: string): Promise<{
    success: boolean;
}>;
