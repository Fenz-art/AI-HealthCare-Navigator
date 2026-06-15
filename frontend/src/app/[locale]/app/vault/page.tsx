"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Globe,
  Lock,
  Search,
  Share2,
  Upload,
  Clock,
  Pill,
  Heart,
  Stethoscope,
  Download,
  Sparkles,
  Shield,
  Loader2,
  Brain,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Languages,
  Bot,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/os/page-header";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { HealthDocument, HealthDocumentWithExtraction, MemorySummary, ExtractedMedicalEntity, DocumentProcessingJob } from "@/lib/types";

const CATEGORIES = [
  { id: "all", label: "All documents", icon: FileText },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "labs", label: "Lab reports", icon: Heart },
  { id: "immunizations", label: "Immunizations", icon: Stethoscope },
  { id: "history", label: "History", icon: FileText },
  { id: "insurance", label: "Insurance", icon: Shield },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "var(--ink-tertiary)",
  STORING: "var(--lavender)",
  OCR: "var(--lavender)",
  DETECTING_LANGUAGE: "var(--lavender)",
  TRANSLATING: "var(--lavender)",
  EXTRACTING: "var(--lavender)",
  UPDATING_MEMORY: "var(--lavender)",
  UPDATING_PASSPORT: "var(--lavender)",
  COMPLETED: "var(--semantic-success)",
  FAILED: "var(--semantic-red)",
};

