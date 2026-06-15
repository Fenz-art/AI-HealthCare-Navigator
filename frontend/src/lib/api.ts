import type {
  ApiError,
  CreateSessionPayload,
  HealthDocument,
  HealthPassport,
  InterpreterResponse,
  InterpreterSession,
  OutcomePayload,
  TravelHealthSession,
  WorkflowPayload,
  WorkflowResult,
  Conversation,
  Message,
  AgentTask,
  TaskStatus,
  HealthDocumentWithExtraction,
  SharedPassportResult,
  SharedPassportView,
  ShareTimelineItem,
  ShareType,
  HealthcareJourney,
  CreateJourneyPayload,
  UpdateJourneyOutcomePayload,
  DocumentProcessingJob,
  ExtractedMedicalEntity,
  MedicalMemory,
  MemorySummary,
  GroupedTasks,
  MemoryType,
  UserPresence,
  MessageRead,
  ConversationEvent,
  Notification,
  ActivityItem,
  ProviderWorkspace,
  Verification,
  VerificationStatus,
  VerificationType,
  MedicationReference,
  IngestionJob,
  DataSource,
  IngestionStats,
  AdminStats,
} from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = payload as ApiError;
    throw new ApiClientError(
      error.error ?? `Request failed with status ${response.status}`,
      response.status,
      error.details
    );
  }

  return payload as T;
}

