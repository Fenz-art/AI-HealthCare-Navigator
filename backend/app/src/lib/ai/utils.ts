import { ZodSchema } from 'zod';
import { model } from '@/lib/ai/gemini';

const MAX_RETRIES = 2;

export async function generateText(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function executeWithRetryAndFallback<T>(
  aiCall: () => Promise<string>,
  schema: ZodSchema<T>,
  fallback: T
): Promise<T> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await aiCall();
      const cleanJson = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return schema.parse(parsed);
    } catch (error) {
      console.error(`AI attempt ${i + 1} failed:`, error);
    }
  }

  console.error('All AI attempts failed. Using fallback.');
  return fallback;
}
