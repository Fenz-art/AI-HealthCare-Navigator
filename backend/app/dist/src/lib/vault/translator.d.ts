interface VaultTranslationResult {
    englishTranslation: string;
    extractedCleanText: string;
}
export declare function translateAndExtractDocument(text: string, sourceLanguage: string): Promise<VaultTranslationResult>;
export {};
