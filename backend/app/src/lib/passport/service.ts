import { prisma } from '../db.js';
import crypto from 'crypto';
import QRCode from 'qrcode';

export type ShareType = 'QUICK' | 'PROVIDER' | 'EMERGENCY';

const SHARE_DURATIONS: Record<ShareType, number | null> = {
  QUICK: 24,
  PROVIDER: 7 * 24,
  EMERGENCY: null, // permanent until revoked
};

function generateToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

function makeShareUrl(token: string): string {
  const base = process.env.APP_URL || 'http://localhost:3000';
  return `${base}/shared/passport/${token}`;
}

export async function sharePassport(data: {
  passportId?: string;
  createdBy: string;
  conversationId?: string;
  shareType?: ShareType;
}) {
  const shareType: ShareType = data.shareType ?? 'QUICK';
  const expiresInHours = SHARE_DURATIONS[shareType];
  const shareToken = generateToken();

  let passportId = data.passportId;
  if (!passportId) {
    const existing = await prisma.healthPassport.findUnique({ where: { userId: data.createdBy } });
    if (existing) {
      passportId = existing.id;
    } else {
      const created = await prisma.healthPassport.create({
        data: { userId: data.createdBy },
      });
      passportId = created.id;
    }
  }

  const shared = await prisma.sharedPassport.create({
    data: {
      passportId,
      createdBy: data.createdBy,
      shareToken,
      shareType,
      conversationId: data.conversationId ?? null,
      expiresAt: expiresInHours
        ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
        : null,
    },
  });

  const shareUrl = makeShareUrl(shareToken);
  const qrCodeDataUrl = await QRCode.toDataURL(shareUrl, { width: 400, margin: 2 });

  await prisma.sharedPassport.update({
    where: { id: shared.id },
    data: { qrCodeUrl: qrCodeDataUrl },
  });

  return {
    id: shared.id,
    shareToken,
    shareUrl,
    shareType,
    qrCodeUrl: qrCodeDataUrl,
    expiresAt: shared.expiresAt,
    createdAt: shared.createdAt,
  };
}

export async function getSharedPassport(
  shareToken: string,
  accessContext?: {
    userId?: string | null;
    ip?: string | null;
    userAgent?: string | null;
  },
) {
  const shared = await prisma.sharedPassport.findUnique({
    where: { shareToken },
    include: {
      creator: { select: { id: true, name: true } },
    },
  });

  if (!shared) return null;
  if (shared.revoked) return null;
  if (shared.expiresAt && shared.expiresAt < new Date()) return null;

  const passport = await prisma.healthPassport.findUnique({
    where: { id: shared.passportId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          bloodGroup: true,
          homeCountry: true,
          preferredLanguage: true,
        },
      },
    },
  });

  if (!passport) return null;

  // Audit is written inside the service on every successful share access.
  // logShareAccess also increments accessCount + lastViewedAt.
  await (async () => {
    const { logShareAccess } = await import('../audit/service.js');
    await logShareAccess({
      shareToken,
      ip: accessContext?.ip ?? undefined,
      userAgent: accessContext?.userAgent ?? undefined,
    });
  })();

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (value == null || value === '') return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    // Avoid leaking parse errors to clients; keep request resilient.
    return fallback;
  }
}

  return {
    passport: {
      bloodGroup: passport.bloodGroup,
      allergies: safeJsonParse<string[]>(passport.allergies, []),
      currentMedications: safeJsonParse<string[]>(passport.currentMedications, []),
      chronicConditions: safeJsonParse<string[]>(passport.chronicConditions, []),
      vaccinations: safeJsonParse<string[]>(passport.vaccinations, []),
      emergencyContacts: safeJsonParse<string[]>(passport.emergencyContacts, []),
    },
    user: {
      name: passport.user.name,
      bloodGroup: passport.user.bloodGroup,
      homeCountry: passport.user.homeCountry,
      preferredLanguage: passport.user.preferredLanguage,
    },
    shareType: shared.shareType,
    sharedAt: shared.createdAt,
  };
}

export async function revokeShare(shareToken: string, userId: string) {
  const shared = await prisma.sharedPassport.findUnique({ where: { shareToken } });
  if (!shared) return null;
  if (shared.createdBy !== userId) return null;

  return prisma.sharedPassport.update({
    where: { id: shared.id },
    data: { revoked: true },
  });
}

export async function getShareTimeline(userId: string) {
  const shares = await prisma.sharedPassport.findMany({
    where: { createdBy: userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      conversation: {
        select: { id: true, title: true },
      },
    },
  });

  return shares.map((s) => ({
    id: s.id,
    shareToken: s.shareToken,
    shareType: s.shareType,
    shareUrl: makeShareUrl(s.shareToken),
    expiresAt: s.expiresAt,
    revoked: s.revoked,
    accessCount: s.accessCount,
    lastViewedAt: s.lastViewedAt,
    createdAt: s.createdAt,
    conversation: s.conversation,
  }));
}

export async function getUserSharedPassports(userId: string) {
  return prisma.sharedPassport.findMany({
    where: { createdBy: userId },
    include: {
      conversation: {
        select: { id: true, title: true },
        include: {
          participants: {
            where: { userId: { not: userId } },
            include: { user: { select: { id: true, name: true, image: true } } },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function generateQrCode(shareToken: string) {
  const shareUrl = makeShareUrl(shareToken);
  return QRCode.toDataURL(shareUrl, { width: 400, margin: 2 });
}
