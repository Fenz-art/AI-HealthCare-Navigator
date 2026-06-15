import { z } from 'zod';
import { executeWithRetryAndFallback, generateText } from '../ai/utils.js';
const IngredientArraySchema = z.array(z.string());
export async function extractActiveIngredients(symptoms) {
    const prompt = `
You are a Healthcare Navigation Assistant for travelers. You DO NOT diagnose diseases or prescribe medication.
Your ONLY job is to map common traveler symptoms to standard Over-The-Counter (OTC) active ingredients they might look for at a pharmacy.

Rules:
- Output ONLY a JSON array of strings representing generic active ingredient names (e.g., "Paracetamol", "Ibuprofen").
- If symptoms suggest severe issues, output an empty array.
- Keep ingredients to common OTC travel medications (pain, fever, diarrhea, allergies, nausea).

Examples:
Symptoms: "runny nose, headache" -> ["Paracetamol", "Pseudoephedrine"]
Symptoms: "diarrhea" -> ["Loperamide", "Oral Rehydration Salts"]
Symptoms: "sneezing, itchy eyes" -> ["Cetirizine"]
Symptoms: "chest pain, shortness of breath" -> []

User Symptoms:
${symptoms.join(', ')}

Output strictly as a JSON array of strings. No markdown, no explanation.
  `.trim();
    return executeWithRetryAndFallback(() => generateText(prompt), IngredientArraySchema, []);
}
//# sourceMappingURL=extractor.js.map