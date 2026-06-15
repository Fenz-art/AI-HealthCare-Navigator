export type ShareType = 'QUICK' | 'PROVIDER' | 'EMERGENCY';
export declare function sharePassport(data: {
    passportId?: string;
    createdBy: string;
    conversationId?: string;
    shareType?: ShareType;
}): Promise<{
    id: string;
    shareToken: string;
    shareUrl: string;
    shareType: ShareType;
    qrCodeUrl: string;
    expiresAt: Date | null;
    createdAt: Date;
}>;
export declare function getSharedPassport(shareToken: string, accessContext?: {
    userId?: string | null;
    ip?: string | null;
    userAgent?: string | null;
}): Promise<{
    passport: {
        bloodGroup: string | null;
        allergies: string[];
        currentMedications: string[];
        chronicConditions: string[];
        vaccinations: string[];
        emergencyContacts: string[];
    };
    user: {
        name: string | null;
        bloodGroup: string | null;
        homeCountry: string | null;
        preferredLanguage: string | null;
    };
    shareType: string;
    sharedAt: Date;
} | null>;
export declare function revokeShare(shareToken: string, userId: string): Promise<{
    id: string;
    createdAt: Date;
    conversationId: string | null;
    shareToken: string;
    passportId: string;
    qrCodeUrl: string | null;
    expiresAt: Date | null;
    accessCount: number;
    createdBy: string;
    lastViewedAt: Date | null;
    revoked: boolean;
    shareType: string;
} | null>;
export declare function getShareTimeline(userId: string): Promise<{
    id: string;
    shareToken: string;
    shareType: string;
    shareUrl: string;
    expiresAt: Date | null;
    revoked: boolean;
    accessCount: number;
    lastViewedAt: Date | null;
    createdAt: Date;
    conversation: {
        id: string;
        title: string | null;
    } | null;
}[]>;
export declare function getUserSharedPassports(userId: string): Promise<({
    conversation: ({
        id: string;
        title: string | null;
        participants: ({
            user: {
                id: string;
                name: string | null;
                image: string | null;
            };
        } & {
            userId: string;
            id: string;
            role: string | null;
            lastReadAt: Date | null;
            conversationId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
    }) | null;
} & {
    id: string;
    createdAt: Date;
    conversationId: string | null;
    shareToken: string;
    passportId: string;
    qrCodeUrl: string | null;
    expiresAt: Date | null;
    accessCount: number;
    createdBy: string;
    lastViewedAt: Date | null;
    revoked: boolean;
    shareType: string;
})[]>;
export declare function generateQrCode(shareToken: string): Promise<string>;
