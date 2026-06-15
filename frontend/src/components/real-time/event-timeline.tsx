"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ConversationEvent } from "@/lib/types";
import {
  Shield,
  FileText,
  Languages,
  Headphones,
  Stethoscope,
  Bot,
  CheckCircle2,
  MessageCircle,
  UserPlus,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EVENT_ICONS: Record<string, LucideIcon> = {
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

export function EventTimeline({ conversationId }: { conversationId: string }) {
  const [events, setEvents] = useState<ConversationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getConversationEvents(conversationId);
        setEvents(data);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [conversationId]);

  if (loading || events.length === 0) return null;

  return (
    <div className="space-y-1 py-2">
      {events.map((event) => {
        const Icon = EVENT_ICONS[event.eventType] || Activity;
        const color = EVENT_COLORS[event.eventType] || "var(--ink-tertiary)";
        return (
          <div key={event.id} className="flex items-start gap-3 px-4 py-2">
            <div
              className="flex size-7 shrink-0 items-center justify-center rounded-full"
              style={{ background: `${color}15` }}
            >
              <Icon className="size-3.5" style={{ color }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>
                {event.title}
              </p>
              {event.description && (
                <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                  {event.description}
                </p>
              )}
              <p className="mt-0.5 text-[10px]" style={{ color: "var(--ink-muted)" }}>
                {formatTime(event.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
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
  return d.toLocaleDateString();
}
