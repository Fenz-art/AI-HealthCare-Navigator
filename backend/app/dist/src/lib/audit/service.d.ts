export type AuditAction = 'passport_view' | 'record_view' | 'file_download' | 'share_link_open' | 'summary_generated' | 'interpreter_session' | 'consent_granted' | 'consent_revoked' | 'record_shared' | 'passport_shared' | 'passport_revoked';
export type ResourceType = 'passport' | 'record' | 'document' | 'share_link' | 'summary' | 'interpreter_session' | 'consent';
export declare function logAccess(data: {
    userId?: string;
    action: AuditAction;
    resourceType: ResourceType;
    resourceId?: string;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
}): Promise<{
    userId: string | null;
    id: string;
    createdAt: Date;
    action: string;
    resourceType: string;
    resourceId: string | null;
    ipHash: string | null;
    userAgent: string | null;
    metadata: string | null;
}>;
export declare function getAccessLogs(params: {
    userId?: string;
    action?: string;
    resourceType?: string;
    resourceId?: string;
    limit?: number;
    offset?: number;
}): Promise<{
    logs: {
        userId: string | null;
        id: string;
        createdAt: Date;
        action: string;
        resourceType: string;
        resourceId: string | null;
        ipHash: string | null;
        userAgent: string | null;
        metadata: string | null;
    }[];
    total: number;
}>;
export declare function getResourceAccessLogs(resourceType: string, resourceId: string, limit?: number): Promise<{
    userId: string | null;
    id: string;
    createdAt: Date;
    action: string;
    resourceType: string;
    resourceId: string | null;
    ipHash: string | null;
    userAgent: string | null;
    metadata: string | null;
}[]>;
export declare function logConsent(data: {
    userId: string;
    action: 'consent_granted' | 'consent_revoked';
    sessionId: string;
    metadata?: Record<string, unknown>;
    ip?: string;
}): Promise<void>;
export declare function logShareAccess(data: {
    shareToken: string;
    ip?: string;
    userAgent?: string;
}): Promise<{
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
export declare function enforceShareExpiry(shareToken: string): Promise<boolean>;
