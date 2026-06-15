"use client";

import { create } from "zustand";

export type SeverityLevel = "SELF_CARE" | "PHARMACY" | "CLINIC" | "HOSPITAL" | "EMERGENCY";

export interface Symptom {
  id: string;
  description: string;
  severity: number; // 1-10
  duration: string;
}

export interface Session {
  id: string;
  status: "active" | "closed" | "pending";
  location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  symptoms: Symptom[];
  severity: SeverityLevel | null;
  recommendedAction: string | null;
  medications: Array<{
    name: string;
    localEquivalent: string;
    dosage: string;
    otc: boolean;
  }>;
  providers: Array<{
    id: string;
    name: string;
    type: "pharmacy" | "clinic" | "hospital";
    distance: string;
    address: string;
    lat: number;
    lng: number;
    openNow: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface SessionState {
  sessions: Session[];
  activeSession: Session | null;

  createSession: (location: Session["location"]) => Session;
  updateSession: (id: string, updates: Partial<Session>) => void;
  setActiveSession: (session: Session | null) => void;
  addSymptom: (sessionId: string, symptom: Symptom) => void;
  closeSession: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  activeSession: null,

  createSession: (location) => {
    const session: Session = {
      id: generateId(),
      status: "active",
      location,
      symptoms: [],
      severity: null,
      recommendedAction: null,
      medications: [],
      providers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({
      sessions: [session, ...s.sessions],
      activeSession: session,
    }));
    return session;
  },

  updateSession: (id, updates) => {
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === id ? { ...sess, ...updates, updatedAt: new Date().toISOString() } : sess
      ),
      activeSession:
        s.activeSession?.id === id
          ? { ...s.activeSession, ...updates, updatedAt: new Date().toISOString() }
          : s.activeSession,
    }));
  },

  setActiveSession: (session) => set({ activeSession: session }),

  addSymptom: (sessionId, symptom) => {
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, symptoms: [...sess.symptoms, symptom] } : sess
      ),
      activeSession:
        s.activeSession?.id === sessionId
          ? { ...s.activeSession, symptoms: [...s.activeSession.symptoms, symptom] }
          : s.activeSession,
    }));
  },

  closeSession: (id) => {
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === id ? { ...sess, status: "closed" as const } : sess
      ),
      activeSession: s.activeSession?.id === id ? null : s.activeSession,
    }));
  },
}));
