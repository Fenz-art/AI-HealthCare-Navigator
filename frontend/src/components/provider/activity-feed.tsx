"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  FileText,
  Languages,
  Headphones,
  UserPlus,
  FileCheck,
  Upload,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ActivityType =
  | "passport_viewed"
  | "summary_generated"
  | "translation_requested"
  | "interpreter_session_started"
  | "conversation_assigned"
  | "document_processed"
  | "medical_record_uploaded";

type ActivityCategory = "all" | "passports" | "summaries" | "translations" | "conversations";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
}

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  passport_viewed: Eye,
  summary_generated: FileText,
  translation_requested: Languages,
  interpreter_session_started: Headphones,
  conversation_assigned: UserPlus,
  document_processed: FileCheck,
  medical_record_uploaded: Upload,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  passport_viewed: "#f59e0b",
  summary_generated: "var(--lavender)",
  translation_requested: "#10b981",
  interpreter_session_started: "#3b82f6",
  conversation_assigned: "#8b5cf6",
  document_processed: "var(--lavender-hover)",
  medical_record_uploaded: "#06b6d4",
};

const CATEGORY_FILTER: { key: ActivityCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "passports", label: "Passports" },
  { key: "summaries", label: "Summaries" },
  { key: "translations", label: "Translations" },
  { key: "conversations", label: "Conversations" },
];

const CATEGORY_MAP: Record<ActivityCategory, ActivityType[]> = {
  all: [
    "passport_viewed",
    "summary_generated",
    "translation_requested",
    "interpreter_session_started",
    "conversation_assigned",
    "document_processed",
    "medical_record_uploaded",
  ],
  passports: ["passport_viewed"],
  summaries: ["summary_generated"],
  translations: ["translation_requested"],
  conversations: ["interpreter_session_started", "conversation_assigned"],
};

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "passport_viewed",
    title: "Passport Viewed",
    description: "Dr. Sarah Chen viewed Alex Burke's health passport",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "2",
    type: "summary_generated",
    title: "Summary Generated",
    description: "Clinical summary generated for patient Maria Garcia",
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
  },
  {
    id: "3",
    type: "translation_requested",
    title: "Translation Requested",
    description: "English → Spanish translation requested for discharge notes",
    timestamp: new Date(Date.now() - 42 * 60 * 1000),
  },
  {
    id: "4",
    type: "interpreter_session_started",
    title: "Interpreter Session Started",
    description: "Mandarin interpreter connected with Dr. Patel",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "5",
    type: "conversation_assigned",
    title: "Conversation Assigned",
    description: "Emily Davis assigned to pharmacist review queue",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "6",
    type: "document_processed",
    title: "Document Processed",
    description: "Lab results for James Wilson processed and categorized",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "7",
    type: "medical_record_uploaded",
    title: "Medical Record Uploaded",
    description: "Radiology report uploaded for patient Linda Thompson",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "8",
    type: "passport_viewed",
    title: "Passport Viewed",
    description: "Dr. Michael Park viewed Robert Kim's health passport",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "9",
    type: "summary_generated",
    title: "Summary Generated",
    description: "Medication history summary generated for patient John Adams",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "10",
    type: "translation_requested",
    title: "Translation Requested",
    description: "French → English translation requested for consultation notes",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function ActivityFeed() {
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>("all");

  const filtered = MOCK_ACTIVITIES.filter((a) =>
    CATEGORY_MAP[activeCategory].includes(a.type)
  );

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
          Provider Activity
        </h2>
        <p className="mt-1 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
          Real-time feed of actions across your care team
        </p>
      </div>

      {/* Filter Row */}
      <div
        className="mb-6 inline-flex rounded-xl border p-1"
        style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
      >
        {CATEGORY_FILTER.map((filter) => {
          const active = activeCategory === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveCategory(filter.key)}
              className="relative rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors duration-150"
              style={{ color: active ? "var(--ink)" : "var(--ink-tertiary)" }}
            >
              {filter.label}
              {active && (
                <motion.div
                  layoutId="activityFilterGlow"
                  className="absolute inset-0 rounded-lg -z-10"
                  style={{ background: "var(--lavender-muted)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="relative">
        {/* Timeline vertical line */}
        <div
          className="absolute left-[19px] top-0 bottom-0 w-px"
          style={{ background: "var(--hairline)" }}
        />

        <div className="space-y-0">
          <AnimatePresence mode="popLayout">
            {filtered.map((activity, i) => {
              const Icon = ACTIVITY_ICONS[activity.type];
              const color = ACTIVITY_COLORS[activity.type];

              return (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative flex items-start gap-4 pb-6 pl-10"
                >
                  {/* Dot on timeline */}
                  <div
                    className="absolute left-[13px] top-1.5 size-3 rounded-full border-2"
                    style={{
                      background: "var(--surface-1)",
                      borderColor: color,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `${color}14`,
                      border: `1px solid ${color}28`,
                    }}
                  >
                    <Icon className="size-4" style={{ color }} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[14px] font-medium truncate" style={{ color: "var(--ink)" }}>
                        {activity.title}
                      </p>
                      <span className="shrink-0 text-[11px]" style={{ color: "var(--ink-muted)" }}>
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
                      {activity.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Activity className="size-8" style={{ color: "var(--ink-tertiary)" }} />
            <p className="mt-3 text-[13px] font-medium" style={{ color: "var(--ink-tertiary)" }}>
              No activity found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
