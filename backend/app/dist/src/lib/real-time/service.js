import { prisma } from '../db.js';
// ── Presence ────────────────────────────────────────────────────────
export async function upsertPresence(userId, status, currentPage) {
    return prisma.userPresence.upsert({
        where: { userId },
        update: { status, currentPage: currentPage ?? null, lastSeenAt: new Date() },
        create: { userId, status, currentPage: currentPage ?? null },
    });
}
export async function getUserPresence(userId) {
    return prisma.userPresence.findUnique({ where: { userId } });
}
export async function getOnlineUsers() {
    return prisma.userPresence.findMany({
        where: { status: { in: ['ONLINE', 'AWAY'] } },
        include: { user: { select: { id: true, name: true, image: true, role: true } } },
    });
}
export async function getPresenceForUsers(userIds) {
    return prisma.userPresence.findMany({
        where: { userId: { in: userIds } },
        include: { user: { select: { id: true, name: true, image: true, role: true } } },
    });
}
// ── Typing Indicators ────────────────────────────────────────────────
const typingTimeouts = new Map();
export function startTyping(conversationId, userId) {
    const key = `${conversationId}:${userId}`;
    const existing = typingTimeouts.get(key);
    if (existing)
        clearTimeout(existing);
    const timeout = setTimeout(() => {
        typingTimeouts.delete(key);
    }, 5000);
    typingTimeouts.set(key, timeout);
}
export function stopTyping(conversationId, userId) {
    const key = `${conversationId}:${userId}`;
    const existing = typingTimeouts.get(key);
    if (existing) {
        clearTimeout(existing);
        typingTimeouts.delete(key);
    }
}
export function isTyping(conversationId, userId) {
    return typingTimeouts.has(`${conversationId}:${userId}`);
}
export function getTypingUsers(conversationId) {
    const results = [];
    for (const [key] of typingTimeouts) {
        if (key.startsWith(`${conversationId}:`)) {
            results.push(key.split(':')[1]);
        }
    }
    return results;
}
// ── Read Receipts ───────────────────────────────────────────────────
export async function markMessageRead(messageId, userId) {
    const existing = await prisma.messageRead.findUnique({
        where: { messageId_userId: { messageId, userId } },
    });
    if (existing)
        return existing;
    const read = await prisma.messageRead.create({
        data: { messageId, userId },
    });
    await prisma.message.update({
        where: { id: messageId },
        data: { status: 'SEEN' },
    });
    return read;
}
export async function getMessageReadReceipts(messageId) {
    return prisma.messageRead.findMany({
        where: { messageId },
        include: { user: { select: { id: true, name: true, image: true } } },
    });
}
export async function markConversationMessagesRead(conversationId, userId) {
    const messages = await prisma.message.findMany({
        where: { conversationId, senderId: { not: userId } },
        select: { id: true },
    });
    for (const msg of messages) {
        await markMessageRead(msg.id, userId).catch(() => { });
    }
    return { count: messages.length };
}
// ── Conversation Events ──────────────────────────────────────────────
export async function createConversationEvent(data) {
    return prisma.conversationEvent.create({
        data: {
            conversationId: data.conversationId,
            eventType: data.eventType,
            title: data.title,
            description: data.description,
            metadata: data.metadata ? JSON.stringify(data.metadata) : null,
            actorId: data.actorId,
            actorName: data.actorName,
        },
    });
}
export async function getConversationEvents(conversationId) {
    return prisma.conversationEvent.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
    });
}
// ── Notifications ────────────────────────────────────────────────────
export async function createNotification(data) {
    return prisma.notification.create({
        data: {
            userId: data.userId,
            type: data.type,
            title: data.title,
            body: data.body,
            data: data.data ? JSON.stringify(data.data) : null,
        },
    });
}
export async function getUserNotifications(userId, limit = 50) {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}
export async function getUnreadNotificationCount(userId) {
    return prisma.notification.count({
        where: { userId, read: false },
    });
}
export async function markNotificationRead(notificationId) {
    return prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
    });
}
export async function markAllNotificationsRead(userId) {
    return prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
    });
}
// ── Activity Feed ────────────────────────────────────────────────────
export async function createActivityItem(data) {
    return prisma.activityItem.create({
        data: {
            userId: data.userId,
            eventType: data.eventType,
            title: data.title,
            description: data.description,
            metadata: data.metadata ? JSON.stringify(data.metadata) : null,
            linkUrl: data.linkUrl,
        },
    });
}
export async function getUserActivity(userId, limit = 50) {
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
//# sourceMappingURL=service.js.map