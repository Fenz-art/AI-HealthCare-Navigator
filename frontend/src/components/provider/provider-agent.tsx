"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Pill,
  HeartPulse,
  FileText,
  CalendarClock,
  Activity,
  Syringe,
  Languages,
  ClipboardList,
  PillBottle,
  Shuffle,
  Briefcase,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bot,
  Loader2,
  ChevronRight,
} from "lucide-react";
type Role = "DOCTOR" | "PHARMACIST" | "MEDICAL_ASSISTANT";

interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface Task {
  id: string;
  toolName: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
}

interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
}

const ROLE_TOOLS: Record<Role, ToolDefinition[]> = {
  DOCTOR: [
    { id: "clinical-summary", name: "Generate Clinical Summary", description: "Create a concise clinical summary from patient records and encounter data.", icon: FileText },
    { id: "medication-timeline", name: "Generate Medication Timeline", description: "Visualize patient medication history in chronological order.", icon: CalendarClock },
    { id: "condition-timeline", name: "Generate Condition Timeline", description: "Build a timeline of diagnosed conditions and progress notes.", icon: Activity },
    { id: "vaccination-history", name: "Generate Vaccination History", description: "Compile complete vaccination records from patient history.", icon: Syringe },
    { id: "translate-records", name: "Translate Records", description: "Translate medical records into the patient's preferred language.", icon: Languages },
    { id: "visit-summary", name: "Prepare Visit Summary", description: "Summarize the current visit with findings, decisions, and follow-ups.", icon: ClipboardList },
  ],
  PHARMACIST: [
    { id: "translate-prescription", name: "Translate Prescription", description: "Translate prescription instructions for patient understanding.", icon: Languages },
    { id: "medication-equivalents", name: "Find Medication Equivalents", description: "Search for generic or therapeutic alternatives to prescribed medications.", icon: Shuffle },
    { id: "medication-summary", name: "Generate Medication Summary", description: "Produce a complete medication regimen summary with dosages and schedules.", icon: PillBottle },
  ],
  MEDICAL_ASSISTANT: [
    { id: "translate-documents", name: "Translate Documents", description: "Translate patient documents and forms for multilingual support.", icon: Languages },
    { id: "passport-package", name: "Prepare Passport Package", description: "Assemble required documents for a health passport application.", icon: Briefcase },
    { id: "insurance-summary", name: "Prepare Insurance Summary", description: "Summarize patient insurance coverage, claims, and benefits.", icon: FileCheck },
  ],
};

const ROLE_META: Record<Role, { label: string; color: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  DOCTOR: { label: "Doctor", color: "#3b82f6", icon: Stethoscope },
  PHARMACIST: { label: "Pharmacist", color: "#f59e0b", icon: Pill },
  MEDICAL_ASSISTANT: { label: "Medical Assistant", color: "#27a644", icon: HeartPulse },
};

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "var(--ink-tertiary)", bg: "var(--surface-2)", label: "Pending" },
  processing: { icon: Loader2, color: "var(--lavender)", bg: "color-mix(in srgb, var(--lavender) 10%, transparent)", label: "Processing" },
  completed: { icon: CheckCircle2, color: "var(--semantic-success)", bg: "color-mix(in srgb, var(--semantic-success) 10%, transparent)", label: "Completed" },
  failed: { icon: AlertCircle, color: "var(--semantic-red)", bg: "color-mix(in srgb, var(--semantic-red) 10%, transparent)", label: "Failed" },
} as const;

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a1", action: "Tool Used", detail: "Generate Clinical Summary — patient #4402", timestamp: "2 min ago" },
  { id: "a2", action: "Tool Used", detail: "Translate Records — Spanish → English", timestamp: "15 min ago" },
  { id: "a3", action: "Task Completed", detail: "Prepare Visit Summary — patient #3881", timestamp: "1 hr ago" },
  { id: "a4", action: "Task Failed", detail: "Generate Medication Timeline — timeout", timestamp: "2 hr ago" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
};

interface ProviderAgentProps {
  role?: Role;
}

