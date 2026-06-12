import { z } from 'zod';

export const SeverityOutputSchema = z.object({
  severity: z.enum(['SELF_CARE', 'PHARMACY', 'CLINIC', 'HOSPITAL', 'EMERGENCY']),
  reasoning: z.string(),
  suggestedAction: z.string()
});

export type SeverityOutput = z.infer<typeof SeverityOutputSchema>;
