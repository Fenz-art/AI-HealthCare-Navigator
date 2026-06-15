import { create } from "zustand";
import { api } from "@/lib/api";
import type { Conversation, Message, Attachment, ShareType } from "@/lib/types";

type ConversationsStore = {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  loading: boolean;
  error: string | null;

  fetchConversations: (userId: string) => Promise<void>;
  fetchConversation: (id: string) => Promise<void>;
  sendMessage: (conversationId: string, senderId: string, content: string) => Promise<void>;
  sendAttachment: (
    conversationId: string,
    senderId: string,
    type: string,
    name: string,
    url?: string
  ) => Promise<void>;
  sharePassportInConversation: (conversationId: string, userId: string, shareType?: ShareType) => Promise<void>;
  createConversation: (userIds: { userId: string; role?: string }[], title?: string) => Promise<Conversation>;
  setActiveConversation: (conversation: Conversation | null) => void;
};

export const useConversationsStore = create<ConversationsStore>((set, get) => ({
  conversations: [],
  activeConversation: null,
  loading: false,
  error: null,

  fetchConversations: async (userId) => {
    set({ loading: true, error: null });
    try {
      const conversations = await api.getUserConversations(userId);
      set({ conversations, loading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch conversations";
      set({ error: msg, loading: false });
    }
  },

  fetchConversation: async (id) => {
    set({ loading: true, error: null });
    try {
      const conversation = await api.getConversation(id);
      set({ activeConversation: conversation, loading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch conversation";
      set({ error: msg, loading: false });
    }
  },

  sendMessage: async (conversationId, senderId, content) => {
    try {
      const message = await api.sendMessage(conversationId, {
        senderId,
        senderType: "TRAVELER",
        content,
      });
      const state = get();
      const updateMessages = (conv: Conversation) =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message], updatedAt: message.createdAt }
          : conv;

      set({
        conversations: state.conversations.map(updateMessages),
        activeConversation:
          state.activeConversation?.id === conversationId
            ? updateMessages(state.activeConversation)
            : state.activeConversation,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send message";
      set({ error: msg });
    }
  },

  sharePassportInConversation: async (conversationId, userId, shareType) => {
    try {
      const result = await api.sharePassport({ createdBy: userId, conversationId, shareType });
      const message = await api.sendMessage(conversationId, {
        senderId: userId,
        senderType: "TRAVELER",
        content: `Shared my Health Passport`,
        attachments: [{ type: "passport", name: "Health Passport", url: result.shareUrl }],
      });
      const state = get();
      const updateMessages = (conv: Conversation) =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message], updatedAt: message.createdAt }
          : conv;
      set({
        conversations: state.conversations.map(updateMessages),
        activeConversation:
          state.activeConversation?.id === conversationId
            ? updateMessages(state.activeConversation)
            : state.activeConversation,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to share passport";
      set({ error: msg });
    }
  },

  sendAttachment: async (conversationId, senderId, type, name, url) => {
    try {
      const message = await api.sendMessage(conversationId, {
        senderId,
        senderType: "TRAVELER",
        content: `Shared: ${name}`,
        attachments: [{ type, name, url: url || "#" }],
      });
      const state = get();
      const updateMessages = (conv: Conversation) =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message], updatedAt: message.createdAt }
          : conv;

      set({
        conversations: state.conversations.map(updateMessages),
        activeConversation:
          state.activeConversation?.id === conversationId
            ? updateMessages(state.activeConversation)
            : state.activeConversation,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send attachment";
      set({ error: msg });
    }
  },

  createConversation: async (userIds, title) => {
    const conversation = await api.createConversation(userIds, title);
    set((state) => ({ conversations: [conversation, ...state.conversations] }));
    return conversation;
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation });
  },
}));