export const api = {
  health: () => request<{ status: string }>("/health"),

  createSession: (body: CreateSessionPayload) =>
    request<TravelHealthSession>("/sessions", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getSession: (sessionId: string) =>
    request<TravelHealthSession>(`/sessions/${sessionId}`),

  runWorkflow: (body: WorkflowPayload) =>
    request<{ success: boolean; data: WorkflowResult }>("/workflow", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getInterpreter: (sessionId: string) =>
    request<InterpreterResponse>(`/sessions/${sessionId}/interpreter`),

  getHealthVault: (userId: string) =>
    request<{ healthPassport: HealthPassport | null; healthDocuments: HealthDocument[] }>(
      `/users/${userId}/vault`
    ),

  updateSessionConsent: (sessionId: string, data: { includePassport: boolean; includedDocuments: string[] }) =>
    request<TravelHealthSession>(`/sessions/${sessionId}/consent`, {
      method: "POST",
      body: JSON.stringify({
        includedPassport: data.includePassport,
        includedDocuments: data.includedDocuments,
      }),
    }),

  uploadHealthDocument: (body: {
    userId: string;
    title: string;
    type: string;
    sourceCountry?: string;
    originalLanguage: string;
    extractedText: string;
  }) =>
    request<{ success: boolean; data: HealthDocument }>("/vault/upload", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  recordOutcome: (sessionId: string, body: OutcomePayload) =>
    request<TravelHealthSession>(`/sessions/${sessionId}/outcome`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMedications: (ingredient: string, countryCode: string) =>
    request<unknown[]>(
      `/medications?ingredient=${encodeURIComponent(ingredient)}&countryCode=${encodeURIComponent(countryCode)}`
    ),

  getProviders: (
    lat: number,
    lng: number,
    type: "PHARMACY" | "CLINIC" | "HOSPITAL",
    radius = 5000
  ) =>
    request<unknown[]>(
      `/providers?lat=${lat}&lng=${lng}&type=${type}&radius=${radius}`
    ),

  // ── Conversations ────────────────────────────────────────────────

  createConversation: (userIds: { userId: string; role?: string }[], title?: string) =>
    request<Conversation>("/conversations", {
      method: "POST",
      body: JSON.stringify({ userIds, title }),
    }),

  getUserConversations: (userId: string) =>
    request<Conversation[]>(`/conversations/user/${userId}`),

  getConversation: (id: string) =>
    request<Conversation>(`/conversations/${id}`),

  sendMessage: (conversationId: string, data: {
    senderId: string;
    senderType: string;
    content: string;
    attachments?: { type: string; name: string; url: string; size?: number; mimeType?: string }[];
  }) =>
    request<Message>(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getConversationMessages: (conversationId: string, offset?: number, limit?: number) =>
    request<Message[]>(`/conversations/${conversationId}/messages?offset=${offset ?? 0}&limit=${limit ?? 100}`),

  addParticipant: (conversationId: string, userId: string, role?: string) =>
    request<unknown>(`/conversations/${conversationId}/participants`, {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    }),

  removeParticipant: (conversationId: string, userId: string) =>
    request<unknown>(`/conversations/${conversationId}/participants/${userId}`, {
      method: "DELETE",
    }),

  markConversationRead: (conversationId: string, userId: string) =>
    request<unknown>(`/conversations/${conversationId}/read`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  // ── Agent Tasks ──────────────────────────────────────────────────

  createTask: (data: {
    userId: string;
    type: string;
    title: string;
    description?: string;
    input?: Record<string, unknown>;
    documentId?: string;
  }) =>
    request<AgentTask>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getTask: (taskId: string) =>
    request<AgentTask>(`/tasks/${taskId}`),

  getUserTasks: (userId: string, status?: TaskStatus, limit?: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (limit) params.set("limit", String(limit));
    return request<AgentTask[]>(`/tasks/user/${userId}?${params}`);
  },

  updateTask: (taskId: string, data: { progress?: number; status?: string; output?: Record<string, unknown>; error?: string }) =>
    request<AgentTask>(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  executeTask: (taskId: string) =>
    request<{ success: boolean; message: string; taskId: string }>(`/tasks/${taskId}/execute`, {
      method: "POST",
    }),

  // ── Vault Intelligence ───────────────────────────────────────────

  processDocumentUpload: (data: {
    userId: string;
    title: string;
    type: string;
    sourceCountry?: string;
    originalLanguage: string;
    extractedText: string;
  }) =>
    request<{ success: boolean; data: { document: HealthDocument; extraction: unknown } }>("/vault/process", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getDocumentWithExtraction: (documentId: string) =>
    request<HealthDocumentWithExtraction>(`/vault/documents/${documentId}`),

  getUserVaultWithExtractions: (userId: string) =>
    request<{ healthPassport: HealthPassport | null; healthDocuments: HealthDocumentWithExtraction[] }>(
      `/users/${userId}/vault/extractions`
    ),

  syncPassportFromExtractions: (userId: string) =>
    request<{ success: boolean; data: unknown }>(`/users/${userId}/passport/sync`, {
      method: "POST",
    }),

  // ── Document Processing Pipeline ─────────────────────────────────

  processDocumentPipeline: (data: {
    userId: string;
    title: string;
    type: string;
    sourceCountry?: string;
    originalLanguage?: string;
    extractedText: string;
    storageUrl?: string;
  }) =>
    request<{ success: boolean; data: { document: HealthDocument; job: unknown; extraction: unknown; memories: unknown } }>(
      "/vault/process/pipeline", { method: "POST", body: JSON.stringify(data) }
    ),

  getDocumentProcessingJobs: (documentId: string) =>
    request<DocumentProcessingJob[]>(`/vault/documents/${documentId}/jobs`),

  getDocumentEntities: (documentId: string) =>
    request<ExtractedMedicalEntity[]>(`/vault/documents/${documentId}/entities`),

  // ── Medical Memory ───────────────────────────────────────────────

  getUserMedicalMemory: (userId: string, memoryType?: MemoryType) => {
    const params = memoryType ? `?memoryType=${memoryType}` : "";
    return request<MedicalMemory[]>(`/memory/${userId}${params}`);
  },

  getMemorySummary: (userId: string) =>
    request<MemorySummary>(`/memory/${userId}/summary`),

  addMedicalMemory: (data: {
    userId: string;
    memoryType: string;
    value: string;
    source?: string;
    verified?: boolean;
  }) =>
    request<MedicalMemory>("/memory", { method: "POST", body: JSON.stringify(data) }),

  deleteMedicalMemory: (memoryId: string) =>
    request<{ success: boolean }>(`/memory/${memoryId}`, { method: "DELETE" }),

  verifyMedicalMemory: (memoryId: string) =>
    request<MedicalMemory>(`/memory/${memoryId}/verify`, { method: "POST" }),

  // ── Grouped Tasks ────────────────────────────────────────────────

  getUserTasksGrouped: (userId: string) =>
    request<GroupedTasks>(`/tasks/user/${userId}/grouped`),

  getTaskWithDocument: (taskId: string) =>
    request<AgentTask & { document: HealthDocumentWithExtraction | null }>(`/tasks/${taskId}/detailed`),

  // ── Passport Sharing ─────────────────────────────────────────────

  sharePassport: (data: {
    passportId?: string;
    createdBy: string;
    conversationId?: string;
    shareType?: ShareType;
  }) =>
    request<SharedPassportResult>("/passport/share", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getSharedPassport: (token: string) =>
    request<SharedPassportView>(`/passport/shared/${token}`),

  getUserSharedPassports: (userId: string) =>
    request<unknown[]>(`/passport/shares/${userId}`),

  revokeShare: (token: string, userId: string) =>
    request<{ success: boolean }>(`/passport/revoke/${token}`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  getShareTimeline: (userId: string) =>
    request<ShareTimelineItem[]>(`/passport/timeline/${userId}`),

  getShareQrCode: (token: string) =>
    request<{ qrCodeUrl: string }>(`/passport/qr/${token}`),

  // ── Journeys ─────────────────────────────────────────────────────

  createJourney: (body: CreateJourneyPayload) =>
    request<HealthcareJourney>("/journeys", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getUserJourneys: (userId: string) =>
    request<HealthcareJourney[]>(`/journeys?userId=${encodeURIComponent(userId)}`),

  getJourney: (journeyId: string) =>
    request<HealthcareJourney>(`/journeys/${journeyId}`),

  updateJourneyOutcome: (journeyId: string, body: UpdateJourneyOutcomePayload) =>
    request<HealthcareJourney>(`/journeys/${journeyId}/outcome`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // ── Sprint 4: Real-Time Communication ──────────────────────────

  // Presence
  updatePresence: (userId: string, status: string, currentPage?: string) =>
    request<UserPresence>("/presence", {
      method: "POST",
      body: JSON.stringify({ userId, status, currentPage }),
    }),

  getUserPresence: (userId: string) =>
    request<UserPresence>(`/presence/${userId}`),

  getOnlineUsers: () =>
    request<UserPresence[]>("/presence/online"),

  getPresenceForUsers: (userIds: string[]) =>
    request<UserPresence[]>("/presence/batch", {
      method: "POST",
      body: JSON.stringify({ userIds }),
    }),

  // Read Receipts
  markMessageRead: (messageId: string, userId: string) =>
    request<MessageRead>(`/messages/${messageId}/read`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  getMessageReadReceipts: (messageId: string) =>
    request<MessageRead[]>(`/messages/${messageId}/receipts`),

  markConversationReadAll: (conversationId: string, userId: string) =>
    request<{ count: number }>(`/conversations/${conversationId}/read-all`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  // Conversation Events
  createConversationEvent: (conversationId: string, data: {
    eventType: string;
    title: string;
    description?: string;
    metadata?: Record<string, unknown>;
    actorId?: string;
    actorName?: string;
  }) =>
    request<ConversationEvent>(`/conversations/${conversationId}/events`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getConversationEvents: (conversationId: string) =>
    request<ConversationEvent[]>(`/conversations/${conversationId}/events`),

  // Notifications
  getUserNotifications: (userId: string, limit?: number) =>
    request<{ notifications: Notification[]; unreadCount: number }>(
      `/notifications/${userId}${limit ? `?limit=${limit}` : ""}`
    ),

  getUnreadNotificationCount: (userId: string) =>
    request<{ count: number }>(`/notifications/${userId}/unread-count`),

  markNotificationRead: (notificationId: string) =>
    request<{ success: boolean }>(`/notifications/${notificationId}/read`, {
      method: "POST",
    }),

  markAllNotificationsRead: (userId: string) =>
    request<{ success: boolean; count: number }>(
      `/notifications/user/${userId}/read-all`,
      { method: "POST" }
    ),

  // Activity
  getUserActivity: (userId: string, limit?: number) =>
    request<ActivityItem[]>(
      `/activity/${userId}${limit ? `?limit=${limit}` : ""}`
    ),

  getAllActivity: (limit?: number) =>
    request<ActivityItem[]>(`/activity${limit ? `?limit=${limit}` : ""}`),

  createActivityItem: (data: {
    userId: string;
    eventType: string;
    title: string;
    description?: string;
    metadata?: Record<string, unknown>;
    linkUrl?: string;
  }) =>
    request<ActivityItem>("/activity", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ── Sprint 5: Provider Workspace API ─────────────────────────────

  getOrCreateWorkspace: (userId: string, role: string) =>
    request<ProviderWorkspace>("/provider/workspace", {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    }),

  getWorkspace: (userId: string) =>
    request<ProviderWorkspace>(`/provider/workspace/${userId}`),

  updateWorkspace: (userId: string, data: {
    specialties?: string[];
    languages?: string[];
    organization?: string;
    availability?: Record<string, unknown>;
    isActive?: boolean;
  }) =>
    request<ProviderWorkspace>(`/provider/workspace/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getAllWorkspacesByRole: (role: string) =>
    request<ProviderWorkspace[]>(`/provider/workspaces/role/${role}`),

  submitVerification: (data: {
    providerId: string;
    type: VerificationType;
    documentUrl?: string;
    documentName?: string;
  }) =>
    request<Verification>("/provider/verification", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateVerificationStatus: (id: string, status: VerificationStatus, verifiedBy?: string, notes?: string) =>
    request<Verification>(`/provider/verification/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, verifiedBy, notes }),
    }),

  getVerifications: (providerId: string) =>
    request<Verification[]>(`/provider/verifications/${providerId}`),

  getProviderActivity: (userId: string, limit?: number) =>
    request<ActivityItem[]>(`/provider/activity/${userId}${limit ? `?limit=${limit}` : ""}`),

  getAllowedTaskTypesForRole: (role: string) =>
    request<{ role: string; taskTypes: string[] }>(`/agent/allowed-tasks/${role}`),

  // ── Sprint 6: Medication Intelligence API ────────────────────────

  findMedicationEquivalents: (ingredient: string, countryCode?: string) => {
    const params = new URLSearchParams({ ingredient });
    if (countryCode) params.set("countryCode", countryCode);
    return request<MedicationReference[]>(`/api/medications/equivalents?${params}`);
  },

  searchMedications: (query: string) =>
    request<{ references: MedicationReference[]; brands: unknown[] }>(
      `/api/medications/search?q=${encodeURIComponent(query)}`
    ),

  getMedicationCountries: () =>
    request<{ legacy: { name: string; code: string; brandCount: number }[]; references: { country: string; count: number }[] }>(
      "/api/medications/countries"
    ),

  // ── Sprint 6: Ingestion API ──────────────────────────────────────

  runIngestion: (sourceType: string) =>
    request<{ success: boolean; message: string }>(`/api/ingestion/run/${sourceType}`, {
      method: "POST",
    }),

  runAllIngestions: () =>
    request<{ success: boolean; message: string }>("/api/ingestion/run-all", {
      method: "POST",
    }),

  getIngestionJobs: (limit?: number) =>
    request<IngestionJob[]>(`/api/ingestion/jobs${limit ? `?limit=${limit}` : ""}`),

  getIngestionStats: () =>
    request<IngestionStats>("/api/ingestion/stats"),

  getIngestionSources: () =>
    request<DataSource[]>("/api/ingestion/sources"),

  // ── Sprint 7: Interpreter Sessions API ────────────────────────────

  createInterpreterSession: (data: {
    patientId: string;
    providerId?: string;
    sessionId?: string;
    conversationId?: string;
    sourceLanguage: string;
    targetLanguage: string;
    mode?: string;
  }) =>
    request<InterpreterSession>("/interpreter-sessions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getInterpreterSession: (id: string) =>
    request<InterpreterSession>(`/interpreter-sessions/${id}`),

  getUserInterpreterSessions: (userId: string) =>
    request<InterpreterSession[]>(`/interpreter-sessions/user/${userId}`),

  endInterpreterSession: (id: string) =>
    request<InterpreterSession>(`/interpreter-sessions/${id}/end`, {
      method: "POST",
    }),

  addTranscriptEntry: (id: string, data: {
    role: string;
    originalText: string;
    translatedText: string;
    sourceLanguage?: string;
    targetLanguage?: string;
  }) =>
    request<InterpreterSession>(`/interpreter-sessions/${id}/exchange`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  extractMemoryFromSession: (id: string) =>
    request<{ extracted: Record<string, string[]>; memoryCandidatesAdded: number }>(
      `/interpreter-sessions/${id}/extract-memory`, { method: "POST" }
    ),

  // ── Sprint 6: Admin API ──────────────────────────────────────────

  getAdminStats: () =>
    request<AdminStats>("/api/admin/stats"),
};

export { ApiClientError, API_URL };
