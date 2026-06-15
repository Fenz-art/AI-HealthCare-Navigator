import { create } from "zustand";
import { api } from "@/lib/api";
import type { ActivityItem } from "@/lib/types";

type ActivityStore = {
  activities: ActivityItem[];
  allActivities: ActivityItem[];
  loading: boolean;

  fetchUserActivity: (userId: string, limit?: number) => Promise<void>;
  fetchAllActivity: (limit?: number) => Promise<void>;
  addActivityItem: (item: ActivityItem) => void;
};

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  allActivities: [],
  loading: false,

  fetchUserActivity: async (userId, limit) => {
    set({ loading: true });
    try {
      const activities = await api.getUserActivity(userId, limit);
      set({ activities, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchAllActivity: async (limit) => {
    set({ loading: true });
    try {
      const activities = await api.getAllActivity(limit);
      set({ allActivities: activities, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addActivityItem: (item) => {
    set((state) => ({
      activities: [item, ...state.activities],
      allActivities: [item, ...state.allActivities],
    }));
  },
}));
