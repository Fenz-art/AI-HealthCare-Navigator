import { z } from 'zod';
export declare const SeverityOutputSchema: z.ZodObject<{
    severity: z.ZodEnum<["SELF_CARE", "PHARMACY", "CLINIC", "HOSPITAL", "EMERGENCY"]>;
    reasoning: z.ZodString;
    suggestedAction: z.ZodString;
}, "strip", z.ZodTypeAny, {
    severity: "PHARMACY" | "CLINIC" | "HOSPITAL" | "SELF_CARE" | "EMERGENCY";
    reasoning: string;
    suggestedAction: string;
}, {
    severity: "PHARMACY" | "CLINIC" | "HOSPITAL" | "SELF_CARE" | "EMERGENCY";
    reasoning: string;
    suggestedAction: string;
}>;
export type SeverityOutput = z.infer<typeof SeverityOutputSchema>;
