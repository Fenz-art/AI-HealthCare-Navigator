import type { VerificationStatus, VerificationType } from '@prisma/client';
export declare function getOrCreateWorkspace(userId: string, role: string): Promise<{
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    specialties: string | null;
    languages: string | null;
    organization: string | null;
    availability: string | null;
    isActive: boolean;
}>;
export declare function getWorkspace(userId: string): Promise<({
    verifications: {
        type: import(".prisma/client").$Enums.VerificationType;
        status: import(".prisma/client").$Enums.VerificationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        providerId: string;
        verifiedAt: Date | null;
        verifiedBy: string | null;
        expiresAt: Date | null;
        documentUrl: string | null;
        documentName: string | null;
    }[];
} & {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    specialties: string | null;
    languages: string | null;
    organization: string | null;
    availability: string | null;
    isActive: boolean;
}) | null>;
export declare function updateWorkspace(userId: string, data: {
    specialties?: string[];
    languages?: string[];
    organization?: string;
    availability?: Record<string, unknown>;
    isActive?: boolean;
}): Promise<{
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    specialties: string | null;
    languages: string | null;
    organization: string | null;
    availability: string | null;
    isActive: boolean;
}>;
export declare function getWorkspaceById(id: string): Promise<({
    verifications: {
        type: import(".prisma/client").$Enums.VerificationType;
        status: import(".prisma/client").$Enums.VerificationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        providerId: string;
        verifiedAt: Date | null;
        verifiedBy: string | null;
        expiresAt: Date | null;
        documentUrl: string | null;
        documentName: string | null;
    }[];
} & {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    specialties: string | null;
    languages: string | null;
    organization: string | null;
    availability: string | null;
    isActive: boolean;
}) | null>;
export declare function getAllWorkspacesByRole(role: string): Promise<({
    verifications: {
        type: import(".prisma/client").$Enums.VerificationType;
        status: import(".prisma/client").$Enums.VerificationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        providerId: string;
        verifiedAt: Date | null;
        verifiedBy: string | null;
        expiresAt: Date | null;
        documentUrl: string | null;
        documentName: string | null;
    }[];
} & {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    specialties: string | null;
    languages: string | null;
    organization: string | null;
    availability: string | null;
    isActive: boolean;
})[]>;
export declare function submitVerification(data: {
    providerId: string;
    type: VerificationType;
    documentUrl?: string;
    documentName?: string;
}): Promise<{
    type: import(".prisma/client").$Enums.VerificationType;
    status: import(".prisma/client").$Enums.VerificationStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    notes: string | null;
    providerId: string;
    verifiedAt: Date | null;
    verifiedBy: string | null;
    expiresAt: Date | null;
    documentUrl: string | null;
    documentName: string | null;
}>;
export declare function updateVerificationStatus(id: string, status: VerificationStatus, verifiedBy?: string, notes?: string): Promise<{
    type: import(".prisma/client").$Enums.VerificationType;
    status: import(".prisma/client").$Enums.VerificationStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    notes: string | null;
    providerId: string;
    verifiedAt: Date | null;
    verifiedBy: string | null;
    expiresAt: Date | null;
    documentUrl: string | null;
    documentName: string | null;
}>;
export declare function getVerifications(providerId: string): Promise<{
    type: import(".prisma/client").$Enums.VerificationType;
    status: import(".prisma/client").$Enums.VerificationStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    notes: string | null;
    providerId: string;
    verifiedAt: Date | null;
    verifiedBy: string | null;
    expiresAt: Date | null;
    documentUrl: string | null;
    documentName: string | null;
}[]>;
export declare function getProviderActivityFeed(userId: string, limit?: number): Promise<{
    userId: string;
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    metadata: string | null;
    eventType: import(".prisma/client").$Enums.EventType;
    linkUrl: string | null;
}[]>;
