import { GoogleGenerativeAI } from '@google/generative-ai';
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required to initialize Gemini AI.');
}
const genAI = new GoogleGenerativeAI(apiKey);
export const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? 'gemini-pro' });
//# sourceMappingURL=gemini.js.map