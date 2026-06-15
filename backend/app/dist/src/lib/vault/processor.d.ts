export declare function processDocumentPipeline(data: {
    userId: string;
    title: string;
    type: string;
    sourceCountry?: string;
    originalLanguage: string;
    extractedText: string;
    storageUrl?: string;
}): Promise<{
    document: ({
        processingJobs: {
            error: string | null;
            status: import(".prisma/client").$Enums.JobStatus;
            id: string;
            progress: number;
            documentId: string;
            currentStep: string;
            startedAt: Date | null;
            completedAt: Date | null;
        }[];
        extraction: {
            allergies: string | null;
            id: string;
            medications: string | null;
            documentId: string;
            conditions: string | null;
            procedures: string | null;
            insuranceMeta: string | null;
            vitalSigns: string | null;
            labResults: string | null;
            extractedAt: Date;
        } | null;
    } & {
        userId: string;
        type: string;
        id: string;
        title: string;
        sourceCountry: string | null;
        originalLanguage: string | null;
        fileUrl: string;
        extractedText: string | null;
        translatedText: string | null;
        isSharedInSession: boolean;
        uploadedAt: Date;
        processingStatus: import(".prisma/client").$Enums.ProcessingStatus;
        storageUrl: string | null;
    }) | null;
    job: {
        error: string | null;
        status: import(".prisma/client").$Enums.JobStatus;
        id: string;
        progress: number;
        documentId: string;
        currentStep: string;
        startedAt: Date | null;
        completedAt: Date | null;
    };
    translation: any;
    extraction: any;
    memories: any;
    passport: any;
}>;
