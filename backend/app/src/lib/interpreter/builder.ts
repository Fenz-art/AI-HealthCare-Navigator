import { HealthDocument, HealthPassport, TravelHealthSession } from '@prisma/client';

// Prisma schema stores array fields as JSON strings — parse gracefully
function parseArr<T = string>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try { return JSON.parse(value) as T[]; } catch { return []; }
  }
  return [];
}

export function buildInterpreterContext(
  session: TravelHealthSession,
  healthPassport: HealthPassport | null,
  healthDocuments: HealthDocument[]
): string {
  const parts: string[] = [];

  const symptoms    = parseArr<string>(session.symptoms);
  const allergies   = parseArr<string>(session.allergies);
  const currentMeds = parseArr<string>(session.currentMeds);
  const medRecs     = parseArr<any>(session.medRecs);
  const providerRecs = parseArr<any>(session.providerRecs);
  const includedDocuments = parseArr<string>(session.includedDocuments);

  parts.push(`Patient Location: ${session.location ?? 'Unknown'}`);

  if (symptoms.length > 0) {
    parts.push(`Symptoms:\n${symptoms.map((s) => `- ${s}`).join('\n')}`);
  }

  if (allergies.length > 0) {
    parts.push(`Allergies:\n${allergies.map((a) => `- ${a}`).join('\n')}`);
  }

  if (currentMeds.length > 0) {
    parts.push(`Current Medications:\n${currentMeds.map((m) => `- ${m}`).join('\n')}`);
  }

  if (session.includedPassport && healthPassport) {
    const passportLines: string[] = [];

    if (healthPassport.bloodGroup) {
      passportLines.push(`Blood Group: ${healthPassport.bloodGroup}`);
    }

    const passportAllergies   = parseArr<string>(healthPassport.allergies);
    const passportMedications = parseArr<string>(healthPassport.currentMedications);
    const passportConditions  = parseArr<string>(healthPassport.chronicConditions);
    const passportVaccinations = parseArr<string>(healthPassport.vaccinations);
    const emergencyContacts = parseArr<{ name: string; phone: string; relation?: string }>(
      healthPassport.emergencyContacts
    );

    if (passportAllergies.length > 0)
      passportLines.push(`Passport Allergies:\n${passportAllergies.map((a) => `- ${a}`).join('\n')}`);
    if (passportMedications.length > 0)
      passportLines.push(`Passport Medications:\n${passportMedications.map((m) => `- ${m}`).join('\n')}`);
    if (passportConditions.length > 0)
      passportLines.push(`Chronic Conditions:\n${passportConditions.map((c) => `- ${c}`).join('\n')}`);
    if (passportVaccinations.length > 0)
      passportLines.push(`Vaccinations:\n${passportVaccinations.map((v) => `- ${v}`).join('\n')}`);
    if (emergencyContacts.length > 0)
      passportLines.push(
        `Emergency Contacts:\n${emergencyContacts
          .map((c) => `- ${c.name} (${c.relation ?? 'contact'}): ${c.phone}`)
          .join('\n')}`
      );

    if (passportLines.length > 0)
      parts.push(`Health Passport:\n${passportLines.join('\n')}`);
  }

  if (includedDocuments.length > 0) {
    const sharedDocs = healthDocuments.filter((doc) => includedDocuments.includes(doc.id));
    if (sharedDocs.length > 0) {
      const docsText = sharedDocs
        .map((doc) => {
          const text = doc.translatedText ?? doc.extractedText ?? 'No text available';
          return `- ${doc.title} (${doc.type}${doc.sourceCountry ? `, ${doc.sourceCountry}` : ''})\n${text}`;
        })
        .join('\n\n');
      parts.push(`Shared Medical Documents:\n${docsText}`);
    }
  }

  if (medRecs.length > 0) {
    parts.push(
      `Recommended Medication:\n${medRecs.map((r) => `- ${r.brand?.name ?? r.name} (${r.activeIngredient?.name ?? ''})`).join('\n')}`
    );
  }

  if (providerRecs.length > 0) {
    parts.push(
      `Recommended Provider:\n${providerRecs.map((r) => `- ${r.name} (${r.address})`).join('\n')}`
    );
  }

  return parts.join('\n\n');
}
