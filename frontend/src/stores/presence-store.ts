import { create } from "zustand";
import { api } from "@/lib/api";
import type { UserPresence, PresenceStatus } from "@/lib/types";

type PresenceStore = {
  presences: Map<string, UserPresence>;
  onlineUsers: UserPresence[];
  currentUserId: string | null;
  heartbeatInterval: ReturnType<typeof setInterval> | null;

  updatePresence: (userId: string, status: PresenceStatus, currentPage?: string) => Promise<void>;
  fetchPresence: (userId: string) => Promise<void>;
  fetchOnlineUsers: () => Promise<void>;
  fetchPresencesForUsers: (userIds: string[]) => Promise<void>;
  setCurrentUserId: (userId: string | null) => void;
  startHeartbeat: (userId: string) => void;
  stopHeartbeat: () => void;
};

export const usePresenceStore = create<PresenceStore>((set, get) => ({
  presences: new Map(),
  onlineUsers: [],
  currentUserId: null,
  heartbeatInterval: null,

  updatePresence: async (userId, status, currentPage) => {
    try {
      const presence = await api.updatePresence(userId, status, currentPage);
      set((state) => {
        const newMap = new Map(state.presences);
        newMap.set(userId, presence);
        return { presences: newMap };
      });
    } catch {}
  },

  fetchPresence: async (userId) => {
    try {
      const presence = await api.getUserPresence(userId);
      set((state) => {
        const newMap = new Map(state.presences);
        newMap.set(userId, presence);
        return { presences: newMap };
      });
    } catch {}
  },

  fetchOnlineUsers: async () => {
    try {
      const users = await api.getOnlineUsers();
      set({ onlineUsers: users });
    } catch {}
  },

  fetchPresencesForUsers: async (userIds) => {
    try {
      const presences = await api.getPresenceForUsers(userIds);
      set((state) => {
        const newMap = new Map(state.presences);
        presences.forEach((p) => newMap.set(p.userId, p));
        return { presences: newMap };
      });
    } catch {}
  },

  setCurrentUserId: (userId) => {
    set({ currentUserId: userId });
  },

  startHeartbeat: (userId) => {
    get().stopHeartbeat();
    get().updatePresence(userId, "ONLINE");
    const interval = setInterval(() => {
      get().updatePresence(userId, "ONLINE");
    }, 30000);
    set({ heartbeatInterval: interval });

    const handleVisibility = () => {
      if (document.hidden) {
        get().updatePresence(userId, "AWAY");
      } else {
        get().updatePresence(userId, "ONLINE");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    window.addEventListener("beforeunload", () => {
      get().updatePresence(userId, "OFFLINE");
    });
  },

  stopHeartbeat: () => {
    const interval = get().heartbeatInterval;
    if (interval) {
      clearInterval(interval);
      set({ heartbeatInterval: null });
    }
  },
}));
