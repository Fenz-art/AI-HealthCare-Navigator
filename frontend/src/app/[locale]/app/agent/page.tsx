"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Shield,
  Globe,
  HelpCircle,
  ArrowRight,
  Loader2,
  User,
  Plus,
  X,
  Image,
  File,
  Pill,
  Stethoscope,
  AlertTriangle,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Clock,
  ListTodo,
  MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import type { AgentTask, HealthcareJourney, TaskStatus } from "@/lib/types";
import { AgentTasksTab } from "@/components/agent/agent-tasks-tab";
import type { MedicationReference } from "@/lib/types";

type Message = {
  id: string;
  role: "user" | "agent" | "task";
  content: string;
  timestamp: Date;
  attachment?: { type: string; name: string };
  taskId?: string;
};

const SUGGESTED_TASKS = [
  { icon: FileText, label: "Translate document", desc: "Upload and translate medical records", taskType: "TRANSLATE_DOCUMENT" },
  { icon: Shield, label: "Prepare passport", desc: "Create provider-ready health summary", taskType: "GENERATE_SUMMARY" },
  { icon: Globe, label: "Manage vault", desc: "Organize, tag, and find documents", taskType: "EXTRACT_MEDICAL_DATA" },
  { icon: Pill, label: "Medication equivalent", desc: "Find equivalent meds in any country", taskType: "FIND_MEDICATION_EQUIVALENTS" },
  { icon: HelpCircle, label: "Explain platform", desc: "How to use CareCompass features", taskType: null },
];

const ATTACH_TYPES = [
  { type: "pdf", label: "PDF", icon: FileText },
  { type: "image", label: "Image", icon: Image },
  { type: "insurance", label: "Insurance", icon: Shield },
  { type: "prescription", label: "Prescription", icon: Pill },
  { type: "lab", label: "Lab Report", icon: Stethoscope },
  { type: "passport", label: "Passport", icon: Shield },
  { type: "vaccination", label: "Vaccination Record", icon: FileText },
];

const AGENT_WELCOME: Message = {
  id: "welcome",
  role: "agent",
  content: `# CareCompass Agent

I can help you with:

- **Translate documents** — Upload and translate medical records
- **Prepare your passport** — Create a provider-ready health summary
- **Manage your vault** — Organize, tag, and find health documents
- **Platform assistance** — Explain how features work

I cannot provide medical diagnosis, treatment recommendations, or prescriptions.

What would you like help with?`,
  timestamp: new Date(),
};

