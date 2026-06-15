type ContextSource = 'medical' | 'passport' | 'medication' | 'conversation' | 'memory' | 'session';
export interface InjectedContext {
    raw: string;
    sources: ContextSource[];
    language: string;
    countryCode: string;
}
export declare function buildFullContext(params: {
    userId?: string;
    sessionId?: string;
    conversationId?: string;
    countryCode?: string;
    recentTranscripts?: {
        role: string;
        text: string;
    }[];
}): Promise<InjectedContext>;
export declare function buildTranslationPrompt(params: {
    context: string;
    transcript: string;
    direction: 'patientToProvider' | 'providerToPatient';
    sourceLanguage: string;
    targetLanguage: string;
}): string;
export {};
