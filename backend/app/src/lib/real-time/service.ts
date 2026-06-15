import { prisma } from '../db.js';

// ── Presence ────────────────────────────────────────────────────────

export async function upsertPresence(userId: string, status: 'ONLINE' | 'AWAY' | 'OFFLINE', currentPage?: string) {
  return prisma.userPresence.upsert({
    where: { userId },
    update: { status, currentPage: currentPage ?? null, lastSeenAt: new Date() },
    create: { userId, status, currentPage: currentPage ?? null },
  });
}

export async function getUserPresence(userId: string) {
  return prisma.userPresence.findUnique({ where: { userId } });
}

export async function getOnlineUsers() {
  return prisma.userPresence.findMany({
    where: { status: { in: ['ONLINE', 'AWAY'] } },
    include: { user: { select: { id: true, name: true, image: true, role: true } } },
  });
}

export async function getPresenceForUsers(userIds: string[]) {
  return prisma.userPresence.findMany({
    where: { userId: { in: userIds } },
    include: { user: { select: { id: true, name: true, image: true, role: true } } },
  });
}

// ── Typing Indicators ────────────────────────────────────────────────

const typingTimeouts = new Map<string, NodeJS.Timeout>();

export function startTyping(conversationId: string, userId: string) {
  const key = `${conversationId}:${userId}`;
  const existing = typingTimeouts.get(key);
  if (existing) clearTimeout(existing);

  const timeout = setTimeout(() => {
    typingTimeouts.delete(key);
  }, 5000);
  typingTimeouts.set(key, timeout);
}

export function stopTyping(conversationId: string, userId: string) {
  const key = `${conversationId}:${userId}`;
  const existing = typingTimeouts.get(key);
  if (existing) {
    clearTimeout(existing);
    typingTimeouts.delete(key);
  }
}

export function isTyping(conversationId: string, userId: string): boolean {
  return typingTimeouts.has(`${conversationId}:${userId}`);
}

export function getTypingUsers(conversationId: string) {
  const results: string[] = [];
  for (const [key] of typingTimeouts) {
    if (key.startsWith(`${conversationId}:`)) {
      results.push(key.split(':')[1]);
    }
  }
  return results;
}

// ── Read Receipts ───────────────────────────────────────────────────

export async function markMessageRead(messageId: string, userId: string) {
  const existing = await prisma.messageRead.findUnique({
    where: { messageId_userId: { messageId, userId } },
  });
  if (existing) return existing;

  const read = await prisma.messageRead.create({
    data: { messageId, userId },
  });

  await prisma.message.update({
    where: { id: messageId },
    data: { status: 'SEEN' },
  });

  return read;
}

export async function getMessageReadReceipts(messageId: string) {
  return prisma.messageRead.findMany({
    where: { messageId },
    include: { user: { select: { id: true, name: true, image: true } } },
  });
}

export async function markConversationMessagesRead(conversationId: string, userId: string) {
  const messages = await prisma.message.findMany({
    where: { conversationId, senderId: { not: userId } },
    select: { id: true },
  });

  for (const msg of messages) {
    await markMessageRead(msg.id, userId).catch(() => {});
  }

  return { count: messages.length };
}

// ── Conversation Events ──────────────────────────────────────────────

export async function createConversationEvent(data: {
  conversationId: string;
  eventType: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  actorId?: string;
  actorName?: string;
}) {
  return prisma.conversationEvent.create({
    data: {
      conversationId: data.conversationId,
      eventType: data.eventType as any,
      title: data.title,
      description: data.description,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      actorId: data.actorId,
      actorName: data.actorName,
    },
  });
}

export async function getConversationEvents(conversationId: string) {
  return prisma.conversationEvent.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
}

// ── Notifications ────────────────────────────────────────────────────

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
}) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type as any,
      title: data.title,
      body: data.body,
      data: data.data ? JSON.stringify(data.data) : null,
    },
  });
}

export async function getUserNotifications(userId: string, limit = 50) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

export async function markNotificationRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

// ── Activity Feed ────────────────────────────────────────────────────

export async function createActivityItem(data: {
  userId: string;
  eventType: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  linkUrl?: string;
}) {
  return prisma.activityItem.create({
    data: {
      userId: data.userId,
      eventType: data.eventType as any,
      title: data.title,
      description: data.description,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      linkUrl: data.linkUrl,
    },
  });
}

export async function getUserActivity(userId: string, limit = 50) {
  return prisma.activityItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getAllActivity(limit = 100) {
  return prisma.activityItem.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { id: true, name: true, image: true, role: true } } },
  });
}
