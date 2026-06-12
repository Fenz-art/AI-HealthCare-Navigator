import { z } from 'zod';
export declare const CreateSessionSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    countryCode: z.ZodOptional<z.ZodString>;
    symptoms: z.ZodArray<z.ZodString, "many">;
    duration: z.ZodOptional<z.ZodString>;
    allergies: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    currentMeds: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    includedPassport: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includedDocuments: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    lat: z.ZodOptional<z.ZodNumber>;
    lng: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    symptoms: string[];
    allergies: string[];
    currentMeds: string[];
    includedPassport: boolean;
    includedDocuments: string[];
    userId?: string | undefined;
    location?: string | undefined;
    countryCode?: string | undefined;
    duration?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
}, {
    symptoms: string[];
    userId?: string | undefined;
    location?: string | undefined;
    countryCode?: string | undefined;
    duration?: string | undefined;
    allergies?: string[] | undefined;
    currentMeds?: string[] | undefined;
    includedPassport?: boolean | undefined;
    includedDocuments?: string[] | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
}>;
export declare const WorkflowInputSchema: z.ZodObject<{
    sessionId: z.ZodString;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    countryCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    countryCode: string;
    lat: number;
    lng: number;
    sessionId: string;
}, {
    countryCode: string;
    lat: number;
    lng: number;
    sessionId: string;
}>;
export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
export type WorkflowRequestInput = z.infer<typeof WorkflowInputSchema>;