export function ProviderAgent({ role = "DOCTOR" }: ProviderAgentProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const meta = ROLE_META[role];
  const tools = ROLE_TOOLS[role];
  const RoleIcon = meta.icon;

  const handleUseTool = (tool: ToolDefinition) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      toolName: tool.name,
      status: "pending",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setTasks((prev) => [task, ...prev]);
    setActiveTaskId(task.id);

    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: "processing" as const } : t)),
      );
    }, 800);

    setTimeout(() => {
      const succeeded = Math.random() > 0.2;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: succeeded ? ("completed" as const) : ("failed" as const) } : t,
        ),
      );
      setActiveTaskId((prev) => (prev === task.id ? null : prev));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start gap-4"
      >
        <div
          className="flex size-12 items-center justify-center rounded-xl shrink-0"
          style={{ background: `color-mix(in srgb, ${meta.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${meta.color} 20%, transparent)` }}
        >
          <RoleIcon className="size-6" style={{ color: meta.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
              Provider Agent
            </h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{ background: `color-mix(in srgb, ${meta.color} 12%, transparent)`, color: meta.color, border: `1px solid color-mix(in srgb, ${meta.color} 20%, transparent)` }}
            >
              {meta.label}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
            Role-specific tools for {meta.label.toLowerCase()} workflows. Select a tool below to start a task.
          </p>
        </div>
      </motion.div>

      <section>
        <h2 className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>Available Tools</h2>
        <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
          {tools.length} tool{tools.length !== 1 ? "s" : ""} available for your role
        </p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="group relative overflow-hidden rounded-xl border p-4 transition-all duration-200"
                style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `radial-gradient(400px circle at 50% 0%, ${meta.color}08, transparent 60%)` }}
                />
                <div className="relative flex items-start gap-3">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `color-mix(in srgb, ${meta.color} 10%, transparent)` }}
                  >
                    <Icon className="size-5" style={{ color: meta.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{tool.name}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: "var(--ink-tertiary)" }}>
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="relative mt-3 flex items-center justify-end">
                  <button
                    onClick={() => handleUseTool(tool)}
                    disabled={activeTaskId !== null}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all disabled:opacity-40"
                    style={{
                      background: `color-mix(in srgb, ${meta.color} 10%, transparent)`,
                      color: meta.color,
                      border: `1px solid color-mix(in srgb, ${meta.color} 20%, transparent)`,
                    }}
                  >
                    Use
                    <ChevronRight className="size-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>Task Queue</h2>
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
              {tasks.length} task{tasks.length !== 1 ? "s" : ""} in queue
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border py-12" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
              <Bot className="size-10" style={{ color: "var(--ink-tertiary)" }} />
              <p className="mt-3 text-[13px] font-medium" style={{ color: "var(--ink-muted)" }}>No tasks yet</p>
              <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                Use a tool above to create a task
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const config = STATUS_CONFIG[task.status];
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border px-4 py-3"
                  style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
                >
                  <div
                    className="flex size-8 items-center justify-center rounded-lg"
                    style={{ background: config.bg }}
                  >
                    <StatusIcon
                      className={`size-4 ${task.status === "processing" ? "animate-spin" : ""}`}
                      style={{ color: config.color }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>
                      {task.toolName}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                      {task.createdAt}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{ background: config.bg, color: config.color }}
                  >
                    {config.label}
                  </span>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      <section>
        <h2 className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>Activity</h2>
        <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
          Recent agent activity
        </p>
        <div className="mt-4 space-y-1">
          {MOCK_ACTIVITY.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-[var(--surface-1)]"
              style={{ border: "1px solid transparent" }}
            >
              <div className="mt-0.5 flex size-2 shrink-0 items-center justify-center">
                <span
                  className="size-2 rounded-full"
                  style={{ background: item.action === "Task Failed" ? "var(--semantic-red)" : "var(--ink-tertiary)" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>
                  {item.action}
                  <span className="ml-1.5 font-normal" style={{ color: "var(--ink-muted)" }}>{item.detail}</span>
                </p>
              </div>
              <span className="shrink-0 text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
                {item.timestamp}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
