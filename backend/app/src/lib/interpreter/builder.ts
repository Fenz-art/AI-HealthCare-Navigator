import { TravelHealthSession } from '@prisma/client';

export function buildInterpreterContext(session: TravelHealthSession): string {
  const parts: string[] = [];

  parts.push(`Patient Location: ${session.location ?? 'Unknown'}`);

  if (session.symptoms.length > 0) {
    parts.push(`Symptoms:\n${session.symptoms.map((s: string) => `- ${s}`).join('\n')}`);
  }

  if (session.allergies.length > 0) {
    parts.push(`Allergies:\n${session.allergies.map((a: string) => `- ${a}`).join('\n')}`);
  }

  if (session.currentMeds.length > 0) {
    parts.push(`Current Medications:\n${session.currentMeds.map((m: string) => `- ${m}`).join('\n')}`);
  }

  if (Array.isArray(session.medRecs) && session.medRecs.length > 0) {
    const recs = session.medRecs as any[];
    parts.push(
      `Recommended Medication:\n${recs.map((r) => `- ${r.brand.name} (${r.activeIngredient.name})`).join('\n')}`
    );
  }

  if (Array.isArray(session.providerRecs) && session.providerRecs.length > 0) {
    const recs = session.providerRecs as any[];
    parts.push(
      `Recommended Provider:\n${recs.map((r) => `- ${r.name} (${r.address})`).join('\n')}`
    );
  }

  return parts.join('\n\n');
}
