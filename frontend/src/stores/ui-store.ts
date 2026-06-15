"use client";

import { create } from "zustand";

interface UIState {
  commandPaletteOpen: boolean;
  sidebarCollapsed: boolean;
  activeTab: string;
  isEmergencyMode: boolean;
  activeSessionId: string | null;

  setCommandPaletteOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  setEmergencyMode: (mode: boolean) => void;
  setActiveSessionId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  commandPaletteOpen: false,
  sidebarCollapsed: false,
  activeTab: "overview",
  isEmergencyMode: false,
  activeSessionId: null,

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setEmergencyMode: (mode) => set({ isEmergencyMode: mode }),
  setActiveSessionId: (id) => set({ activeSessionId: id }),
}));
