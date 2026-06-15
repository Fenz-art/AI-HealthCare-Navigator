export declare function processDocumentUpload(data: {
    userId: string;
    title: string;
    type: string;
    sourceCountry?: string;
    originalLanguage: string;
    extractedText: string;
}): Promise<{
    document: {
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
    };
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
}>;
export declare function getDocumentWithExtraction(documentId: string): Promise<({
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
}) | null>;
export declare function getUserVaultWithExtraction(userId: string): Promise<({
    healthPassport: {
        userId: string;
        allergies: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bloodGroup: string | null;
        currentMedications: string | null;
        chronicConditions: string | null;
        vaccinations: string | null;
        emergencyContacts: string | null;
    } | null;
    healthDocuments: ({
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
    })[];
} & {
    allergies: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string | null;
    bloodGroup: string | null;
    emergencyContacts: string | null;
    email: string;
    image: string | null;
    homeCountry: string | null;
    preferredLanguage: string | null;
    medications: string | null;
    dateOfBirth: string | null;
    onboardingComplete: boolean;
    role: import(".prisma/client").$Enums.UserRole | null;
}) | null>;
export declare function updatePassportFromExtractions(userId: string): Promise<{
    userId: string;
    allergies: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    bloodGroup: string | null;
    currentMedications: string | null;
    chronicConditions: string | null;
    vaccinations: string | null;
    emergencyContacts: string | null;
} | null>;
