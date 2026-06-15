"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Pill,
  Activity,
  Syringe,
  Loader2,
  Sparkles,
  Calendar,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type SummaryTab = "clinical" | "medication" | "condition" | "vaccination";

interface SummaryViewerProps {
  patientId?: string;
  patientName?: string;
}

interface MockData {
  clinical: Array<{ label: string; value: string }>;
  medication: Array<{ name: string; dosage: string; frequency: string; startDate: string; status: string }>;
  condition: Array<{ name: string; diagnosedDate: string; status: string; notes: string }>;
  vaccination: Array<{ vaccine: string; date: string; provider: string; batch: string }>;
}

const MOCK_DATA: MockData = {
  clinical: [
    { label: "Diagnosis", value: "Type 2 Diabetes Mellitus (E11.9)" },
    { label: "Chief Complaint", value: "Persistent fatigue and polyuria over the past 3 months" },
    { label: "Assessment", value: "HbA1c elevated at 8.2%. Patient shows signs of insulin resistance. Recommended lifestyle modification and metformin therapy." },
    { label: "Plan", value: "1. Metformin 500mg BID\n2. Dietary consultation\n3. Follow-up in 3 months\n4. HbA1c recheck at 6 weeks" },
  ],
  medication: [
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", startDate: "2026-01-15", status: "Active" },
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", startDate: "2026-02-10", status: "Active" },
    { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", startDate: "2025-11-01", status: "Active" },
    { name: "Ibuprofen", dosage: "400mg", frequency: "As needed", startDate: "2025-09-20", status: "Discontinued" },
  ],
  condition: [
    { name: "Type 2 Diabetes", diagnosedDate: "2025-06-10", status: "Ongoing", notes: "HbA1c improving with metformin" },
    { name: "Hypertension", diagnosedDate: "2025-03-22", status: "Controlled", notes: "BP stable at 128/82 on lisinopril" },
    { name: "Hyperlipidemia", diagnosedDate: "2025-11-01", status: "Ongoing", notes: "Lipid panel improving with statin therapy" },
    { name: "Seasonal Allergies", diagnosedDate: "2024-04-15", status: "Resolved", notes: "Managed with OTC antihistamines" },
  ],
  vaccination: [
    { vaccine: "Influenza (2025-2026)", date: "2025-10-12", provider: "City Health Clinic", batch: "FLU-2025-8842" },
    { vaccine: "COVID-19 (Booster)", date: "2025-09-05", provider: "Memorial Hospital", batch: "COV-BST-4471" },
    { vaccine: "Tdap", date: "2024-08-20", provider: "Primary Care Associates", batch: "TDAP-3821-24" },
    { vaccine: "Hepatitis B", date: "2024-03-14", provider: "County Health Dept", batch: "HEP-B-2290" },
  ],
};

const TABS: Array<{ id: SummaryTab; label: string; icon: typeof FileText }> = [
  { id: "clinical", label: "Clinical Summary", icon: FileText },
  { id: "medication", label: "Medication Timeline", icon: Pill },
  { id: "condition", label: "Condition Timeline", icon: Activity },
  { id: "vaccination", label: "Vaccination History", icon: Syringe },
];

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
      <p className="text-[13px] font-medium" style={{ color: "var(--ink-tertiary)" }}>
        Generating summary...
      </p>
    </div>
  );
}

