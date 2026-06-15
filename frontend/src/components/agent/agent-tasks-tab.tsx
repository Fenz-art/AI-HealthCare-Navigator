"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Bot,
  FileText,
  Pill,
  Stethoscope,
  Shield,
  Globe,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  Search,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import type { AgentTask, TaskStatus, GroupedTasks } from "@/lib/types";

const TASK_ICONS: Record<string, typeof Bot> = {
  TRANSLATE_DOCUMENT: Globe,
  EXTRACT_MEDICAL_DATA: FileText,
  EXTRACT_CONDITIONS: Stethoscope,
  EXTRACT_MEDICATIONS: Pill,
  GENERATE_SUMMARY: FileText,
  GENERATE_PROVIDER_SUMMARY: Shield,
  GENERATE_PHARMACIST_SUMMARY: Pill,
  GENERATE_TRAVEL_PACKAGE: Globe,
  PROCESS_UPLOAD: FileText,
  SHARE_PASSPORT: Shield,
  UPDATE_PASSPORT: Shield,
};

const STATUS_CONFIG: Record<TaskStatus, { icon: typeof Clock; color: string; bg: string; label: string }> = {
  PENDING: { icon: Clock, color: "var(--ink-tertiary)", bg: "var(--surface-2)", label: "Queued" },
  PROCESSING: { icon: Loader2, color: "var(--lavender)", bg: "color-mix(in srgb, var(--lavender) 10%, transparent)", label: "Running" },
  COMPLETED: { icon: CheckCircle2, color: "var(--semantic-success)", bg: "color-mix(in srgb, var(--semantic-success) 10%, transparent)", label: "Completed" },
  FAILED: { icon: AlertCircle, color: "var(--semantic-red)", bg: "color-mix(in srgb, var(--semantic-red) 10%, transparent)", label: "Failed" },
  CANCELLED: { icon: X, color: "var(--ink-tertiary)", bg: "var(--surface-2)", label: "Cancelled" },
};

const TABS = [
  { id: "all" as const, label: "All" },
  { id: "running" as const, label: "Running" },
  { id: "queued" as const, label: "Queued" },
  { id: "completed" as const, label: "Completed" },
  { id: "failed" as const, label: "Failed" },
];

