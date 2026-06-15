export type SenderType = 'TRAVELER' | 'ASSISTANT' | 'SYSTEM' | 'AGENT';
export declare function createConversation(userIds: {
    userId: string;
    role?: string;
}[], title?: string): Promise<{
    messages: ({
        attachments: {
            url: string;
            type: string;
            id: string;
            createdAt: Date;
            name: string;
            size: number | null;
            mimeType: string | null;
            messageId: string;
        }[];
    } & {
        status: string;
        sessionId: string | null;
        id: string;
        createdAt: Date;
        senderId: string | null;
        senderType: string;
        content: string;
        assistanceRequestId: string | null;
        conversationId: string | null;
    })[];
    participants: ({
        user: {
            id: string;
            name: string | null;
            image: string | null;
            role: import(".prisma/client").$Enums.UserRole | null;
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
}>;
export declare function getConversation(conversationId: string): Promise<({
    messages: ({
        attachments: {
            url: string;
            type: string;
            id: string;
            createdAt: Date;
            name: string;
            size: number | null;
            mimeType: string | null;
            messageId: string;
        }[];
    } & {
        status: string;
        sessionId: string | null;
        id: string;
        createdAt: Date;
        senderId: string | null;
        senderType: string;
        content: string;
        assistanceRequestId: string | null;
        conversationId: string | null;
    })[];
    participants: ({
        user: {
            id: string;
            name: string | null;
            image: string | null;
            role: import(".prisma/client").$Enums.UserRole | null;
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
}) | null>;
export declare function getUserConversations(userId: string): Promise<({
    messages: ({
        attachments: {
            url: string;
            type: string;
            id: string;
            createdAt: Date;
            name: string;
            size: number | null;
            mimeType: string | null;
            messageId: string;
        }[];
    } & {
        status: string;
        sessionId: string | null;
        id: string;
        createdAt: Date;
        senderId: string | null;
        senderType: string;
        content: string;
        assistanceRequestId: string | null;
        conversationId: string | null;
    })[];
    participants: ({
        user: {
            id: string;
            name: string | null;
            image: string | null;
            role: import(".prisma/client").$Enums.UserRole | null;
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
})[]>;
export declare function sendMessage(data: {
    conversationId: string;
    senderId: string;
    senderType: SenderType;
    content: string;
    attachments?: {
        type: string;
        name: string;
        url: string;
        size?: number;
        mimeType?: string;
    }[];
}): Promise<{
    attachments: {
        url: string;
        type: string;
        id: string;
        createdAt: Date;
        name: string;
        size: number | null;
        mimeType: string | null;
        messageId: string;
    }[];
} & {
    status: string;
    sessionId: string | null;
    id: string;
    createdAt: Date;
    senderId: string | null;
    senderType: string;
    content: string;
    assistanceRequestId: string | null;
    conversationId: string | null;
}>;
export declare function getConversationMessages(conversationId: string, options?: {
    offset?: number;
    limit?: number;
}): Promise<({
    attachments: {
        url: string;
        type: string;
        id: string;
        createdAt: Date;
        name: string;
        size: number | null;
        mimeType: string | null;
        messageId: string;
    }[];
} & {
    status: string;
    sessionId: string | null;
    id: string;
    createdAt: Date;
    senderId: string | null;
    senderType: string;
    content: string;
    assistanceRequestId: string | null;
    conversationId: string | null;
})[]>;
export declare function addParticipant(conversationId: string, userId: string, role?: string): Promise<{
    userId: string;
    id: string;
    role: string | null;
    lastReadAt: Date | null;
    conversationId: string;
}>;
export declare function removeParticipant(conversationId: string, userId: string): Promise<{
    userId: string;
    id: string;
    role: string | null;
    lastReadAt: Date | null;
    conversationId: string;
}>;
export declare function markAsRead(conversationId: string, userId: string): Promise<{
    userId: string;
    id: string;
    role: string | null;
    lastReadAt: Date | null;
    conversationId: string;
}>;
