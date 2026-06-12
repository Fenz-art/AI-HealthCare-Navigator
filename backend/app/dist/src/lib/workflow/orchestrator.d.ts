import { ProviderType, SeverityLevel } from '@prisma/client';
import { SeverityResult } from '@/lib/severity/engine';
export type WorkflowAction = 'SELF_CARE' | 'CALL_EMERGENCY_SERVICES' | 'PHARMACY' | 'CLINIC' | 'HOSPITAL';
export interface WorkflowInput {
    sessionId: string;
    lat: number;
    lng: number;
    countryCode: string;
}
export interface WorkflowResult {
    sessionId: string;
    severity: SeverityResult;
    action: WorkflowAction;
    medications: unknown[];
    providers: unknown[];
    interpreterContext: string;
    interpreterContextTranslated: string;
    targetLanguage: string;
}
declare function severityToProviderType(severity: SeverityLevel): ProviderType | null;
export declare function executeWorkflow(input: WorkflowInput): Promise<WorkflowResult>;
export { severityToProviderType };
