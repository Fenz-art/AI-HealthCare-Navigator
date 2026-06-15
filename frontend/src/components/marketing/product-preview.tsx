"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Compass,
  FileText,
  Languages,
  MapPin,
  Pill,
  Shield,
} from "lucide-react";
import { motion as motionTokens } from "@/lib/motion";

const SIDEBAR = [
  { icon: Compass, label: "Active session", active: true },
  { icon: Shield, label: "Health passport" },
  { icon: Pill, label: "Medications" },
  { icon: MapPin, label: "Providers" },
  { icon: Languages, label: "Interpreter" },
  { icon: FileText, label: "Vault" },
];

const ACTIVITY = [
  { time: "23:11", text: "Severity assessed → pharmacy route", accent: true },
  { time: "23:12", text: "Loperamide mapped to Imodium HP (JP)" },
  { time: "23:13", text: "Matsukiyo pharmacy · 0.4 km · open" },
  { time: "23:14", text: "Interpreter ready · ja-JP" },
];

export function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.slow, delay: 0.2, ease: motionTokens.ease }}
      className="mk-demo-card mx-auto mt-16 w-full max-w-5xl"
    >
      <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "var(--hairline)" }}>
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: "var(--hairline-strong)" }} />
          <span className="size-2.5 rounded-full" style={{ background: "var(--hairline-strong)" }} />
          <span className="size-2.5 rounded-full" style={{ background: "var(--hairline-strong)" }} />
        </div>
        <span className="ml-2 font-mono text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
          carecompass.app · Tokyo session
        </span>
      </div>

      <div className="flex min-h-[340px] sm:min-h-[400px]">
        {/* Sidebar */}
        <aside
          className="hidden w-48 shrink-0 border-r sm:block"
          style={{ borderColor: "var(--hairline)", background: "var(--surface-2)" }}
        >
          <div className="px-3 py-4">
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-tertiary)" }}>
              Workspace
            </p>
            <nav className="mt-3 space-y-0.5">
              {SIDEBAR.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px]"
                    style={{
                      background: item.active ? "var(--surface-3)" : "transparent",
                      color: item.active ? "var(--ink)" : "var(--ink-subtle)",
                    }}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    {item.label}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main panel */}
        <div className="flex flex-1 flex-col">
          <div className="border-b px-5 py-4 sm:px-6" style={{ borderColor: "var(--hairline)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                  CC-2847 · Food poisoning
                </p>
                <h3
                  className="mt-1 text-[15px] font-semibold tracking-tight"
                  style={{ color: "var(--ink)", letterSpacing: "-0.3px" }}
                >
                  Navigate to pharmacy care
                </h3>
              </div>
              <span className="status-badge-success">Pharmacy route</span>
            </div>
          </div>

          <div className="grid flex-1 gap-px sm:grid-cols-2" style={{ background: "var(--hairline)" }}>
            <div className="p-5 sm:p-6" style={{ background: "var(--surface-1)" }}>
              <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-tertiary)" }}>
                Activity
              </p>
              <div className="mt-4 space-y-3">
                {ACTIVITY.map((row) => (
                  <div key={row.text} className="flex gap-3 text-[12px]">
                    <span className="shrink-0 font-mono" style={{ color: "var(--ink-tertiary)" }}>
                      {row.time}
                    </span>
                    <span style={{ color: row.accent ? "var(--lavender-hover)" : "var(--ink-muted)" }}>
                      {row.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6" style={{ background: "var(--surface-1)" }}>
              <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-tertiary)" }}>
                Health graph
              </p>
              <div className="mt-4 space-y-2">
                {["Symptom cluster", "Medication match", "Provider proximity", "Language bridge"].map(
                  (node, i) => (
                    <div
                      key={node}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-[12px]"
                      style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--hairline)",
                        opacity: 1 - i * 0.08,
                      }}
                    >
                      <Activity className="size-3" style={{ color: "var(--lavender)" }} />
                      <span style={{ color: "var(--ink-muted)" }}>{node}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-3 border-t px-5 py-3 sm:px-6"
            style={{ borderColor: "var(--hairline)", background: "var(--surface-2)" }}
          >
            <div
              className="flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-[12px]"
              style={{ background: "var(--surface-3)", border: "1px solid var(--hairline)" }}
            >
              <span style={{ color: "var(--ink-tertiary)" }}>Tell CareCompass what to do next…</span>
            </div>
            <span className="font-mono text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
              ⌘K
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