export function SummaryViewer({ patientId, patientName }: SummaryViewerProps) {
  const [activeTab, setActiveTab] = useState<SummaryTab>("clinical");
  const [loading, setLoading] = useState(false);

  const handleGenerate = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const generateLabel = (tabId: SummaryTab) => {
    const labels: Record<SummaryTab, string> = {
      clinical: "Clinical Summary",
      medication: "Medication Timeline",
      condition: "Condition Timeline",
      vaccination: "Vaccination History",
    };
    return labels[tabId];
  };

  const Icon = TABS.find((t) => t.id === activeTab)!.icon;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
          Medical Summary
        </h2>
        {patientName && (
          <p className="mt-1 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
            Patient: {patientName}
            {patientId && <span className="ml-2">· ID: {patientId}</span>}
          </p>
        )}
      </div>

      {/* Tab Bar */}
      <div
        className="flex rounded-xl border p-1"
        style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
      >
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-150"
              style={{ color: active ? "var(--ink)" : "var(--ink-tertiary)" }}
            >
              <TabIcon className="size-4" />
              <span>{tab.label}</span>
              {active && (
                <motion.div
                  layoutId="summaryTabGlow"
                  className="absolute inset-0 rounded-lg -z-10"
                  style={{ background: "var(--lavender-muted)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {/* Generate Button */}
        <motion.button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mb-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors disabled:opacity-50"
          style={{
            background: loading ? "var(--lavender-muted)" : "var(--lavender)",
            color: loading ? "var(--lavender-hover)" : "white",
            border: "1px solid color-mix(in srgb, var(--lavender) 60%, transparent)",
          }}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? `Generating ${generateLabel(activeTab)}...` : `Generate ${generateLabel(activeTab)}`}
        </motion.button>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === "clinical" && <ClinicalContent data={MOCK_DATA.clinical} />}
              {activeTab === "medication" && <MedicationContent data={MOCK_DATA.medication} />}
              {activeTab === "condition" && <ConditionContent data={MOCK_DATA.condition} />}
              {activeTab === "vaccination" && <VaccinationContent data={MOCK_DATA.vaccination} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Tab Content Components ── */

function ClinicalContent({ data }: { data: MockData["clinical"] }) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border p-5"
          style={{ background: "var(--surface-2)", borderColor: "var(--hairline)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-tertiary)" }}>
            {item.label}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--ink)" }}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function MedicationContent({ data }: { data: MockData["medication"] }) {
  return (
    <div className="space-y-3">
      {data.map((med) => (
        <div
          key={med.name}
          className="rounded-xl border p-5"
          style={{ background: "var(--surface-2)", borderColor: "var(--hairline)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: med.status === "Active" ? "color-mix(in srgb, var(--semantic-success) 12%, transparent)" : "color-mix(in srgb, var(--ink-tertiary) 12%, transparent)",
                  border: `1px solid color-mix(in srgb, ${med.status === "Active" ? "var(--semantic-success)" : "var(--ink-tertiary)"} 20%, transparent)`,
                }}
              >
                <Pill className="size-4" style={{ color: med.status === "Active" ? "var(--semantic-success)" : "var(--ink-tertiary)" }} />
              </div>
              <div>
                <p className="text-[15px] font-medium" style={{ color: "var(--ink)" }}>{med.name}</p>
                <p className="mt-0.5 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
                  {med.dosage} · {med.frequency}
                </p>
              </div>
            </div>
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{
                background: med.status === "Active" ? "color-mix(in srgb, var(--semantic-success) 12%, transparent)" : "color-mix(in srgb, var(--ink-tertiary) 12%, transparent)",
                color: med.status === "Active" ? "var(--semantic-success)" : "var(--ink-tertiary)",
                border: `1px solid color-mix(in srgb, ${med.status === "Active" ? "var(--semantic-success)" : "var(--ink-tertiary)"} 20%, transparent)`,
              }}
            >
              {med.status === "Active" ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
              {med.status}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
            <Calendar className="size-3.5" />
            <span>Started {med.startDate}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConditionContent({ data }: { data: MockData["condition"] }) {
  return (
    <div className="space-y-3">
      {data.map((condition) => (
        <div
          key={condition.name}
          className="rounded-xl border p-5"
          style={{ background: "var(--surface-2)", borderColor: "var(--hairline)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "color-mix(in srgb, var(--lavender) 12%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--lavender) 20%, transparent)",
                }}
              >
                <Activity className="size-4" style={{ color: "var(--lavender)" }} />
              </div>
              <div>
                <p className="text-[15px] font-medium" style={{ color: "var(--ink)" }}>{condition.name}</p>
                <p className="mt-0.5 text-[13px]" style={{ color: "var(--ink-subtle)" }}>{condition.notes}</p>
              </div>
            </div>
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{
                background: condition.status === "Controlled" || condition.status === "Resolved"
                  ? "color-mix(in srgb, var(--semantic-success) 12%, transparent)"
                  : "color-mix(in srgb, var(--semantic-warning) 12%, transparent)",
                color: condition.status === "Controlled" || condition.status === "Resolved"
                  ? "var(--semantic-success)"
                  : "var(--semantic-warning)",
                border: `1px solid color-mix(in srgb, ${condition.status === "Controlled" || condition.status === "Resolved" ? "var(--semantic-success)" : "var(--semantic-warning)"} 20%, transparent)`,
              }}
            >
              {condition.status === "Resolved" ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
              {condition.status}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
            <Calendar className="size-3.5" />
            <span>Diagnosed {condition.diagnosedDate}</span>
            <ChevronRight className="size-3" />
            <span>{condition.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function VaccinationContent({ data }: { data: MockData["vaccination"] }) {
  return (
    <div className="space-y-3">
      {data.map((vax) => (
        <div
          key={vax.vaccine}
          className="rounded-xl border p-5"
          style={{ background: "var(--surface-2)", borderColor: "var(--hairline)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "color-mix(in srgb, var(--semantic-blue) 12%, transparent)",
                border: "1px solid color-mix(in srgb, var(--semantic-blue) 20%, transparent)",
              }}
            >
              <Syringe className="size-4" style={{ color: "var(--semantic-blue)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium" style={{ color: "var(--ink)" }}>{vax.vaccine}</p>
              <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
                  <span style={{ color: "var(--ink-subtle)" }}>{vax.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium" style={{ color: "var(--ink-tertiary)" }}>Provider</span>
                  <span style={{ color: "var(--ink-subtle)" }}>{vax.provider}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <span className="text-[11px] font-medium" style={{ color: "var(--ink-tertiary)" }}>Batch</span>
                  <span style={{ color: "var(--ink-subtle)" }} className="font-mono">{vax.batch}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
