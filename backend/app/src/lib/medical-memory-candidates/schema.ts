import { z } from 'zod';
import type { MemoryType } from '@prisma/client';

export const approveMemoryCandidateParamsSchema = z.object({
  candidateId: z.string().min(1),
});

export const createMemoryCandidateInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1).optional().nullable(),
  memoryType: z.string() as z.ZodType<MemoryType>,
  value: z.string().min(1),
  source: z.string().optional(),
  confidence: z.number().optional(),
  context: z.string().optional().nullable(),
  status: z.string().optional(),
});

