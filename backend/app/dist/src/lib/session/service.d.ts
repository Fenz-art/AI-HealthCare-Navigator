import { ProviderType } from '@prisma/client';
export interface CreateSessionInput {
    userId?: string;
    location?: string;
    countryCode?: string;
    symptoms: string[];
    duration?: string;
    allergies?: string[];
    currentMeds?: string[];
    activeIngredient?: string;
    lat?: number;
    lng?: number;
    providerType?: ProviderType;
}
export declare function createTravelHealthSession(input: CreateSessionInput): Promise<{
    severity: import(".prisma/client").$Enums.SeverityLevel | null;
    id: string;
    countryId: string | null;
    userId: string | null;
    location: string | null;
    symptoms: string[];
    duration: string | null;
    allergies: string[];
    currentMeds: string[];
    medRecs: import("@prisma/client/runtime/library").JsonValue | null;
    providerRecs: import("@prisma/client/runtime/library").JsonValue | null;
    interpreterContext: string | null;
    outcome: import("@prisma/client/runtime/library").JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
}>;
