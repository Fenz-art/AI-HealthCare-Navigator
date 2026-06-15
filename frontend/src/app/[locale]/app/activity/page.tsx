"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Languages,
  Headphones,
  Stethoscope,
  Bot,
  CheckCircle2,
  Activity,
  UserPlus,
  MessageCircle,
  Loader2,
  Globe,
  Clock,
} from "lucide-react";
import { useActivityStore } from "@/stores/activity-store";
import type { EventType } from "@/lib/types";

const EVENT_ICONS: Record<string, typeof Shield> = {
  PASSPORT_SHARED: Shield,
  MEDICAL_RECORD_UPLOADED: FileText,
  TRANSLATION_GENERATED: Languages,
  INTERPRETER_STARTED: Headphones,
  INTERPRETER_ENDED: Headphones,
  PROVIDER_SUMMARY_SHARED: Stethoscope,
  DOCUMENT_PROCESSED: FileText,
  AGENT_TASK_COMPLETED: CheckCircle2,
  JOURNEY_COMPLETED: Activity,
  PROVIDER_VIEWED_PASSPORT: Shield,
  MESSAGE_SENT: MessageCircle,
  TRANSCRIPT_AVAILABLE: FileText,
  PATIENT_JOINED: UserPlus,
  ASSISTANT_JOINED: UserPlus,
  PHARMACIST_JOINED: UserPlus,
  DOCTOR_JOINED: UserPlus,
};

const EVENT_COLORS: Record<string, string> = {
  PASSPORT_SHARED: "var(--lavender)",
  MEDICAL_RECORD_UPLOADED: "var(--lavender-hover)",
  TRANSLATION_GENERATED: "#10b981",
  INTERPRETER_STARTED: "#f59e0b",
  INTERPRETER_ENDED: "#6b7280",
  PROVIDER_SUMMARY_SHARED: "#3b82f6",
  DOCUMENT_PROCESSED: "#8b5cf6",
  AGENT_TASK_COMPLETED: "#10b981",
  JOURNEY_COMPLETED: "#10b981",
  PROVIDER_VIEWED_PASSPORT: "#f59e0b",
  TRANSCRIPT_AVAILABLE: "#3b82f6",
};

const ROLE_LABELS: Record<string, string> = {
  PATIENT: "Patient",
  MEDICAL_ASSISTANT: "Assistant",
  DOCTOR: "Doctor",
  PHARMACIST: "Pharmacist",
  CLINIC_STAFF: "Clinic Staff",
  HOSPITAL_STAFF: "Hospital Staff",
};

export default function ActivityPage() {
  const { locale } = useParams() as { locale: string };
  const { data: session } = useSession();
  const activities = useActivityStore((s) => s.activities);
  const allActivities = useActivityStore((s) => s.allActivities);
  const fetchUserActivity = useActivityStore((s) => s.fetchUserActivity);
  const fetchAllActivity = useActivityStore((s) => s.fetchAllActivity);
  const loading = useActivityStore((s) => s.loading);

  const isStaff = session?.user?.role && session.user.role !== "PATIENT";

  useEffect(() => {
    if (session?.user?.id) {
      if (isStaff) {
        fetchAllActivity();
      } else {
        fetchUserActivity(session.user.id);
      }
    }
  }, [session?.user?.id, isStaff, fetchUserActivity, fetchAllActivity]);

  const items = isStaff ? allActivities : activities;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
          Activity
        </p>
        <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>
          Activity Feed
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
          Unified timeline of your healthcare workspace
        </p>
      </div>

      <motion.div initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        className="space-y-1">
        {loading && items.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
            <p className="mt-3 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>Loading activity...</p>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <Activity className="size-10" style={{ color: "var(--ink-tertiary)" }} />
            <p className="mt-4 text-[15px] font-medium" style={{ color: "var(--ink-muted)" }}>No activity yet</p>
            <p className="mt-1 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>Activity will appear here as you use the workspace</p>
          </div>
        )}

        {items.map((item, i) => {
          const Icon = EVENT_ICONS[item.eventType] || Activity;
          const color = EVENT_COLORS[item.eventType] || "var(--ink-tertiary)";
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="group flex items-start gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-[var(--surface-1)]"
            >
              <div
                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${color}12` }}
              >
                <Icon className="size-4.5" style={{ color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>
                    {item.title}
                  </p>
                </div>
                {item.description && (
                  <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
                    {item.description}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-2 text-[11px]" style={{ color: "var(--ink-muted)" }}>
                  <span>{formatTime(item.createdAt)}</span>
                  {item.user?.name && (
                    <>
                      <span>·</span>
                      <span>{item.user.name}</span>
                      {item.user.role && (
                        <>
                          <span>·</span>
                          <span>{ROLE_LABELS[item.user.role] || item.user.role}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function formatTime(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}
