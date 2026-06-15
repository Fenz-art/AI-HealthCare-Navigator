import { z } from 'zod';
import type { MemoryType } from '@prisma/client';
export declare const approveMemoryCandidateParamsSchema: z.ZodObject<{
    candidateId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    candidateId: string;
}, {
    candidateId: string;
}>;
export declare const createMemoryCandidateInputSchema: z.ZodObject<{
    userId: z.ZodString;
    sessionId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    memoryType: z.ZodType<MemoryType>;
    value: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
    confidence: z.ZodOptional<z.ZodNumber>;
    context: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    value: string;
    memoryType: import(".prisma/client").$Enums.MemoryType;
    status?: string | undefined;
    sessionId?: string | null | undefined;
    confidence?: number | undefined;
    source?: string | undefined;
    context?: string | null | undefined;
}, {
    userId: string;
    value: string;
    memoryType: import(".prisma/client").$Enums.MemoryType;
    status?: string | undefined;
    sessionId?: string | null | undefined;
    confidence?: number | undefined;
    source?: string | undefined;
    context?: string | null | undefined;
}>;
