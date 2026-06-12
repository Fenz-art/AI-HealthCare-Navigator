export declare function determineSeverity(symptoms: string[], duration: string, allergies: string[], currentMeds: string[]): Promise<{
    severity: "SELF_CARE" | "PHARMACY" | "CLINIC" | "HOSPITAL" | "EMERGENCY";
    reasoning: string;
    suggestedAction: string;
}>;
