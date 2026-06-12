import { z } from 'zod';
export const CreateSessionSchema = z.object({
    userId: z.string().cuid().optional(),
    location: z.string().min(1).optional(),
    countryCode: z.string().length(2).optional(),
    symptoms: z.array(z.string().min(1)).min(1, 'At least one symptom is required'),
    duration: z.string().optional(),
    allergies: z.array(z.string()).optional().default([]),
    currentMeds: z.array(z.string()).optional().default([]),
    includedPassport: z.boolean().optional().default(false),
    includedDocuments: z.array(z.string()).optional().default([]),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional()
});
export const WorkflowInputSchema = z.object({
    sessionId: z.string().cuid(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    countryCode: z.string().length(2)
});
//# sourceMappingURL=schema.js.map