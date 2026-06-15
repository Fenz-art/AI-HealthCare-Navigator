"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Globe,
  Moon,
  Shield,
  User,
  Palette,
  Info,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/os/page-header";

const SETTINGS_GROUPS = [
  {
    title: "Account",
    icon: User,
    items: [
      { label: "Display name", value: "Alex Traveler", type: "text" as const },
      { label: "Email", value: "alex@example.com", type: "text" as const },
      { label: "Phone", value: "+1 415-555-0142", type: "text" as const },
    ],
  },
  {
    title: "Preferences",
    icon: Globe,
    items: [
      { label: "Home country", value: "United States", type: "select" as const },
      { label: "Preferred language", value: "English", type: "select" as const },
      { label: "Interpreter language", value: "Japanese", type: "select" as const },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Session updates", value: true, type: "toggle" as const },
      { label: "Severity changes", value: true, type: "toggle" as const },
      { label: "Outcome reminders", value: false, type: "toggle" as const },
      { label: "Travel health alerts", value: true, type: "toggle" as const },
    ],
  },
  {
    title: "Privacy & Data",
    icon: Shield,
    items: [
      { label: "Share location during sessions", value: true, type: "toggle" as const },
      { label: "Anonymous outcome data", value: true, type: "toggle" as const },
      { label: "Auto-translate documents", value: false, type: "toggle" as const },
    ],
  },
];

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className="relative h-5 w-9 rounded-full transition-colors duration-150 focus-ring"
      style={{ background: on ? "var(--lavender)" : "var(--surface-4)" }}
    >
      <span
        className="absolute top-0.5 h-4 w-4 rounded-full transition-transform duration-150"
        style={{
          background: on ? "var(--inverse-ink)" : "var(--ink-tertiary)",
          transform: on ? "translateX(18px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        eyebrow="System"
        title="Settings"
        description="Preferences, privacy, and account — minimal, intentional, under your control."
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        className="space-y-3"
      >
        {SETTINGS_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <motion.section
              key={group.title}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
            >
              {/* Section header */}
              <div
                className="flex items-center gap-2.5 px-5 py-3.5"
                style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}
              >
                <Icon className="size-4" style={{ color: "var(--ink-tertiary)" }} />
                <h2 className="text-[13px] font-semibold" style={{ color: "var(--ink-subtle)" }}>
                  {group.title}
                </h2>
              </div>

              {/* Rows */}
              <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <span className="text-[13px]" style={{ color: "var(--ink-subtle)" }}>
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.type === "toggle" ? (
                        <Toggle defaultOn={item.value as boolean} />
                      ) : (
                        <>
                          <span className="text-[13px] font-medium" style={{ color: "var(--ink-muted)" }}>
                            {item.value as string}
                          </span>
                          <ChevronRight className="size-3.5" style={{ color: "var(--ink-tertiary)" }} />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          );
        })}

        {/* Appearance */}
        <motion.section
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
        >
          <div
            className="flex items-center gap-2.5 px-5 py-3.5"
            style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}
          >
            <Palette className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <h2 className="text-[13px] font-semibold" style={{ color: "var(--ink-subtle)" }}>Appearance</h2>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[13px]" style={{ color: "var(--ink-subtle)" }}>
              Dark mode — optimized for operational focus
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium"
              style={{ background: "rgba(39,166,68,0.1)", color: "var(--semantic-success)", border: "1px solid rgba(39,166,68,0.2)" }}
            >
              Active
            </span>
          </div>
        </motion.section>

        {/* About */}
        <motion.section
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
        >
          <div
            className="flex items-center gap-2.5 px-5 py-3.5"
            style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}
          >
            <Info className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <h2 className="text-[13px] font-semibold" style={{ color: "var(--ink-subtle)" }}>About</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {[
              { label: "Version", value: "0.1.0" },
              { label: "Build", value: "2026.06.14" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-[13px]" style={{ color: "var(--ink-subtle)" }}>{item.label}</span>
                <span className="text-[13px] font-mono" style={{ color: "var(--ink-tertiary)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Log out */}
        <motion.button
          type="button"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.3 } },
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-[13px] font-medium transition-colors"
          style={{ borderColor: "var(--hairline)", color: "var(--semantic-red)" }}
        >
          <LogOut className="size-4" />
          Sign out
        </motion.button>
      </motion.div>
    </div>
  );
}
