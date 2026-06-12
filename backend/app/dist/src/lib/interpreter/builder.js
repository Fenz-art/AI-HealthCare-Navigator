export function buildInterpreterContext(session, healthPassport, healthDocuments) {
    const parts = [];
    parts.push(`Patient Location: ${session.location ?? 'Unknown'}`);
    if (session.symptoms.length > 0) {
        parts.push(`Symptoms:\n${session.symptoms.map((s) => `- ${s}`).join('\n')}`);
    }
    if (session.allergies.length > 0) {
        parts.push(`Symptoms-related Allergies:\n${session.allergies.map((a) => `- ${a}`).join('\n')}`);
    }
    if (session.currentMeds.length > 0) {
        parts.push(`Current Medications:\n${session.currentMeds.map((m) => `- ${m}`).join('\n')}`);
    }
    if (session.includedPassport && healthPassport) {
        const passportLines = [];
        if (healthPassport.bloodGroup) {
            passportLines.push(`Blood Group: ${healthPassport.bloodGroup}`);
        }
        const passportAllergies = Array.isArray(healthPassport.allergies)
            ? healthPassport.allergies
            : [];
        const passportMedications = Array.isArray(healthPassport.currentMedications)
            ? healthPassport.currentMedications
            : [];
        const passportConditions = Array.isArray(healthPassport.chronicConditions)
            ? healthPassport.chronicConditions
            : [];
        const passportVaccinations = Array.isArray(healthPassport.vaccinations)
            ? healthPassport.vaccinations
            : [];
        const emergencyContacts = Array.isArray(healthPassport.emergencyContacts)
            ? healthPassport.emergencyContacts
            : [];
        if (passportAllergies.length > 0) {
            passportLines.push(`Passport Allergies:\n${passportAllergies.map((a) => `- ${a}`).join('\n')}`);
        }
        if (passportMedications.length > 0) {
            passportLines.push(`Passport Medications:\n${passportMedications.map((m) => `- ${m}`).join('\n')}`);
        }
        if (passportConditions.length > 0) {
            passportLines.push(`Chronic Conditions:\n${passportConditions.map((c) => `- ${c}`).join('\n')}`);
        }
        if (passportVaccinations.length > 0) {
            passportLines.push(`Vaccinations:\n${passportVaccinations.map((v) => `- ${v}`).join('\n')}`);
        }
        if (emergencyContacts.length > 0) {
            passportLines.push(`Emergency Contacts:\n${emergencyContacts.map((contact) => `- ${contact.name} (${contact.relation ?? 'contact'}): ${contact.phone}`).join('\n')}`);
        }
        if (passportLines.length > 0) {
            parts.push(`Health Passport:\n${passportLines.join('\n')}`);
        }
    }
    if (Array.isArray(session.includedDocuments)) {
        const sharedIds = session.includedDocuments;
        const sharedDocs = healthDocuments.filter((doc) => sharedIds.includes(doc.id));
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
    if (Array.isArray(session.medRecs) && session.medRecs.length > 0) {
        const recs = session.medRecs;
        parts.push(`Recommended Medication:\n${recs.map((r) => `- ${r.brand.name} (${r.activeIngredient.name})`).join('\n')}`);
    }
    if (Array.isArray(session.providerRecs) && session.providerRecs.length > 0) {
        const recs = session.providerRecs;
        parts.push(`Recommended Provider:\n${recs.map((r) => `- ${r.name} (${r.address})`).join('\n')}`);
    }
    return parts.join('\n\n');
}
//# sourceMappingURL=builder.js.map