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
  storageUrl?: string | null;
  extractedText?: string | null;
  translatedText?: string | null;
  processingStatus?: string;
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

// ── Conversation Types ───────────────────────────────────────────────

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  role: string | null;
  lastReadAt: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    role: string | null;
  };
}

export interface Attachment {
  id: string;
  messageId: string;
  type: string;
  name: string;
  url: string;
  size: number | null;
  mimeType: string | null;
  createdAt: string;
}

export interface Message {
  id: string;
  sessionId: string | null;
  conversationId: string | null;
  senderId: string | null;
  senderType: string;
  content: string;
  status?: string;
  createdAt: string;
  attachments: Attachment[];
}

export interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
  messages: Message[];
}

// ── Agent Task Types ─────────────────────────────────────────────────

// ── Journey Types ────────────────────────────────────────────────────

export type OutcomeStatus = "RECOVERED" | "IMPROVED" | "UNCHANGED" | "WORSENED";

export interface HealthcareJourney {
  id:               string;
  userId:           string;
  sessionId:        string | null;
  country:          string;
  city:             string | null;
  symptoms:         string[];
  severity:         string;
  recommendation:   string;
  medicationFound:  boolean;
  medicationId:     string | null;
  providerVisited:  boolean;
  providerId:       string | null;
  interpreterUsed:  boolean;
  outcomeStatus:    OutcomeStatus;
  recoveryTimeDays: number | null;
  notes:            string | null;
  createdAt:        string;
}

export interface CreateJourneyPayload {
  userId:           string;
  sessionId?:       string;
  country:          string;
  city?:            string;
  symptoms:         string[];
  severity:         string;
  recommendation:   string;
  medicationFound?: boolean;
  medicationId?:    string;
  providerVisited?: boolean;
  providerId?:      string;
  interpreterUsed?: boolean;
  outcomeStatus:    OutcomeStatus;
  recoveryTimeDays?: number;
  notes?:           string;
}

export interface UpdateJourneyOutcomePayload {
  medicationFound?:  boolean;
  providerVisited?:  boolean;
  interpreterUsed?:  boolean;
  outcomeStatus?:    OutcomeStatus;
  recoveryTimeDays?: number;
  notes?:            string;
}

export type TaskStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type TaskType = "TRANSLATE_DOCUMENT" | "EXTRACT_MEDICAL_DATA" | "UPDATE_PASSPORT" | "GENERATE_SUMMARY" | "PROCESS_UPLOAD" | "SHARE_PASSPORT" | "EXTRACT_CONDITIONS" | "EXTRACT_MEDICATIONS" | "GENERATE_PROVIDER_SUMMARY" | "GENERATE_PHARMACIST_SUMMARY" | "GENERATE_DOCTOR_SUMMARY" | "GENERATE_TRAVEL_PACKAGE" | "GENERATE_CLINICAL_SUMMARY" | "GENERATE_MEDICATION_TIMELINE" | "GENERATE_CONDITION_TIMELINE" | "GENERATE_VACCINATION_HISTORY" | "TRANSLATE_PRESCRIPTION" | "FIND_MEDICATION_EQUIVALENTS" | "GENERATE_MEDICATION_SUMMARY" | "TRANSLATE_DOCUMENTS" | "PREPARE_PASSPORT_PACKAGE" | "PREPARE_INSURANCE_SUMMARY" | "PREPARE_VISIT_SUMMARY";
export type ProcessingStatus = "PENDING" | "STORING" | "OCR" | "DETECTING_LANGUAGE" | "TRANSLATING" | "EXTRACTING" | "UPDATING_MEMORY" | "UPDATING_PASSPORT" | "COMPLETED" | "FAILED";
export type MedicalEntityType = "CONDITION" | "MEDICATION" | "ALLERGY" | "PROCEDURE" | "VACCINATION" | "INSURANCE" | "EMERGENCY_CONTACT";
export type MemoryType = "CONDITION" | "MEDICATION" | "ALLERGY" | "PROCEDURE" | "VACCINATION" | "INSURANCE" | "EMERGENCY_CONTACT" | "LAB_RESULT" | "VITAL_SIGN";

