export declare function upsertPresence(userId: string, status: 'ONLINE' | 'AWAY' | 'OFFLINE', currentPage?: string): Promise<{
    userId: string;
    status: import(".prisma/client").$Enums.PresenceStatus;
    updatedAt: Date;
    lastSeenAt: Date;
    currentPage: string | null;
}>;
export declare function getUserPresence(userId: string): Promise<{
    userId: string;
    status: import(".prisma/client").$Enums.PresenceStatus;
    updatedAt: Date;
    lastSeenAt: Date;
    currentPage: string | null;
} | null>;
export declare function getOnlineUsers(): Promise<({
    user: {
        id: string;
        name: string | null;
        image: string | null;
        role: import(".prisma/client").$Enums.UserRole | null;
    };
} & {
    userId: string;
    status: import(".prisma/client").$Enums.PresenceStatus;
    updatedAt: Date;
    lastSeenAt: Date;
    currentPage: string | null;
})[]>;
export declare function getPresenceForUsers(userIds: string[]): Promise<({
    user: {
        id: string;
        name: string | null;
        image: string | null;
        role: import(".prisma/client").$Enums.UserRole | null;
    };
} & {
    userId: string;
    status: import(".prisma/client").$Enums.PresenceStatus;
    updatedAt: Date;
    lastSeenAt: Date;
    currentPage: string | null;
})[]>;
export declare function startTyping(conversationId: string, userId: string): void;
export declare function stopTyping(conversationId: string, userId: string): void;
export declare function isTyping(conversationId: string, userId: string): boolean;
export declare function getTypingUsers(conversationId: string): string[];
export declare function markMessageRead(messageId: string, userId: string): Promise<{
    userId: string;
    id: string;
    messageId: string;
    readAt: Date;
}>;
export declare function getMessageReadReceipts(messageId: string): Promise<({
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
} & {
    userId: string;
    id: string;
    messageId: string;
    readAt: Date;
})[]>;
export declare function markConversationMessagesRead(conversationId: string, userId: string): Promise<{
    count: number;
}>;
export declare function createConversationEvent(data: {
    conversationId: string;
    eventType: string;
    title: string;
    description?: string;
    metadata?: Record<string, unknown>;
    actorId?: string;
    actorName?: string;
}): Promise<{
    id: string;
    createdAt: Date;
    title: string;
    conversationId: string;
    description: string | null;
    metadata: string | null;
    eventType: import(".prisma/client").$Enums.EventType;
    actorId: string | null;
    actorName: string | null;
}>;
export declare function getConversationEvents(conversationId: string): Promise<{
    id: string;
    createdAt: Date;
    title: string;
    conversationId: string;
    description: string | null;
    metadata: string | null;
    eventType: import(".prisma/client").$Enums.EventType;
    actorId: string | null;
    actorName: string | null;
}[]>;
export declare function createNotification(data: {
    userId: string;
    type: string;
    title: string;
    body?: string;
    data?: Record<string, unknown>;
}): Promise<{
    userId: string;
    type: import(".prisma/client").$Enums.NotificationType;
    data: string | null;
    id: string;
    createdAt: Date;
    title: string;
    body: string | null;
    read: boolean;
}>;
export declare function getUserNotifications(userId: string, limit?: number): Promise<{
    userId: string;
    type: import(".prisma/client").$Enums.NotificationType;
    data: string | null;
    id: string;
    createdAt: Date;
    title: string;
    body: string | null;
    read: boolean;
}[]>;
export declare function getUnreadNotificationCount(userId: string): Promise<number>;
export declare function markNotificationRead(notificationId: string): Promise<{
    userId: string;
    type: import(".prisma/client").$Enums.NotificationType;
    data: string | null;
    id: string;
    createdAt: Date;
    title: string;
    body: string | null;
    read: boolean;
}>;
export declare function markAllNotificationsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare function createActivityItem(data: {
    userId: string;
    eventType: string;
    title: string;
    description?: string;
    metadata?: Record<string, unknown>;
    linkUrl?: string;
}): Promise<{
    userId: string;
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    metadata: string | null;
    eventType: import(".prisma/client").$Enums.EventType;
    linkUrl: string | null;
}>;
export declare function getUserActivity(userId: string, limit?: number): Promise<{
    userId: string;
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    metadata: string | null;
    eventType: import(".prisma/client").$Enums.EventType;
    linkUrl: string | null;
}[]>;
export declare function getAllActivity(limit?: number): Promise<({
    user: {
        id: string;
        name: string | null;
        image: string | null;
        role: import(".prisma/client").$Enums.UserRole | null;
    };
} & {
    userId: string;
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    metadata: string | null;
    eventType: import(".prisma/client").$Enums.EventType;
    linkUrl: string | null;
})[]>;
