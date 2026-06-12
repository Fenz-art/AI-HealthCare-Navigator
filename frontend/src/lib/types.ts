export type SeverityLevel =
  | "SELF_CARE"
  | "PHARMACY"
  | "CLINIC"
  | "HOSPITAL"
  | "EMERGENCY";

export type WorkflowAction =
  | "SELF_CARE"
  | "CALL_EMERGENCY_SERVICES"
  | "PHARMACY"
  | "CLINIC"
  | "HOSPITAL";

export interface SeverityResult {
  severity: SeverityLevel;
  reasoning: string;
  suggestedAction: string;
}

export interface CreateSessionPayload {
  location?: string;
  countryCode?: string;
  symptoms: string[];
  duration?: string;
  allergies?: string[];
  currentMeds?: string[];
  includedPassport?: boolean;
  includedDocuments?: string[];
  lat?: number;
  lng?: number;
}

export interface TravelHealthSession {
  id: string;
  caseId: string;
  userId?: string | null;
  location: string | null;
  countryId: string | null;
  countryCode: string | null;
  includedPassport: boolean;
  includedDocuments: string[] | null;
  lat: number | null;
  lng: number | null;
  symptoms: string[];
  duration: string | null;
  allergies: string[];
  currentMeds: string[];
  severity: SeverityLevel | null;
  medRecs: MedicationRecommendation[] | null;
  providerRecs: ProviderRecommendation[] | null;
  interpreterContext: string | null;
  interpreterContextTranslated: string | null;
  targetLanguage: string;
  outcome: OutcomePayload | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthPassport {
  bloodGroup?: string;
  allergies?: string[];
  currentMedications?: string[];
  chronicConditions?: string[];
  vaccinations?: string[];
  emergencyContacts?: { name: string; phone: string; relation?: string }[];
}

export interface HealthDocument {
  id: string;
  title: string;
  type: string;
  sourceCountry?: string | null;
  originalLanguage?: string | null;
  fileUrl: string;
  extractedText?: string | null;
  translatedText?: string | null;
  isSharedInSession: boolean;
  uploadedAt: string;
}

export interface MedicationRecommendation {
  id: string;
  brand: {
    id: string;
    name: string;
    otcStatus: string;
    doseRule: string;
  };
  activeIngredient: {
    id: string;
    name: string;
  };
  country: {
    id: string;
    name: string;
    code: string;
  };
}

export interface ProviderRecommendation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  externalId?: string;
  type: "PHARMACY" | "CLINIC" | "HOSPITAL";
}

export interface WorkflowPayload {
  sessionId: string;
  lat: number;
  lng: number;
  countryCode: string;
}

export interface WorkflowResult {
  sessionId: string;
  severity: SeverityResult;
  action: WorkflowAction;
  medications: MedicationRecommendation[];
  providers: ProviderRecommendation[];
  interpreterContext: string;
  interpreterContextTranslated: string;
  targetLanguage: string;
}

export interface InterpreterResponse {
  interpreterContext: string;
  interpreterContextEnglish: string;
  interpreterContextTranslated: string;
  countryCode: string;
  targetLanguage: string;
}

export interface OutcomePayload {
  receivedHelp: boolean;
  purchasedMedication: boolean;
  symptomsImproved: boolean;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
