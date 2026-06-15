import { create } from "zustand";
import { api } from "@/lib/api";
import type { Notification } from "@/lib/types";

type NotificationsStore = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;

  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
};

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async (userId) => {
    set({ loading: true });
    try {
      const result = await api.getUserNotifications(userId);
      set({ notifications: result.notifications, unreadCount: result.unreadCount, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await api.markNotificationRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {}
  },

  markAllAsRead: async (userId) => {
    try {
      await api.markAllNotificationsRead(userId);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch {}
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
    }));
  },
}));
