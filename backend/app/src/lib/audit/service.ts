import { prisma } from '../db.js';
import crypto from 'crypto';

export type AuditAction =
  | 'passport_view'
  | 'record_view'
  | 'file_download'
  | 'share_link_open'
  | 'summary_generated'
  | 'interpreter_session'
  | 'consent_granted'
  | 'consent_revoked'
  | 'record_shared'
  | 'passport_shared'
  | 'passport_revoked';

export type ResourceType =
  | 'passport'
  | 'record'
  | 'document'
  | 'share_link'
  | 'summary'
  | 'interpreter_session'
  | 'consent';

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export async function logAccess(data: {
  userId?: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.accessLog.create({
    data: {
      userId: data.userId ?? null,
      action: data.action,
      resourceType: data.resourceType,
      resourceId: data.resourceId ?? null,
      ipHash: data.ip ? hashIp(data.ip) : null,
      userAgent: data.userAgent ?? null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    },
  });
}

export async function getAccessLogs(params: {
  userId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};
  if (params.userId) where.userId = params.userId;
  if (params.action) where.action = params.action;
  if (params.resourceType) where.resourceType = params.resourceType;
  if (params.resourceId) where.resourceId = params.resourceId;

  const [logs, total] = await Promise.all([
    prisma.accessLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: params.limit ?? 50,
      skip: params.offset ?? 0,
    }),
    prisma.accessLog.count({ where }),
  ]);

  return { logs, total };
}

export async function getResourceAccessLogs(resourceType: string, resourceId: string, limit = 20) {
  return prisma.accessLog.findMany({
    where: { resourceType, resourceId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

// ── Consent Audit ──────────────────────────────────────────────────

export async function logConsent(data: {
  userId: string;
  action: 'consent_granted' | 'consent_revoked';
  sessionId: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}) {
  await logAccess({
    userId: data.userId,
    action: data.action,
    resourceType: 'consent',
    resourceId: data.sessionId,
    ip: data.ip,
    metadata: data.metadata,
  });

  await prisma.activityItem.create({
    data: {
      userId: data.userId,
      eventType: data.action === 'consent_granted' ? 'CONSENT_GRANTED' : 'CONSENT_REVOKED',
      title: data.action === 'consent_granted' ? 'Consent Granted' : 'Consent Revoked',
      description: `For session ${data.sessionId}`,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    },
  });
}

// ── Share Link Audit ───────────────────────────────────────────────

export async function logShareAccess(data: {
  shareToken: string;
  ip?: string;
  userAgent?: string;
}) {
  const share = await prisma.sharedPassport.findUnique({
    where: { shareToken: data.shareToken },
  });
  if (!share) return null;

  await logAccess({
    action: 'share_link_open',
    resourceType: 'share_link',
    resourceId: share.id,
    ip: data.ip,
    userAgent: data.userAgent,
    metadata: { shareToken: data.shareToken, shareType: share.shareType },
  });

  const updated = await prisma.sharedPassport.update({
    where: { shareToken: data.shareToken },
    data: {
      accessCount: { increment: 1 },
      lastViewedAt: new Date(),
    },
  });

  // Notify the creator (best-effort)
  await prisma.notification
    .create({
      data: {
        userId: share.createdBy,
        type: 'SHARE_ACCESSED',
        title: 'Share Link Accessed',
        body: `Your passport was viewed via shared link.`,
        data: JSON.stringify({
          shareToken: data.shareToken,
          accessCount: updated.accessCount,
        }),
      },
    })
    .catch(() => {});

  return updated;
}

export async function enforceShareExpiry(shareToken: string): Promise<boolean> {
  const share = await prisma.sharedPassport.findUnique({ where: { shareToken } });
  if (!share) return false;
  if (share.revoked) return false;
  if (share.expiresAt && new Date() > share.expiresAt) {
    await prisma.sharedPassport.update({
      where: { shareToken },
      data: { revoked: true },
    });
    return false;
  }
  return true;
}
