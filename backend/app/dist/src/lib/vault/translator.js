import { model } from '../ai/gemini.js';
export async function translateAndExtractDocument(text, sourceLanguage) {
    const prompt = `
You are a medical document translation and extraction assistant.
You DO NOT diagnose, interpret clinical significance, or make recommendations.

Tasks:
1. Translate the following text from ${sourceLanguage} to English.
2. Extract the text cleanly, removing irrelevant formatting or handwriting artifacts.

Rules:
- Do not add medical commentary.
- If a word is illegible, mark as [illegible].
- Output strictly a JSON object with \"englishTranslation\" and \"extractedCleanText\".

Text:
${text}
`.trim();
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
            englishTranslation: String(parsed.englishTranslation ?? parsed.translation ?? ''),
            extractedCleanText: String(parsed.extractedCleanText ?? parsed.extractedText ?? ''),
        };
    }
    catch (error) {
        console.error('Document Translation Error:', error);
        throw new Error('Failed to translate document safely.');
    }
}
//# sourceMappingURL=translator.js.map