import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TravelerType =
  | "solo"
  | "family"
  | "nomad"
  | "business"
  | "student"
  | "senior";

export type UserRole =
  | "PATIENT"
  | "MEDICAL_ASSISTANT"
  | "PHARMACIST"
  | "DOCTOR"
  | "CLINIC_STAFF"
  | "HOSPITAL_STAFF";

export type OnboardingPhase =
  | "role"
  | "identity"
  | "blood"
  | "travel"
  | "health"
  | "contacts"
  | "activation"
  | "pharmacy"
  | "organization"
  | "license";

export type MedicationEntry = {
  name: string;
  dosage: string;
  frequency: string;
};

export type EmergencyContact = {
  name: string;
  relation: string;
  phone: string;
};

export type OnboardingData = {
  role: UserRole | null;
  identity: { name: string; country: string; language: string };
  bloodGroup: string;
  travelerType: TravelerType | null;
  homeCountry: string;
  frequentDestinations: string[];
  upcomingDestination: string;
  dateOfBirth: string;
  hasInsurance: "yes" | "no" | "skip" | null;
  insuranceUploaded: boolean;
  insuranceProvider: string;
  medications: MedicationEntry[];
  allergies: string[];
  medicalHistoryUploaded: boolean;
  conditions: string[];
  emergencyContacts: EmergencyContact[];
  interpreterLanguage: string;
  voiceInterpreterEnabled: boolean;
  // Pharmacist-specific
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacistLicense: string;
  certifications: string;
  // Medical Assistant-specific
  organization: string;
  healthcareExperience: string;
  // Doctor-specific
  specialty: string;
  medicalLicense: string;
};

type OnboardingStore = {
  step: number;
  phase: OnboardingPhase;
  data: OnboardingData;
  setStep: (step: number) => void;
  setPhase: (phase: OnboardingPhase) => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  reset: () => void;
};

const INITIAL_DATA: OnboardingData = {
  role: null,
  identity: { name: "", country: "", language: "en" },
  bloodGroup: "",
  travelerType: null,
  homeCountry: "",
  frequentDestinations: [],
  upcomingDestination: "",
  dateOfBirth: "",
  hasInsurance: null,
  insuranceUploaded: false,
  insuranceProvider: "",
  medications: [],
  allergies: [],
  medicalHistoryUploaded: false,
  conditions: [],
  emergencyContacts: [],
  interpreterLanguage: "en",
  voiceInterpreterEnabled: false,
  pharmacyName: "",
  pharmacyAddress: "",
  pharmacistLicense: "",
  certifications: "",
  organization: "",
  healthcareExperience: "",
  specialty: "",
  medicalLicense: "",
};

export const PHASES: { id: OnboardingPhase; label: string; steps: number[] }[] = [
  { id: "role", label: "Role", steps: [0] },
  { id: "identity", label: "Identity", steps: [1] },
  { id: "blood", label: "Blood Group", steps: [2] },
  { id: "travel", label: "Travel", steps: [3, 4, 5] },
  { id: "health", label: "Health", steps: [6, 7, 8, 9] },
  { id: "contacts", label: "Contacts", steps: [10, 11] },
  { id: "pharmacy", label: "Pharmacy", steps: [2, 3] },
  { id: "organization", label: "Organization", steps: [2, 3] },
  { id: "license", label: "License", steps: [4] },
  { id: "activation", label: "Activation", steps: [12] },
];

export function getPatientSteps(): number[] {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
}

export function getPharmacistSteps(): number[] {
  return [0, 1, 2, 3, 4, 11];
}

export function getDoctorSteps(): number[] {
  return [0, 1, 2, 3, 11];
}

export function getAssistantSteps(): number[] {
  return [0, 1, 2, 3, 11];
}

export function getStaffSteps(): number[] {
  return [0, 1, 2, 3, 11];
}

export function getRoleSteps(role: UserRole | null): number[] {
  switch (role) {
    case "PATIENT": return getPatientSteps();
    case "PHARMACIST": return getPharmacistSteps();
    case "DOCTOR": return getDoctorSteps();
    case "MEDICAL_ASSISTANT": return getAssistantSteps();
    case "CLINIC_STAFF":
    case "HOSPITAL_STAFF": return getStaffSteps();
    default: return getPatientSteps();
  }
}

export function getPhasesForRole(role: UserRole | null): { id: OnboardingPhase; label: string; steps: number[] }[] {
  switch (role) {
    case "PATIENT":
      return [
        { id: "role", label: "Role", steps: [0] },
        { id: "identity", label: "Identity", steps: [1] },
        { id: "blood", label: "Blood Group", steps: [2] },
        { id: "travel", label: "Travel", steps: [3, 4, 5] },
        { id: "health", label: "Health", steps: [6, 7, 8, 9] },
        { id: "contacts", label: "Contacts", steps: [10, 11] },
        { id: "activation", label: "Activation", steps: [12] },
      ];
    case "PHARMACIST":
      return [
        { id: "role", label: "Role", steps: [0] },
        { id: "identity", label: "Identity", steps: [1] },
        { id: "pharmacy", label: "Pharmacy", steps: [2, 3] },
        { id: "license", label: "License", steps: [4] },
        { id: "activation", label: "Activation", steps: [11] },
      ];
    case "DOCTOR":
      return [
        { id: "role", label: "Role", steps: [0] },
        { id: "identity", label: "Identity", steps: [1] },
        { id: "license", label: "License", steps: [2, 3] },
        { id: "activation", label: "Activation", steps: [11] },
      ];
    case "MEDICAL_ASSISTANT":
    case "CLINIC_STAFF":
    case "HOSPITAL_STAFF":
      return [
        { id: "role", label: "Role", steps: [0] },
        { id: "identity", label: "Identity", steps: [1] },
        { id: "organization", label: "Organization", steps: [2, 3] },
        { id: "activation", label: "Activation", steps: [11] },
      ];
    default:
      return [
        { id: "role", label: "Role", steps: [0] },
        { id: "identity", label: "Identity", steps: [1] },
        { id: "blood", label: "Blood Group", steps: [2] },
        { id: "travel", label: "Travel", steps: [3, 4, 5] },
        { id: "health", label: "Health", steps: [6, 7, 8, 9] },
        { id: "contacts", label: "Contacts", steps: [10, 11] },
        { id: "activation", label: "Activation", steps: [12] },
      ];
  }
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      step: 0,
      phase: "role",
      data: INITIAL_DATA,
      setStep: (step) => {
        const phases = getPhasesForRole(useOnboardingStore.getState().data.role);
        const phase = phases.find((p) => p.steps.includes(step))?.id ?? "role";
        set({ step, phase });
      },
      setPhase: (phase) => set({ phase }),
      updateData: (partial) =>
        set((state) => ({ data: { ...state.data, ...partial } })),
      reset: () => set({ step: 0, phase: "role", data: INITIAL_DATA }),
    }),
    { name: "carecompass-onboarding" }
  )
);
