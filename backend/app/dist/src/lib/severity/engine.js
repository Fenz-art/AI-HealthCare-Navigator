import { SeverityOutputSchema } from './schema.js';
import { executeWithRetryAndFallback, generateText } from '../ai/utils.js';
export async function determineSeverity(symptoms, duration, allergies, currentMeds) {
    const prompt = `
You are a Healthcare Navigation Agent for travelers. You DO NOT diagnose diseases.
You ONLY determine the escalation pathway based on symptoms.

Allowed escalation levels: SELF_CARE, PHARMACY, CLINIC, HOSPITAL, EMERGENCY.

Rules:
- If symptoms are mild (e.g., slight runny nose, mild headache), route to SELF_CARE.
- If symptoms are moderate and OTC medication is typically needed (e.g., diarrhea, persistent cough), route to PHARMACY.
- If symptoms require a professional examination but are not life-threatening (e.g., persistent fever, deep cut), route to CLINIC.
- If symptoms are severe and require immediate medical infrastructure (e.g., potential fracture, severe allergic reaction), route to HOSPITAL.
- If symptoms are immediately life-threatening (e.g., chest pain, difficulty breathing), route to EMERGENCY.

User Data:
Symptoms: ${symptoms.join(', ')}
Duration: ${duration || 'Unknown'}
Allergies: ${allergies.length ? allergies.join(', ') : 'None'}
Current Medications: ${currentMeds.length ? currentMeds.join(', ') : 'None'}

Analyze and output strictly in JSON matching this schema:
{ "severity": "ENUM_VALUE", "reasoning": "Brief explanation of escalation level", "suggestedAction": "What the user should do next" }
  `.trim();
    const fallback = {
        severity: 'CLINIC',
        reasoning: 'Unable to assess severity automatically.',
        suggestedAction: 'Please consult a healthcare provider to be safe.'
    };
    return executeWithRetryAndFallback(() => generateText(prompt), SeverityOutputSchema, fallback);
}
//# sourceMappingURL=engine.js.map