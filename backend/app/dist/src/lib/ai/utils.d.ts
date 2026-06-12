import { ZodSchema } from 'zod';
export declare function generateText(prompt: string): Promise<string>;
export declare function executeWithRetryAndFallback<T>(aiCall: () => Promise<string>, schema: ZodSchema<T>, fallback: T): Promise<T>;