function useTaskPolling(taskId: string | null, onUpdate: (task: AgentTask) => void) {
  useEffect(() => {
    if (!taskId) return;
    let cancelled = false;

    const poll = async () => {
      while (!cancelled) {
        try {
          const task = await api.getTask(taskId);
          onUpdate(task);
          if (task.status === "COMPLETED" || task.status === "FAILED" || task.status === "CANCELLED") {
            break;
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 2000));
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [taskId, onUpdate]);
}

const STATUS_ICONS: Record<TaskStatus, typeof Loader2> = {
  PENDING: Clock,
  PROCESSING: Loader2,
  COMPLETED: CheckCircle2,
  FAILED: AlertCircle,
  CANCELLED: X,
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  PENDING: "var(--ink-tertiary)",
  PROCESSING: "var(--lavender)",
  COMPLETED: "var(--semantic-success)",
  FAILED: "var(--semantic-red)",
  CANCELLED: "var(--ink-tertiary)",
};

function TaskProgress({ task }: { task: AgentTask }) {
  const StatusIcon = STATUS_ICONS[task.status] || Clock;
  const color = STATUS_COLORS[task.status] || "var(--ink-tertiary)";
  const spinning = task.status === "PROCESSING" || task.status === "PENDING";

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className={`size-4 ${spinning ? "animate-spin" : ""}`} style={{ color }} />
          <span className="text-[13px] font-medium capitalize" style={{ color: "var(--ink)" }}>{task.title}</span>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{
          background: `color-mix(in srgb, ${color} 15%, transparent)`,
          color,
        }}>
          {task.status}
        </span>
      </div>
      {task.description && (
        <p className="text-[12px]" style={{ color: "var(--ink-tertiary)" }}>{task.description}</p>
      )}
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${task.progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
        <span>{task.progress}% complete</span>
        <span>{new Date(task.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      {task.status === "COMPLETED" && task.output && (
        <div className="text-[12px] leading-relaxed rounded-lg p-3" style={{ background: "var(--surface-3)", color: "var(--ink-muted)" }}>
          <pre className="whitespace-pre-wrap font-sans">{formatTaskOutput(task.type, task.output)}</pre>
        </div>
      )}
      {task.status === "FAILED" && task.error && (
        <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--semantic-red)" }}>
          <AlertTriangle className="size-3.5 shrink-0" />
          {task.error}
        </div>
      )}
    </div>
  );
}

function formatTaskOutput(type: string, output: string): string {
  try {
    const parsed = JSON.parse(output);
    if (type === "GENERATE_SUMMARY") {
      return [parsed.summary, "", "Key Findings:", ...(parsed.keyFindings || []).map((f: string) => `  • ${f}`)].join("\n");
    }
    if (type === "TRANSLATE_DOCUMENT") {
      return `Translation complete.\n\n${parsed.englishTranslation || ""}`;
    }
    if (type === "EXTRACT_MEDICAL_DATA") {
      return "Medical data extracted and stored in vault.";
    }
    return JSON.stringify(parsed, null, 2);
  } catch {
    return output;
  }
}

export default function AgentPage() {
  const { data: session } = useSession();
  const [view, setView] = useState<"chat" | "tasks">("chat");
  const [messages, setMessages] = useState<Message[]>([AGENT_WELCOME]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTask, setActiveTask] = useState<AgentTask | null>(null);
  const [showAttach, setShowAttach] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onTaskUpdate = useCallback((task: AgentTask) => {
    setActiveTask(task);
    setMessages((prev) =>
      prev.map((m) =>
        m.taskId === task.id
          ? { ...m, content: `## ${task.title}\n\nStatus: **${task.status}** · Progress: ${task.progress}%` }
          : m
      )
    );
    if (task.status === "COMPLETED" || task.status === "FAILED") {
      setIsProcessing(false);
    }
  }, []);

  const polledTaskId = activeTask && (activeTask.status === "PENDING" || activeTask.status === "PROCESSING") ? activeTask.id : null;
  useTaskPolling(polledTaskId, onTaskUpdate);

  const handleSend = async (content: string) => {
    if (!content.trim() || isProcessing || !session?.user?.id) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);
    setShowAttach(false);

    const lower = content.toLowerCase();

    if (lower.includes("translate") || lower.includes("document")) {
      await runTask("TRANSLATE_DOCUMENT", "Translate Document", "Translating your medical document...");
    } else if (lower.includes("passport") || lower.includes("summary")) {
      await runTask("GENERATE_SUMMARY", "Prepare Health Summary", "Generating provider-ready summary...");
    } else if (lower.includes("vault") || lower.includes("extract") || lower.includes("organize")) {
      await runTask("EXTRACT_MEDICAL_DATA", "Extract Medical Data", "Extracting structured data from vault documents...");
    } else if (lower.includes("equivalent") || lower.includes("equivalent medication") || lower.includes("find medication") || lower.includes("translate prescription")) {
      await handleMedicationQuery(content, lower);
    } else if (lower.includes("journey") || lower.includes("journeys") || lower.includes("health graph") || lower.includes("healthcare journey")) {
      await handleJourneyQuery(lower);
    } else {
      const response = getPlatformResponse(lower);
      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsProcessing(false);
    }
  };

  const runTask = async (type: string, title: string, description: string) => {
    try {
      const task = await api.createTask({
        userId: session!.user!.id,
        type,
        title,
        description,
      });

      const taskMsg: Message = {
        id: `task-${task.id}`,
        role: "task",
        content: `## ${title}\n\nStatus: **PENDING** · Progress: 0%`,
        timestamp: new Date(),
        taskId: task.id,
      };
      setMessages((prev) => [...prev, taskMsg]);
      setActiveTask(task);

      api.executeTask(task.id).catch(() => {});
    } catch (err) {
      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: `## Error\n\nFailed to create task: ${err instanceof Error ? err.message : "Unknown error"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsProcessing(false);
    }
  };

  const handleMedicationQuery = async (content: string, lower: string) => {
    const countryMatch = content.match(/(?:in|for|to)\s+(\w+)$/i) || content.match(/(japan|thailand|brazil|germany|turkey|indonesia|vietnam|france|italy|spain|mexico|china|india|korea)/i);
    const targetCountry = countryMatch ? countryMatch[1] : null;

    const countryCodeMap: Record<string, string> = {
      japan: "JP", thailand: "TH", brazil: "BR", germany: "DE",
      turkey: "TR", indonesia: "ID", vietnam: "VN", france: "FR",
      italy: "IT", spain: "ES", mexico: "MX", china: "CN",
      india: "IN", korea: "KR", uk: "GB", "united states": "US",
    };

    const code = targetCountry ? (countryCodeMap[targetCountry.toLowerCase()] || targetCountry.toUpperCase()) : null;

    const knownIngredients = ["paracetamol", "ibuprofen", "aspirin", "amoxicillin", "metformin", "lisinopril", "atorvastatin", "omeprazole", "losartan", "amlodipine", "levothyroxine"];
    const ingredient = knownIngredients.find((ing) => lower.includes(ing)) || content.split(/\s+/).slice(0, 3).join(" ");

    try {
      const results = await api.findMedicationEquivalents(ingredient, code || undefined);
      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: formatMedicationResponse(ingredient, code, results),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: `## Medication Search\n\nUnable to search medication graph: ${err instanceof Error ? err.message : "Unknown error"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJourneyQuery = async (lower: string) => {
    try {
      const journeys = await api.getUserJourneys(session!.user!.id);

      let filtered = journeys;
      if (lower.includes("pharmacy") || lower.includes("self_care")) {
        filtered = journeys.filter((j) => j.recommendation === "PHARMACY" || j.recommendation === "SELF_CARE");
      }
      if (lower.includes("clinic") || lower.includes("hospital")) {
        filtered = journeys.filter((j) => j.recommendation === "CLINIC" || j.recommendation === "HOSPITAL");
      }
      if (lower.includes("japan") || lower.includes("tokyo")) {
        filtered = filtered.filter((j) => j.country.toLowerCase().includes("japan") || j.city?.toLowerCase().includes("tokyo"));
      }
      if (lower.includes("thailand") || lower.includes("bangkok")) {
        filtered = filtered.filter((j) => j.country.toLowerCase().includes("thailand") || j.city?.toLowerCase().includes("bangkok"));
      }
      if (lower.includes("interpreter")) {
        filtered = filtered.filter((j) => j.interpreterUsed);
      }
      if (lower.includes("medication") || lower.includes("medicine")) {
        filtered = filtered.filter((j) => j.medicationFound);
      }
      if (lower.includes("recovered")) {
        filtered = filtered.filter((j) => j.outcomeStatus === "RECOVERED");
      }

      const content = formatJourneysResponse(filtered, journeys.length);
      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: `## Error\n\nFailed to query journeys: ${err instanceof Error ? err.message : "Unknown error"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAttach = async (type: string) => {
    if (!session?.user?.id) return;

    const labels: Record<string, string> = {
      pdf: "Document.pdf", image: "Image.jpeg", insurance: "Insurance_Card.pdf",
      prescription: "Prescription.pdf", lab: "Lab_Report.pdf",
      passport: "Passport_Scan.pdf", vaccination: "Vaccination_Record.pdf",
    };
    const label = labels[type] || "File.pdf";

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: `Attached: **${label}**`,
      timestamp: new Date(),
      attachment: { type, name: label },
    };
    setMessages((prev) => [...prev, userMsg]);
    setShowAttach(false);
    setIsProcessing(true);

    await runTask("PROCESS_UPLOAD", "Process Upload", `Processing ${label}...`);
  };

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
            Healthcare Copilot
          </p>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>
            Agent Workspace
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
            Translate documents, manage your passport, organize the vault, or prepare a provider package.
          </p>
        </div>
      </div>

      <div className="flex gap-1.5 border-b pb-3" style={{ borderColor: "var(--hairline)" }}>
        <button onClick={() => setView("chat")}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
          style={{
            background: view === "chat" ? "var(--lavender-muted)" : "transparent",
            color: view === "chat" ? "var(--lavender-hover)" : "var(--ink-subtle)",
            border: `1px solid ${view === "chat" ? "rgba(94,106,210,0.2)" : "transparent"}`,
          }}>
          <MessageSquare className="size-3.5" /> Chat
        </button>
        <button onClick={() => setView("tasks")}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
          style={{
            background: view === "tasks" ? "var(--lavender-muted)" : "transparent",
            color: view === "tasks" ? "var(--lavender-hover)" : "var(--ink-subtle)",
            border: `1px solid ${view === "tasks" ? "rgba(94,106,210,0.2)" : "transparent"}`,
          }}>
          <ListTodo className="size-3.5" /> Tasks
        </button>
      </div>

      {view === "tasks" ? (
        <AgentTasksTab />
      ) : (

      <div className="flex flex-1 gap-4 min-h-0">
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex-1 overflow-y-auto rounded-2xl border p-4"
            style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ background: msg.role === "agent" ? "var(--lavender-muted)" : "var(--surface-3)", color: msg.role === "agent" ? "var(--lavender)" : "var(--ink-subtle)" }}>
                    {msg.role === "agent" ? <Bot className="size-4" /> : msg.role === "task" ? <Loader2 className="size-3.5 animate-spin" /> : <User className="size-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3`}
                    style={{ background: msg.role === "user" ? "var(--lavender)" : msg.role === "task" ? "var(--surface-2)" : "var(--surface-2)", color: msg.role === "user" ? "var(--inverse-ink)" : "var(--ink)", border: msg.role === "user" ? "none" : "1px solid var(--hairline)" }}>
                    {msg.attachment && (
                      <div className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2"
                        style={{ background: msg.role === "user" ? "rgba(255,255,255,0.1)" : "var(--surface-3)" }}>
                        <Paperclip className="size-4 shrink-0" />
                        <span className="text-[12px] font-medium truncate">{msg.attachment.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: msg.role === "user" ? "rgba(255,255,255,0.15)" : "var(--surface-2)" }}>
                          {msg.attachment.type}
                        </span>
                      </div>
                    )}
                    {msg.role === "task" && activeTask ? (
                      <TaskProgress task={activeTask} />
                    ) : (
                      <div className="text-[13px] leading-relaxed whitespace-pre-wrap"
                        style={{ color: msg.role === "user" ? "var(--inverse-ink)" : "var(--ink-muted)" }}>
                        <AgentMessage content={msg.content} />
                      </div>
                    )}
                    <p className={`mt-2 text-[10px] tabular-nums ${msg.role === "user" ? "opacity-60" : ""}`}
                      style={{ color: msg.role === "user" ? "var(--inverse-ink)" : "var(--ink-tertiary)" }}>
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isProcessing && !activeTask && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full" style={{ background: "var(--lavender-muted)" }}>
                    <Bot className="size-4" style={{ color: "var(--lavender)" }} />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl px-4 py-3"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)" }}>
                    <Loader2 className="size-4 animate-spin" style={{ color: "var(--lavender)" }} />
                    <span className="text-[13px]" style={{ color: "var(--ink-tertiary)" }}>Processing...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="mt-3 flex items-end gap-2">
            <div className="relative flex flex-1 items-end rounded-2xl border px-4 py-2.5"
              style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
              <textarea value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(input); } }}
                placeholder="Ask the agent..." rows={1}
                className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent text-[13px] outline-none"
                style={{ color: "var(--ink)", caretColor: "var(--lavender)" }} />
              <div className="flex items-center gap-1 ml-2">
                <div className="relative">
                  <button onClick={() => setShowAttach(!showAttach)}
                    className="flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
                    style={{ color: "var(--ink-tertiary)" }}>
                    <Plus className="size-4" />
                  </button>
                  <AnimatePresence>
                    {showAttach && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute bottom-full left-0 mb-2 w-48 rounded-xl border p-2 shadow-lg"
                        style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
                        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Attach</p>
                        <div className="space-y-0.5">
                          {ATTACH_TYPES.map((at) => {
                            const Icon = at.icon;
                            return (
                              <button key={at.type} onClick={() => handleAttach(at.type)}
                                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]"
                                style={{ color: "var(--ink-muted)" }}>
                                <Icon className="size-3.5" style={{ color: "var(--ink-tertiary)" }} />
                                {at.label}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button onClick={() => handleSend(input)} disabled={!input.trim() || isProcessing}
                  className="flex size-7 items-center justify-center rounded-lg transition-colors disabled:opacity-30"
                  style={{ background: input.trim() ? "var(--lavender)" : "var(--surface-2)", color: input.trim() ? "var(--inverse-ink)" : "var(--ink-tertiary)" }}>
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="hidden w-[240px] shrink-0 lg:block">
          <div className="space-y-4">
            {activeTask && (
              <div className="rounded-xl p-3.5" style={{ background: "var(--lavender-muted)", border: "1px solid rgba(94,106,210,0.15)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>Active task</p>
                <p className="mt-1.5 text-[12px] font-medium capitalize" style={{ color: "var(--lavender-hover)" }}>{activeTask.title}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  {activeTask.status === "PROCESSING" ? (
                    <Loader2 className="size-3 animate-spin" style={{ color: "var(--lavender)" }} />
                  ) : activeTask.status === "COMPLETED" ? (
                    <CheckCircle2 className="size-3" style={{ color: "var(--semantic-success)" }} />
                  ) : (
                    <Clock className="size-3" style={{ color: "var(--ink-tertiary)" }} />
                  )}
                  <span className="text-[10px]" style={{ color: "var(--lavender)" }}>
                    {activeTask.status === "COMPLETED" ? "Complete" : `${activeTask.progress}% · ${activeTask.status}`}
                  </span>
                </div>
              </div>
            )}

            <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Suggested tasks</p>
            <div className="space-y-1.5">
              {SUGGESTED_TASKS.map((task) => {
                const Icon = task.icon;
                return (
                  <motion.button key={task.label} type="button" onClick={() => handleSend(task.label)}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[var(--surface-2)]"
                    style={{ border: "1px solid var(--hairline)", background: "var(--surface-1)" }}>
                    <div className="flex size-8 items-center justify-center rounded-lg" style={{ background: "var(--surface-2)" }}>
                      <Icon className="size-4" style={{ color: "var(--ink-subtle)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate" style={{ color: "var(--ink)" }}>{task.label}</p>
                      <p className="text-[10px] truncate" style={{ color: "var(--ink-tertiary)" }}>{task.desc}</p>
                    </div>
                    <ArrowRight className="size-3.5 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
                  </motion.button>
                );
              })}
            </div>

            <div className="rounded-xl p-3" style={{ background: "rgba(255,77,79,0.06)", border: "1px solid rgba(255,77,79,0.12)" }}>
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--semantic-red)" }}>
                I cannot provide diagnosis, prescribe medications, or recommend treatments. Start a Care Session for healthcare navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

function formatMedicationResponse(ingredient: string, countryCode: string | null, results: MedicationReference[]): string {
  if (results.length === 0) {
    const location = countryCode ? ` in ${countryCode}` : "";
    return `## Medication Equivalents\n\nNo equivalents found for "${ingredient}"${location}. The medication graph may not have data for this search yet. Try an ingredient name like Paracetamol, Ibuprofen, or Amoxicillin.`;
  }

  const byCountry: Record<string, MedicationReference[]> = {};
  for (const r of results) {
    if (!byCountry[r.country]) byCountry[r.country] = [];
    byCountry[r.country].push(r);
  }

  const lines = Object.entries(byCountry).map(([country, refs]) => {
    const brands = refs.map((r) => `  • **${r.brandName}**${r.strength ? ` (${r.strength})` : ""}${r.otc !== null ? r.otc ? " · OTC" : " · Rx" : ""} — ${r.sourceType}`).join("\n");
    return `### ${country}\n${brands}`;
  }).join("\n\n");

  return `## Medication Equivalents\n\n**Ingredient:** ${results[0]?.ingredient || ingredient}\n\n${lines}`;
}

function formatJourneysResponse(journeys: HealthcareJourney[], total: number): string {
  if (journeys.length === 0) {
    return `## Health Journeys\n\nNo journeys match your query. You have ${total} total journey${total !== 1 ? "s" : ""} recorded.`;
  }

  const lines = journeys.slice(0, 10).map((j) => {
    const symptoms = Array.isArray(j.symptoms) ? j.symptoms.slice(0, 3).join(", ") : "Unknown";
    const date = new Date(j.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const city = j.city ? `${j.city}, ` : "";
    return `- **${city}${j.country}** — ${symptoms} — ${j.outcomeStatus}${j.recoveryTimeDays != null ? ` (${j.recoveryTimeDays}d recovery)` : ""} — ${date}`;
  }).join("\n");

  const summary = journeys.length > 10
    ? `\n\nShowing 10 of ${journeys.length} matching journeys.`
    : "";

  return `## Health Journeys${summary}\n\n${lines}`;
}

function getPlatformResponse(lower: string): string {
  if (lower.includes("how") || lower.includes("what") || lower.includes("explain") || lower.includes("guide")) {
    return `## Platform Guide

### Key Features

1. **Care Sessions** — Start when symptoms appear. The navigation engine guides you through severity assessment, medication intelligence, and provider discovery.

2. **Health Passport** — Your portable medical identity. Allergies, medications, conditions, and emergency contacts in one place.

3. **Health Vault** — Store and organize medical documents. Translate them for foreign providers.

4. **Interpreter** — Medical-grade dual-language translation with push-to-talk voice.

5. **Medication Intelligence** — Find equivalent medications across 200+ countries using real drug data from OpenFDA, DailyMed, and more.

6. **Conversations** — Communicate with medical assistants and providers. No internal IDs shown.

### Getting Started
- Press **⌘K** to open the command palette
- Start a **New Session** when you have symptoms
- Set up your **Health Passport** first for the best experience

### Medication Equivalence
Try asking: "Find equivalent medication in Japan" or "What is paracetamol in Thailand?"`;
  }

  return `## Let me help with that

I can assist with:

- **Translate documents** — Upload and translate medical records
- **Prepare passport** — Create provider-ready health summary
- **Manage vault** — Organize, tag, and find health documents
- **Medication equivalents** — Find equivalent meds in any country using real drug data
- **Explain platform** — How to use CareCompass features

Try asking "Find paracetamol in Japan" or "What is ibuprofen in Thailand?"`;
}

function AgentMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("| ") && trimmed.endsWith(" |")) {
      const cells = trimmed.split("|").filter(Boolean).map((c) => c.trim());
      if (!inTable) { inTable = true; tableRows = [cells]; }
      else { tableRows.push(cells); }
      return;
    }

    if (inTable && !trimmed.startsWith("|")) {
      elements.push(
        <div key={`table-${i}`} className="my-3 overflow-x-auto">
          <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
            {tableRows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => (
                <td key={ci} className="px-3 py-1.5 text-left" style={{ border: "1px solid var(--hairline)", color: ri === 1 ? "var(--ink-tertiary)" : "var(--ink-muted)", fontWeight: ri === 0 ? 600 : 400, background: ri === 0 ? "var(--surface-2)" : "transparent" }}>
                  {cell}
                </td>
              ))}</tr>
            ))}
          </table>
        </div>
      );
      inTable = false; tableRows = [];
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true; listItems.push(trimmed.slice(2));
      return;
    }

    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${i}`} className="my-2 space-y-1 pl-4">
          {listItems.map((item, li) => (
            <li key={li} className="text-[13px] list-disc" style={{ color: "var(--ink-muted)" }}>{item}</li>
          ))}
        </ul>
      );
      inList = false; listItems = [];
    }

    if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={i} className="mt-4 mb-1 text-[14px] font-semibold" style={{ color: "var(--ink)" }}>{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={i} className="mt-5 mb-2 text-[16px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      elements.push(<p key={i} className="text-[13px] font-semibold" style={{ color: "var(--ink-muted)" }}>{trimmed.slice(2, -2)}</p>);
    } else if (trimmed.startsWith("✅") || trimmed.startsWith("⬜") || trimmed.startsWith("🔴")) {
      elements.push(<p key={i} className="text-[13px]" style={{ color: "var(--ink-muted)" }}>{trimmed}</p>);
    } else if (trimmed) {
      elements.push(<p key={i} className="text-[13px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>{trimmed}</p>);
    }
  });

  if (inList && listItems.length > 0) {
    elements.push(
      <ul key="list-end" className="my-2 space-y-1 pl-4">
        {listItems.map((item, li) => (
          <li key={li} className="text-[13px] list-disc" style={{ color: "var(--ink-muted)" }}>{item}</li>
        ))}
      </ul>
    );
  }

  if (inTable && tableRows.length > 0) {
    elements.push(
      <div key="table-end" className="my-3 overflow-x-auto">
        <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
          {tableRows.map((row, ri) => (
            <tr key={ri}>{row.map((cell, ci) => (
              <td key={ci} className="px-3 py-1.5 text-left" style={{ border: "1px solid var(--hairline)", color: ri === 0 ? "var(--ink-muted)" : "var(--ink-tertiary)", fontWeight: ri === 0 ? 600 : 400, background: ri === 0 ? "var(--surface-2)" : "transparent" }}>
                {cell}
              </td>
            ))}</tr>
          ))}
        </table>
      </div>
    );
  }

  return <>{elements}</>;
}
