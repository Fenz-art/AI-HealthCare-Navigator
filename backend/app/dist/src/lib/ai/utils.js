import { model } from '@/lib/ai/gemini';
const MAX_RETRIES = 2;
export async function generateText(prompt) {
    const result = await model.generateContent(prompt);
    return result.response.text();
}
export async function executeWithRetryAndFallback(aiCall, schema, fallback) {
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await aiCall();
            const cleanJson = response.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            return schema.parse(parsed);
        }
        catch (error) {
            console.error(`AI attempt ${i + 1} failed:`, error);
        }
    }
    console.error('All AI attempts failed. Using fallback.');
    return fallback;
}
//# sourceMappingURL=utils.js.map