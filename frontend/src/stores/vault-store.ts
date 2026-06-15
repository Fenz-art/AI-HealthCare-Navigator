import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VaultDocument = {
  id: string;
  name: string;
  type: string;
  date: string;
  translated: boolean;
  category: string;
  source: "upload" | "onboarding";
};

type VaultStore = {
  documents: VaultDocument[];
  addDocument: (doc: VaultDocument) => void;
  addDocuments: (docs: VaultDocument[]) => void;
  populateFromOnboarding: (data: {
    hasInsurance: boolean;
    insuranceUploaded: boolean;
    medications: { name: string; dosage: string }[];
    allergies: string[];
    conditions: string[];
    medicalHistoryUploaded: boolean;
    bloodGroup: string;
  }) => void;
};

export const useVaultStore = create<VaultStore>()(
  persist(
    (set) => ({
      documents: [
        { id: "v1", name: "Prescription · Lisinopril", type: "Prescription", date: "Mar 2026", translated: true, category: "medications", source: "upload" },
        { id: "v2", name: "Vaccination record", type: "Immunization", date: "Jan 2026", translated: false, category: "immunizations", source: "upload" },
      ],
      addDocument: (doc) => set((s) => ({ documents: [...s.documents, doc] })),
      addDocuments: (docs) => set((s) => ({ documents: [...s.documents, ...docs] })),
      populateFromOnboarding: (data) => {
        const docs: VaultDocument[] = [];
        const now = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

        if (data.insuranceUploaded) {
          docs.push({ id: `onb_ins_${Date.now()}`, name: "Insurance card", type: "Insurance", date: now, translated: false, category: "insurance", source: "onboarding" });
        }
        if (data.medicalHistoryUploaded) {
          docs.push({ id: `onb_hist_${Date.now()}`, name: "Medical history summary", type: "History", date: now, translated: true, category: "history", source: "onboarding" });
        }
        if (data.medications.length > 0) {
          data.medications.forEach((m, i) => {
            docs.push({ id: `onb_med_${i}_${Date.now()}`, name: `Prescription · ${m.name}`, type: "Prescription", date: now, translated: true, category: "medications", source: "onboarding" });
          });
        }
        if (data.allergies.filter((a) => a !== "None").length > 0) {
          docs.push({ id: `onb_all_${Date.now()}`, name: `Allergies: ${data.allergies.filter((a) => a !== "None").join(", ")}`, type: "Allergy Record", date: now, translated: true, category: "history", source: "onboarding" });
        }
        if (data.conditions.filter((c) => c !== "None").length > 0) {
          docs.push({ id: `onb_cond_${Date.now()}`, name: `Conditions: ${data.conditions.filter((c) => c !== "None").join(", ")}`, type: "Condition Record", date: now, translated: true, category: "history", source: "onboarding" });
        }
        if (data.bloodGroup) {
          docs.push({ id: `onb_bg_${Date.now()}`, name: `Blood Type: ${data.bloodGroup}`, type: "Blood Type", date: now, translated: true, category: "history", source: "onboarding" });
        }

        if (docs.length > 0) {
          set((s) => {
            const existing = new Set(s.documents.map((d) => d.name));
            const newDocs = docs.filter((d) => !existing.has(d.name));
            return { documents: [...s.documents, ...newDocs] };
          });
        }
      },
    }),
    { name: "carecompass-vault" }
  )
);
