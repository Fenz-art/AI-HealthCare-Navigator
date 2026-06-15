"use client";

import { useState } from "react";

interface ConsentProps {
  passportExists: boolean;
  documents: { id: string; title: string }[];
  onAccept: (data: { includePassport: boolean; includedDocuments: string[] }) => void;
}

/**
 * NATURAL SPRINT — Session consent screen.
 * Surface ladder. Hairline borders. Lavender include buttons.
 */
export function SessionConsent({ passportExists, documents, onAccept }: ConsentProps) {
  const [includePassport, setIncludePassport] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const toggleDoc = (id: string) =>
    setSelectedDocs((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);

  const rowStyle = {
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderTopColor: "rgba(255,255,255,0.06)",
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.4px" }}>
          Consent for health session
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
          Choose what CareCompass can access for this session. Your passport and documents stay private until you include them.
        </p>
      </div>

      {passportExists && (
        <div className="flex items-center justify-between rounded-md p-4" style={rowStyle}>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>Travel Health Passport</p>
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-subtle)" }}>
              Allergies, medications, and emergency contacts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIncludePassport((v) => !v)}
            className="rounded px-3 py-1.5 text-[12px] font-semibold transition-colors duration-100"
            style={{
              background: includePassport ? "var(--lavender)" : "var(--surface-3)",
              color: includePassport ? "var(--inverse-ink)" : "var(--ink-subtle)",
              border: `1px solid ${includePassport ? "var(--lavender)" : "var(--hairline)"}`,
            }}
          >
            {includePassport ? "Included ✓" : "Include"}
          </button>
        </div>
      )}

      {documents.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
            Health Documents
          </p>
          {documents.map((doc) => {
            const included = selectedDocs.includes(doc.id);
            return (
              <div key={doc.id} className="flex items-center justify-between rounded-md p-3" style={rowStyle}>
                <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>{doc.title}</p>
                <button
                  type="button"
                  onClick={() => toggleDoc(doc.id)}
                  className="rounded px-3 py-1.5 text-[12px] font-semibold transition-colors duration-100"
                  style={{
                    background: included ? "var(--lavender)" : "var(--surface-3)",
                    color: included ? "var(--inverse-ink)" : "var(--ink-subtle)",
                    border: `1px solid ${included ? "var(--lavender)" : "var(--hairline)"}`,
                  }}
                >
                  {included ? "Shared ✓" : "Share"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-md p-4 text-[13px]"
          style={{ background: "var(--surface-2)", border: "1px dashed var(--hairline-strong)", color: "var(--ink-subtle)" }}
        >
          No health documents yet. Upload files in the Health Vault to include them in sessions.
        </div>
      )}

      <button
        type="button"
        className="btn-primary w-full"
        onClick={() => onAccept({ includePassport, includedDocuments: selectedDocs })}
      >
        Continue to session
      </button>
    </div>
  );
}