export default function VaultPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [documents, setDocuments] = useState<HealthDocumentWithExtraction[]>([]);
  const [memory, setMemory] = useState<MemorySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [docEntities, setDocEntities] = useState<ExtractedMedicalEntity[]>([]);
  const [docJobs, setDocJobs] = useState<DocumentProcessingJob[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tab, setTab] = useState<"documents" | "memory">("documents");

  useEffect(() => {
    if (!session?.user?.id) return;
    Promise.all([
      api.getUserVaultWithExtractions(session.user.id).then((r) => setDocuments(r.healthDocuments)).catch(() => {}),
      api.getMemorySummary(session.user.id).then(setMemory).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [session?.user?.id]);

  const handleSelectDoc = async (docId: string) => {
    if (selectedDoc === docId) { setSelectedDoc(null); return; }
    setSelectedDoc(docId);
    setDetailLoading(true);
    try {
      const [entities, jobs] = await Promise.all([
        api.getDocumentEntities(docId),
        api.getDocumentProcessingJobs(docId),
      ]);
      setDocEntities(entities);
      setDocJobs(jobs);
    } catch {}
    setDetailLoading(false);
  };

  const filtered = documents.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || getDocCategory(d.type) === category;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    const map: Record<string, typeof FileText> = {
      PRESCRIPTION: Pill, LAB_RESULT: Heart, VACCINATION_RECORD: Stethoscope,
      DIAGNOSIS_REPORT: FileText, DISCHARGE_SUMMARY: FileText, INSURANCE_CARD: Shield,
    };
    return map[type] || FileText;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Document Intelligence Engine"
        title="Health Vault"
        description="Medical documents — automatically processed, extracted, translated, and stored in your Health Memory."
        action={
          <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all"
            style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
            <Upload className="size-4" /> Upload document
          </motion.button>
        }
      />

      {/* Memory Summary Bar */}
      {memory && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-xl border px-4 py-3"
          style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
          <Brain className="size-5 shrink-0" style={{ color: "var(--lavender)" }} />
          <div className="flex flex-wrap gap-3 text-[12px]">
            <span style={{ color: "var(--ink-muted)" }}>Health Memory:</span>
            {memory.conditions.length > 0 && <span style={{ color: "var(--semantic-red)" }}>{memory.conditions.length} Conditions</span>}
            {memory.medications.length > 0 && <span style={{ color: "var(--semantic-blue)" }}>{memory.medications.length} Medications</span>}
            {memory.allergies.length > 0 && <span style={{ color: "var(--semantic-red)" }}>{memory.allergies.length} Allergies</span>}
            {memory.vaccinations.length > 0 && <span style={{ color: "var(--semantic-success)" }}>{memory.vaccinations.length} Vaccinations</span>}
            {memory.insurance.length > 0 && <span>{memory.insurance.length} Insurance</span>}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 border-b pb-3" style={{ borderColor: "var(--hairline)" }}>
        <button onClick={() => setTab("documents")}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium"
          style={{ background: tab === "documents" ? "var(--lavender-muted)" : "transparent", color: tab === "documents" ? "var(--lavender-hover)" : "var(--ink-subtle)" }}>
          <FileText className="size-3.5" /> Documents
        </button>
        <button onClick={() => setTab("memory")}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium"
          style={{ background: tab === "memory" ? "var(--lavender-muted)" : "transparent", color: tab === "memory" ? "var(--lavender-hover)" : "var(--ink-subtle)" }}>
          <Brain className="size-3.5" /> Medical Memory
        </button>
      </div>

      {tab === "memory" && memory ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { key: "conditions", icon: Heart, label: "Conditions", items: memory.conditions, color: "var(--semantic-red)" },
            { key: "medications", icon: Pill, label: "Medications", items: memory.medications, color: "var(--semantic-blue)" },
            { key: "allergies", icon: AlertTriangle, label: "Allergies", items: memory.allergies, color: "var(--semantic-red)" },
            { key: "vaccinations", icon: Shield, label: "Vaccinations", items: memory.vaccinations, color: "var(--semantic-success)" },
            { key: "procedures", icon: Stethoscope, label: "Procedures", items: memory.procedures, color: "var(--semantic-purple)" },
            { key: "insurance", icon: Shield, label: "Insurance", items: memory.insurance, color: "var(--semantic-success)" },
            { key: "labResults", icon: Heart, label: "Lab Results", items: memory.labResults, color: "var(--semantic-blue)" },
            { key: "vitalSigns", icon: Heart, label: "Vital Signs", items: memory.vitalSigns, color: "var(--semantic-purple)" },
          ].map((section) => {
            const Icon = section.icon;
            return (
              <motion.div key={section.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border p-4" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4" style={{ color: section.color }} />
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-tertiary)" }}>
                    {section.label}
                  </p>
                </div>
                {section.items.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {section.items.map((item: string) => (
                      <li key={item} className="text-[12px]" style={{ color: "var(--ink-muted)" }}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>None recorded</p>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Search + Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search prescriptions, labs, records..."
                className="h-10 w-full rounded-xl pl-10 pr-4 text-[13px] outline-none transition-colors focus:ring-2"
                style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", color: "var(--ink)", caretColor: "var(--lavender)" }} />
            </div>
            <div className="flex gap-1.5">
              {CATEGORIES.slice(0, 5).map((cat) => {
                const Icon = cat.icon;
                return (
                  <button key={cat.id} type="button" onClick={() => setCategory(cat.id)}
                    className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all", category === cat.id && "bg-[var(--lavender-muted)] text-[var(--lavender-hover)]")}
                    style={{ background: category === cat.id ? "var(--lavender-muted)" : "var(--surface-1)", border: `1px solid ${category === cat.id ? "rgba(94,106,210,0.2)" : "var(--hairline)"}`, color: category === cat.id ? "var(--lavender-hover)" : "var(--ink-subtle)" }}>
                    <Icon className="size-3.5" /> {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin" style={{ color: "var(--lavender)" }} />
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16">
              <FileText className="size-12" style={{ color: "var(--ink-tertiary)" }} />
              <p className="mt-4 text-[15px] font-medium" style={{ color: "var(--ink-muted)" }}>Your vault is empty</p>
              <p className="mt-1 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
                Upload documents to start building your Health Memory
              </p>
            </motion.div>
          ) : (
            <motion.div initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
              className="space-y-2">
              {filtered.map((doc) => {
                const Icon = getTypeIcon(doc.type);
                const isSelected = selectedDoc === doc.id;
                const pStatus = doc.processingStatus || "PENDING";
                const statusColor = STATUS_COLORS[pStatus] || "var(--ink-tertiary)";
                const processing = pStatus !== "COMPLETED" && pStatus !== "FAILED";

                return (
                  <motion.div key={doc.id} layout
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="rounded-xl border overflow-hidden transition-all cursor-pointer"
                    style={{ background: "var(--surface-1)", borderColor: isSelected ? "rgba(94,106,210,0.3)" : "var(--hairline)" }}
                    onClick={() => handleSelectDoc(doc.id)}>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="flex size-9 items-center justify-center rounded-lg"
                        style={{ background: "var(--lavender-muted)", border: "1px solid rgba(94,106,210,0.15)" }}>
                        <Icon className="size-4" style={{ color: "var(--lavender)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold truncate" style={{ color: "var(--ink)" }}>{doc.title}</p>
                          {pStatus === "COMPLETED" && (
                            <CheckCircle2 className="size-3.5 shrink-0" style={{ color: "var(--semantic-success)" }} />
                          )}
                          {pStatus === "FAILED" && (
                            <AlertCircle className="size-3.5 shrink-0" style={{ color: "var(--semantic-red)" }} />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>{doc.type.replace(/_/g, " ")}</span>
                          <span style={{ color: "var(--ink-tertiary)" }}>·</span>
                          <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                          {doc.originalLanguage && (
                            <>
                              <span style={{ color: "var(--ink-tertiary)" }}>·</span>
                              <Globe className="size-3" style={{ color: "var(--ink-tertiary)" }} />
                              <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>{doc.originalLanguage}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: `color-mix(in srgb, ${statusColor} 12%, transparent)`, color: statusColor }}>
                          {processing && <Loader2 className="size-3 animate-spin" />}
                          {pStatus}
                        </span>
                        <ChevronRight className={`size-4 transition-transform ${isSelected ? "rotate-90" : ""}`}
                          style={{ color: "var(--ink-tertiary)" }} />
                      </div>
                    </div>

                    {/* Progress bar for processing docs */}
                    {processing && (
                      <div className="h-1" style={{ background: "var(--surface-3)" }}>
                        <motion.div className="h-full" style={{ background: statusColor }}
                          initial={{ width: "0%" }}
                          animate={{ width: getProgressWidth(pStatus) }}
                          transition={{ duration: 0.5 }} />
                      </div>
                    )}

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: "var(--hairline)", background: "var(--surface-2)" }}>
                            {detailLoading ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="size-4 animate-spin" style={{ color: "var(--lavender)" }} />
                              </div>
                            ) : (
                              <>
                                {/* Status badges */}
                                <div className="flex flex-wrap gap-2">
                                  {doc.originalLanguage && (
                                    <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px]"
                                      style={{ background: "var(--surface-3)", color: "var(--ink-subtle)" }}>
                                      <Languages className="size-3" /> Original: {doc.originalLanguage}
                                    </span>
                                  )}
                                  {doc.translatedText && (
                                    <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px]"
                                      style={{ background: "color-mix(in srgb, var(--semantic-success) 10%, transparent)", color: "var(--semantic-success)" }}>
                                      <Globe className="size-3" /> Translated to English
                                    </span>
                                  )}
                                  {doc.extraction && (
                                    <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px]"
                                      style={{ background: "color-mix(in srgb, var(--lavender) 10%, transparent)", color: "var(--lavender-hover)" }}>
                                      <Brain className="size-3" /> Extracted
                                    </span>
                                  )}
                                </div>

                                {/* Translated text */}
                                {doc.translatedText && (
                                  <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
                                      Translated Content
                                    </p>
                                    <div className="mt-1 rounded-lg p-3 text-[12px] leading-relaxed max-h-48 overflow-y-auto"
                                      style={{ background: "var(--surface-3)", color: "var(--ink-muted)" }}>
                                      {doc.translatedText}
                                    </div>
                                  </div>
                                )}

                                {/* Extracted data */}
                                {doc.extraction && (
                                  <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
                                      Extracted Medical Data
                                    </p>
                                    <div className="mt-1 grid grid-cols-2 gap-2">
                                      {renderExtractionField("Conditions", doc.extraction.conditions)}
                                      {renderExtractionField("Medications", doc.extraction.medications)}
                                      {renderExtractionField("Allergies", doc.extraction.allergies)}
                                      {renderExtractionField("Procedures", doc.extraction.procedures)}
                                      {renderExtractionField("Insurance", doc.extraction.insuranceMeta)}
                                      {renderExtractionField("Vital Signs", doc.extraction.vitalSigns)}
                                      {renderExtractionField("Lab Results", doc.extraction.labResults)}
                                    </div>
                                  </div>
                                )}

                                {/* Extracted entities */}
                                {docEntities.length > 0 && (
                                  <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
                                      Extracted Entities ({docEntities.length})
                                    </p>
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                      {docEntities.map((entity) => (
                                        <span key={entity.id}
                                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px]"
                                          style={{ background: "var(--surface-3)", color: "var(--ink-subtle)" }}>
                                          <span className="opacity-50">{entity.entityType}:</span> {entity.value}
                                          <span className="text-[9px] opacity-40">({Math.round(entity.confidence * 100)}%)</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Processing history */}
                                {docJobs.length > 0 && (
                                  <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
                                      Processing History
                                    </p>
                                    <div className="mt-1 space-y-1">
                                      {docJobs.map((job) => (
                                        <div key={job.id} className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                                          style={{ background: "var(--surface-3)" }}>
                                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                            <span className="text-[11px]" style={{ color: "var(--ink-muted)" }}>
                                              Step: {job.currentStep}
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--ink-tertiary)" }}>
                                              {job.status}
                                            </span>
                                          </div>
                                          <span className="text-[10px] tabular-nums" style={{ color: "var(--ink-tertiary)" }}>
                                            {job.progress}%
                                          </span>
                                          {job.error && (
                                            <AlertTriangle className="size-3" style={{ color: "var(--semantic-red)" }} />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-1">
                                  {doc.translatedText && (
                                    <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-[var(--surface-3)]"
                                      style={{ border: "1px solid var(--hairline)", color: "var(--ink-subtle)" }}>
                                      <Globe className="size-3" /> View translation
                                    </button>
                                  )}
                                  <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-[var(--surface-3)]"
                                    style={{ border: "1px solid var(--hairline)", color: "var(--ink-subtle)" }}>
                                    <Share2 className="size-3" /> Share
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Upload placeholder */}
              <motion.button type="button"
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="flex min-h-[80px] w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors hover:bg-[var(--surface-2)]"
                style={{ borderColor: "var(--hairline-strong)" }}>
                <Upload className="size-5" style={{ color: "var(--ink-tertiary)" }} />
                <p className="text-[14px] font-medium" style={{ color: "var(--ink-muted)" }}>Upload a document</p>
                <p className="text-[12px]" style={{ color: "var(--ink-tertiary)" }}>PDF, image, or photo of records</p>
              </motion.button>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            <Lock className="size-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[12px]" style={{ color: "var(--ink-subtle)" }}>End-to-end encrypted at rest. Every document is processed through the Document Intelligence Engine — OCR, language detection, translation, and medical extraction.</p>
          </motion.div>
        </>
      )}
    </div>
  );
}

function getDocCategory(type: string): string {
  if (type === "PRESCRIPTION") return "medications";
  if (type === "LAB_RESULT") return "labs";
  if (type === "VACCINATION_RECORD") return "immunizations";
  if (type === "INSURANCE_CARD") return "insurance";
  if (type === "DIAGNOSIS_REPORT" || type === "DISCHARGE_SUMMARY") return "history";
  return "history";
}

function getProgressWidth(status: string): string {
  const widths: Record<string, string> = {
    PENDING: "5%", STORING: "15%", OCR: "25%", DETECTING_LANGUAGE: "35%",
    TRANSLATING: "50%", EXTRACTING: "70%", UPDATING_MEMORY: "85%", UPDATING_PASSPORT: "95%",
  };
  return widths[status] || "50%";
}

function renderExtractionField(label: string, value: string | null) {
  if (!value) return null;
  let parsed: unknown;
  try { parsed = JSON.parse(value); } catch { return null; }

  const display = Array.isArray(parsed)
    ? parsed.map((item: any) => {
      if (typeof item === "string") return item;
      return Object.values(item).filter(Boolean).join(" · ");
    })
    : typeof parsed === "object" && parsed !== null
      ? Object.entries(parsed as Record<string, unknown>).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)
      : [];

  if (display.length === 0) return null;

  return (
    <div className="rounded-lg p-2.5" style={{ background: "var(--surface-3)" }}>
      <p className="text-[10px] font-semibold" style={{ color: "var(--ink-tertiary)" }}>{label}</p>
      <ul className="mt-1 space-y-0.5">
        {display.map((item: string, i: number) => (
          <li key={i} className="text-[11px]" style={{ color: "var(--ink-muted)" }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