export interface AgentTask {
  id: string;
  userId: string;
  type: TaskType;
  status: TaskStatus;
  progress: number;
  title: string;
  description: string | null;
  input: string | null;
  output: string | null;
  error: string | null;
  documentId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Document Processing Job Types ─────────────────────────────────

export type JobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export interface DocumentProcessingJob {
  id: string;
  documentId: string;
  status: JobStatus;
  currentStep: string;
  progress: number;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

// ── Extracted Entity Types ────────────────────────────────────────

export interface ExtractedMedicalEntity {
  id: string;
  userId: string;
  entityType: MedicalEntityType;
  value: string;
  confidence: number;
  sourceDocId: string | null;
  language: string | null;
}

// ── Medical Memory Types ──────────────────────────────────────────

export interface MedicalMemory {
  id: string;
  userId: string;
  memoryType: MemoryType;
  value: string;
  source: string;

  // Provenance (Sprint 7.5)
  sourceType: string;
  sourceSessionId?: string | null;
  sourceDocumentId?: string | null;
  confidence?: number | null;

  // Verification
  verified: boolean;
  verifiedAt?: string | null;
  verifiedBy?: string | null;

  createdAt: string;
}



export interface MemorySummary {
  conditions: string[];
  medications: string[];
  allergies: string[];
  procedures: string[];
  vaccinations: string[];
  insurance: string[];
  emergencyContacts: string[];
  labResults: string[];
  vitalSigns: string[];
}

export interface GroupedTasks {
  running: AgentTask[];
  queued: AgentTask[];
  completed: AgentTask[];
  failed: AgentTask[];
  cancelled: AgentTask[];
  all: AgentTask[];
}

// ── Medical Extraction Types ─────────────────────────────────────────

export interface MedicalExtraction {
  id: string;
  documentId: string;
  conditions: string | null;
  medications: string | null;
  allergies: string | null;
  procedures: string | null;
  insuranceMeta: string | null;
  vitalSigns: string | null;
  labResults: string | null;
  extractedAt: string;
}

export interface HealthDocumentWithExtraction extends HealthDocument {
  extraction: MedicalExtraction | null;
}

// ── Passport Sharing Types ───────────────────────────────────────────

export type ShareType = "QUICK" | "PROVIDER" | "EMERGENCY";

export interface SharedPassportResult {
  id: string;
  shareToken: string;
  shareUrl: string;
  shareType: ShareType;
  qrCodeUrl: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface SharedPassportView {
  passport: {
    bloodGroup: string | null;
    allergies: string[];
    currentMedications: string[];
    chronicConditions: string[];
    vaccinations: string[];
    emergencyContacts: string[];
  };
  user: {
    name: string | null;
    bloodGroup: string | null;
    homeCountry: string | null;
    preferredLanguage: string | null;
  };
  shareType: ShareType;
  sharedAt: string;
}

export interface ShareTimelineItem {
  id: string;
  shareToken: string;
  shareType: ShareType;
  shareUrl: string;
  expiresAt: string | null;
  revoked: boolean;
  accessCount: number;
  lastViewedAt: string | null;
  createdAt: string;
  conversation: { id: string; title: string | null } | null;
}

// ── Sprint 4: Real-Time Communication Types ─────────────────────────

export type PresenceStatus = "ONLINE" | "AWAY" | "OFFLINE";

export interface UserPresence {
  userId: string;
  status: PresenceStatus;
  lastSeenAt: string;
  currentPage: string | null;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
    role: string | null;
  };
}

export interface MessageRead {
  id: string;
  messageId: string;
  userId: string;
  readAt: string;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface InterpreterSession {
  id: string;
  patientId: string;
  providerId: string | null;
  sessionId: string | null;
  conversationId: string | null;
  sourceLanguage: string;
  targetLanguage: string;
  active: boolean;
  transcript: TranscriptEntry[];
  durationSeconds: number | null;
  mode: string;
  startedAt: string;
  endedAt: string | null;
}

export interface TranscriptEntry {
  role: 'patient' | 'provider' | 'system';
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: string;
}

export type EventType =
  | "PASSPORT_SHARED"
  | "MEDICAL_RECORD_UPLOADED"
  | "TRANSLATION_GENERATED"
  | "INTERPRETER_STARTED"
  | "INTERPRETER_ENDED"
  | "PROVIDER_SUMMARY_SHARED"
  | "DOCUMENT_PROCESSED"
  | "AGENT_TASK_COMPLETED"
  | "JOURNEY_COMPLETED"
  | "PROVIDER_VIEWED_PASSPORT"
  | "MESSAGE_SENT"
  | "TRANSCRIPT_AVAILABLE"
  | "PATIENT_JOINED"
  | "ASSISTANT_JOINED"
  | "PHARMACIST_JOINED"
  | "DOCTOR_JOINED";

export interface ConversationEvent {
  id: string;
  conversationId: string;
  eventType: EventType;
  title: string;
  description: string | null;
  metadata: string | null;
  actorId: string | null;
  actorName: string | null;
  createdAt: string;
}

export type NotificationType =
  | "PASSPORT_VIEWED"
  | "DOCUMENT_PROCESSED"
  | "TRANSLATION_READY"
  | "MESSAGE_RECEIVED"
  | "AGENT_TASK_COMPLETE"
  | "PROVIDER_RESPONSE"
  | "INTERPRETER_READY"
  | "SHARE_ACCESSED";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: string | null;
  read: boolean;
  createdAt: string;
}

// ── Sprint 5: Provider Workspace Types ─────────────────────────────

export type VerificationStatus = "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";
export type VerificationType = "LICENSE" | "PHARMACY" | "ORGANIZATION";

export interface ProviderWorkspace {
  id: string;
  userId: string;
  role: string;
  specialties: string[] | null;
  languages: string[] | null;
  organization: string | null;
  availability: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  verifications: Verification[];
}

export interface Verification {
  id: string;
  providerId: string;
  type: VerificationType;
  status: VerificationStatus;
  documentUrl: string | null;
  documentName: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  notes: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  eventType: EventType;
  title: string;
  description: string | null;
  metadata: string | null;
  linkUrl: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
    role: string | null;
  };
}

// ── Sprint 6: Healthcare Knowledge Platform Types ────────────────────

export interface MedicationReference {
  id: string;
  sourceId: string;
  sourceType: string;
  country: string;
  brandName: string;
  ingredient: string;
  strength: string | null;
  otc: boolean | null;
  route: string | null;
  manufacturer: string | null;
  meta: string | null;
  importedAt: string;
}

export interface DataSource {
  id: string;
  name: string;
  country: string | null;
  sourceType: string;
  lastSyncAt: string | null;
  active: boolean;
  createdAt: string;
  jobs?: IngestionJob[];
}

export interface IngestionJob {
  id: string;
  dataSourceId: string;
  sourceType: string;
  status: "QUEUED" | "RUNNING" | "FAILED" | "COMPLETED";
  progress: number;
  recordsImported: number;
  recordsFailed: number;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  dataSource?: DataSource;
}

export interface IngestionStats {
  sources: DataSource[];
  totalReferences: number;
  countriesCovered: string[];
  totalJobs: number;
  failedJobs: number;
}

export interface AdminStats {
  users: number;
  sessions: number;
  tasks: number;
  medicationReferences: number;
  brands: number;
  providers: number;
}