export function AgentTasksTab() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<GroupedTasks | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const grouped = await api.getUserTasksGrouped(session.user.id);
      setTasks(grouped);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, [session?.user?.id]);

  const getDisplayTasks = () => {
    if (!tasks) return [];
    switch (activeTab) {
      case "running": return tasks.running;
      case "queued": return tasks.queued;
      case "completed": return tasks.completed;
      case "failed": return tasks.failed;
      default: return tasks.all;
    }
  };

  const displayTasks = getDisplayTasks().filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleRerun = async (task: AgentTask) => {
    try {
      await api.executeTask(task.id);
      fetchTasks();
    } catch {}
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {TABS.map((tab) => {
            const count = tasks ? tasks[tab.id as keyof typeof tasks]?.length ?? 0 : 0;
            if (Array.isArray(tasks?.[tab.id as keyof typeof tasks])) {
              // works correctly
            }
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
                style={{
                  background: isActive ? "var(--lavender-muted)" : "var(--surface-1)",
                  border: `1px solid ${isActive ? "rgba(94,106,210,0.2)" : "var(--hairline)"}`,
                  color: isActive ? "var(--lavender-hover)" : "var(--ink-subtle)",
                }}>
                {tab.label}
                {count > 0 && (
                  <span className="rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums"
                    style={{ background: isActive ? "var(--lavender)" : "var(--surface-3)", color: isActive ? "var(--inverse-ink)" : "var(--ink-tertiary)" }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button onClick={fetchTasks} disabled={loading}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] transition-colors hover:bg-[var(--surface-2)]"
          style={{ border: "1px solid var(--hairline)", color: "var(--ink-tertiary)" }}>
          <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..." className="h-10 w-full rounded-xl pl-10 pr-4 text-[13px] outline-none transition-colors focus:ring-2"
          style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", color: "var(--ink)", caretColor: "var(--lavender)" }} />
      </div>

      {loading && !tasks ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin" style={{ color: "var(--lavender)" }} />
        </div>
      ) : displayTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Bot className="size-12" style={{ color: "var(--ink-tertiary)" }} />
          <p className="mt-4 text-[15px] font-medium" style={{ color: "var(--ink-muted)" }}>No tasks found</p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
            {activeTab === "all" ? "Upload and process documents to see tasks here" : `No ${activeTab} tasks`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {displayTasks.map((task) => {
              const config = STATUS_CONFIG[task.status];
              const StatusIcon = config.icon;
              const TaskIcon = TASK_ICONS[task.type] || Bot;
              const isExpanded = expandedTask === task.id;

              return (
                <motion.div key={task.id} layout initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl border overflow-hidden transition-all cursor-pointer"
                  style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
                  onClick={() => setExpandedTask(isExpanded ? null : task.id)}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-lg"
                      style={{ background: config.bg }}>
                      <StatusIcon className={`size-4 ${task.status === "PROCESSING" ? "animate-spin" : ""}`}
                        style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <TaskIcon className="size-3.5 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
                        <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{task.title}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--ink-tertiary)" }}>
                          {task.type.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--ink-subtle)" }}>
                          {new Date(task.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: config.bg, color: config.color }}>
                        {config.label}
                      </span>
                      {task.status === "FAILED" && (
                        <button onClick={(e) => { e.stopPropagation(); handleRerun(task); }}
                          className="flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
                          style={{ color: "var(--ink-tertiary)" }}>
                          <RefreshCw className="size-3.5" />
                        </button>
                      )}
                      <ChevronRight className={`size-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        style={{ color: "var(--ink-tertiary)" }} />
                    </div>
                  </div>

                  {/* Progress bar (always visible for running tasks) */}
                  {(task.status === "PENDING" || task.status === "PROCESSING") && (
                    <div className="h-1" style={{ background: "var(--surface-3)" }}>
                      <motion.div className="h-full" style={{ background: config.color }}
                        initial={{ width: 0 }} animate={{ width: `${task.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }} />
                    </div>
                  )}

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: "var(--hairline)", background: "var(--surface-2)" }}>
                          {task.description && (
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Description</p>
                              <p className="mt-1 text-[12px]" style={{ color: "var(--ink-muted)" }}>{task.description}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                            <span>Progress: {task.progress}%</span>
                            <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
                            {task.updatedAt && <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>}
                          </div>

                          {task.status === "COMPLETED" && task.output && (
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Output</p>
                              <pre className="mt-1 text-[12px] whitespace-pre-wrap font-sans rounded-lg p-3"
                                style={{ background: "var(--surface-1)", color: "var(--ink-muted)", border: "1px solid var(--hairline)" }}>
                                {formatTaskOutput(task.type, task.output)}
                              </pre>
                            </div>
                          )}

                          {task.status === "FAILED" && task.error && (
                            <div className="flex items-start gap-2 rounded-lg p-3" style={{ background: "color-mix(in srgb, var(--semantic-red) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--semantic-red) 15%, transparent)" }}>
                              <AlertTriangle className="size-4 shrink-0 mt-0.5" style={{ color: "var(--semantic-red)" }} />
                              <div>
                                <p className="text-[11px] font-medium" style={{ color: "var(--semantic-red)" }}>Error</p>
                                <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-muted)" }}>{task.error}</p>
                              </div>
                            </div>
                          )}

                          {task.input && (
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Input</p>
                              <pre className="mt-1 text-[11px] whitespace-pre-wrap font-mono rounded-lg p-3 max-h-32 overflow-y-auto"
                                style={{ background: "var(--surface-3)", color: "var(--ink-tertiary)" }}>
                                {formatJson(task.input)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function formatTaskOutput(type: string, output: string): string {
  try {
    const parsed = JSON.parse(output);
    if (type === "GENERATE_SUMMARY" || type === "GENERATE_PROVIDER_SUMMARY" || type === "GENERATE_PHARMACIST_SUMMARY" || type === "GENERATE_TRAVEL_PACKAGE") {
      const parts: string[] = [];
      if (parsed.summary) parts.push(parsed.summary);
      if (parsed.keyFindings?.length) parts.push("", "Key Findings:", ...parsed.keyFindings.map((f: string) => `  • ${f}`));
      if (parsed.currentMedications?.length) parts.push("", "Current Medications:", ...parsed.currentMedications.map((m: string) => `  • ${m}`));
      if (parsed.recommendations?.length) parts.push("", "Recommendations:", ...parsed.recommendations.map((r: string) => `  • ${r}`));
      return parts.join("\n");
    }
    if (type === "TRANSLATE_DOCUMENT") {
      return `Translation complete.\n\n${parsed.englishTranslation || ""}`;
    }
    if (type === "EXTRACT_CONDITIONS" && parsed.conditions) {
      return `Found ${parsed.count} condition(s):\n${parsed.conditions.map((c: any) => `  • ${c.name}${c.date ? ` (${c.date})` : ""}`).join("\n")}`;
    }
    if (type === "EXTRACT_MEDICATIONS" && parsed.medications) {
      return `Found ${parsed.count} medication(s):\n${parsed.medications.map((m: any) => `  • ${m.name}${m.dosage ? ` ${m.dosage}` : ""}`).join("\n")}`;
    }
    if (type === "EXTRACT_MEDICAL_DATA") {
      return "Medical data extracted and stored in vault.";
    }
    return JSON.stringify(parsed, null, 2);
  } catch {
    return output;
  }
}

function formatJson(str: string): string {
  try { return JSON.stringify(JSON.parse(str), null, 2); } catch { return str; }
}
