import { SeverityOutput } from './schema';
export type SeverityResult = SeverityOutput;
export declare function determineSeverity(symptoms: string[], duration: string, allergies: string[], currentMeds: string[]): Promise<SeverityResult>;
