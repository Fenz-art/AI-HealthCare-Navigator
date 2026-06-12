import type {
  ApiError,
  CreateSessionPayload,
  HealthDocument,
  HealthPassport,
  InterpreterResponse,
  OutcomePayload,
  TravelHealthSession,
  WorkflowPayload,
  WorkflowResult,
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
};

export { ApiClientError, API_URL };
