import { prisma } from '../db.js';
export async function createConversation(userIds, title) {
    const conversation = await prisma.conversation.create({
        data: {
            title: title ?? null,
            participants: {
                create: userIds.map((u) => ({
                    userId: u.userId,
                    role: u.role ?? null,
                })),
            },
        },
        include: {
            participants: {
                include: { user: { select: { id: true, name: true, image: true, role: true } } },
            },
            messages: { orderBy: { createdAt: 'asc' }, take: 50, include: { attachments: true } },
        },
    });
    return conversation;
}
export async function getConversation(conversationId) {
    return prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            participants: {
                include: { user: { select: { id: true, name: true, image: true, role: true } } },
            },
            messages: { orderBy: { createdAt: 'asc' }, include: { attachments: true } },
        },
    });
}
export async function getUserConversations(userId) {
    return prisma.conversation.findMany({
        where: { participants: { some: { userId } } },
        include: {
            participants: {
                include: { user: { select: { id: true, name: true, image: true, role: true } } },
            },
            messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { attachments: true } },
        },
        orderBy: { updatedAt: 'desc' },
    });
}
export async function sendMessage(data) {
    const message = await prisma.message.create({
        data: {
            conversationId: data.conversationId,
            senderId: data.senderId,
            senderType: data.senderType,
            content: data.content,
            attachments: data.attachments?.length
                ? { create: data.attachments }
                : undefined,
        },
        include: { attachments: true },
    });
    await prisma.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
    });
    return message;
}
export async function getConversationMessages(conversationId, options) {
    return prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        skip: options?.offset ?? 0,
        take: options?.limit ?? 100,
        include: { attachments: true },
    });
}
export async function addParticipant(conversationId, userId, role) {
    return prisma.conversationParticipant.create({
        data: { conversationId, userId, role: role ?? null },
    });
}
export async function removeParticipant(conversationId, userId) {
    return prisma.conversationParticipant.delete({
        where: { conversationId_userId: { conversationId, userId } },
    });
}
export async function markAsRead(conversationId, userId) {
    return prisma.conversationParticipant.update({
        where: { conversationId_userId: { conversationId, userId } },
        data: { lastReadAt: new Date() },
    });
}
//# sourceMappingURL=service.js.map