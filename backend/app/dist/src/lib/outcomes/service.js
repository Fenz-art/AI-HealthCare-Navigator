import { prisma } from '@/lib/db';
import { z } from 'zod';
export const OutcomeSchema = z.object({
    receivedHelp: z.boolean(),
    purchasedMedication: z.boolean(),
    symptomsImproved: z.boolean()
});
export async function recordOutcome(sessionId, data) {
    const payload = OutcomeSchema.parse(data);
    return prisma.travelHealthSession.update({
        where: { id: sessionId },
        data: { outcome: payload }
    });
}
//# sourceMappingURL=service.js.map