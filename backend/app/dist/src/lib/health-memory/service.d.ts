import type { MemoryType } from '@prisma/client';
export declare function addMemory(data: {
    userId: string;
    memoryType: MemoryType;
    value: string;
    source?: string;
    verified?: boolean;
}): Promise<{
    userId: string;
    value: string;
    id: string;
    createdAt: Date;
    sourceType: string;
    confidence: number | null;
    memoryType: import(".prisma/client").$Enums.MemoryType;
    source: string;
    sourceSessionId: string | null;
    sourceDocumentId: string | null;
    verified: boolean;
    verifiedAt: Date | null;
    verifiedBy: string | null;
}>;
export declare function addMemories(data: {
    userId: string;
    memories: {
        memoryType: MemoryType;
        value: string;
        source?: string;
        verified?: boolean;
    }[];
}): Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare function getUserMemories(userId: string, memoryType?: MemoryType): Promise<{
    userId: string;
    value: string;
    id: string;
    createdAt: Date;
    sourceType: string;
    confidence: number | null;
    memoryType: import(".prisma/client").$Enums.MemoryType;
    source: string;
    sourceSessionId: string | null;
    sourceDocumentId: string | null;
    verified: boolean;
    verifiedAt: Date | null;
    verifiedBy: string | null;
}[]>;
export declare function getMemorySummary(userId: string): Promise<{
    conditions: string[];
    medications: string[];
    allergies: string[];
    procedures: string[];
    vaccinations: string[];
    insurance: string[];
    emergencyContacts: string[];
    labResults: string[];
    vitalSigns: string[];
}>;
export declare function deleteMemory(memoryId: string): Promise<{
    userId: string;
    value: string;
    id: string;
    createdAt: Date;
    sourceType: string;
    confidence: number | null;
    memoryType: import(".prisma/client").$Enums.MemoryType;
    source: string;
    sourceSessionId: string | null;
    sourceDocumentId: string | null;
    verified: boolean;
    verifiedAt: Date | null;
    verifiedBy: string | null;
} | null>;
export declare function verifyMemory(memoryId: string): Promise<{
    userId: string;
    value: string;
    id: string;
    createdAt: Date;
    sourceType: string;
    confidence: number | null;
    memoryType: import(".prisma/client").$Enums.MemoryType;
    source: string;
    sourceSessionId: string | null;
    sourceDocumentId: string | null;
    verified: boolean;
    verifiedAt: Date | null;
    verifiedBy: string | null;
}>;
