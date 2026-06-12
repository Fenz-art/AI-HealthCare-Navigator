import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionDraft {
  sessionId: string | null;
  location: string;
  countryCode: string;
  lat: number | null;
  lng: number | null;
  symptoms: string[];
  allergies: string[];
  currentMeds: string[];
  duration: string;
}

interface SessionStore extends SessionDraft {
  setSessionId: (sessionId: string | null) => void;
  setLocation: (location: string, countryCode?: string) => void;
  setCoordinates: (lat: number, lng: number) => void;
  toggleSymptom: (symptom: string) => void;
  setSymptoms: (symptoms: string[]) => void;
  toggleAllergy: (allergy: string) => void;
  setAllergies: (allergies: string[]) => void;
  addCurrentMed: (med: string) => void;
  removeCurrentMed: (med: string) => void;
  setCurrentMeds: (meds: string[]) => void;
  setDuration: (duration: string) => void;
  resetDraft: () => void;
}

const initialDraft: SessionDraft = {
  sessionId: null,
  location: "",
  countryCode: "US",
  lat: null,
  lng: null,
  symptoms: [],
  allergies: [],
  currentMeds: [],
  duration: "",
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      ...initialDraft,

      setSessionId: (sessionId) => set({ sessionId }),

      setLocation: (location, countryCode) =>
        set((state) => ({
          location,
          countryCode: countryCode ?? state.countryCode,
        })),

      setCoordinates: (lat, lng) => set({ lat, lng }),

      toggleSymptom: (symptom) =>
        set((state) => ({
          symptoms: state.symptoms.includes(symptom)
            ? state.symptoms.filter((item) => item !== symptom)
            : [...state.symptoms, symptom],
        })),

      setSymptoms: (symptoms) => set({ symptoms }),

      toggleAllergy: (allergy) =>
        set((state) => ({
          allergies: state.allergies.includes(allergy)
            ? state.allergies.filter((item) => item !== allergy)
            : [...state.allergies, allergy],
        })),

      setAllergies: (allergies) => set({ allergies }),

      addCurrentMed: (med) =>
        set((state) => ({
          currentMeds: state.currentMeds.includes(med)
            ? state.currentMeds
            : [...state.currentMeds, med],
        })),

      removeCurrentMed: (med) =>
        set((state) => ({
          currentMeds: state.currentMeds.filter((item) => item !== med),
        })),

      setCurrentMeds: (currentMeds) => set({ currentMeds }),

      setDuration: (duration) => set({ duration }),

      resetDraft: () => set(initialDraft),
    }),
    {
      name: "carecompass-session-draft",
      partialize: (state) => ({
        sessionId: state.sessionId,
        location: state.location,
        countryCode: state.countryCode,
        lat: state.lat,
        lng: state.lng,
        symptoms: state.symptoms,
        allergies: state.allergies,
        currentMeds: state.currentMeds,
        duration: state.duration,
      }),
    }
  )
);
