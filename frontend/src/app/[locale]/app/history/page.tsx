"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, MapPin, Clock, Pill, Stethoscope, Building, Ambulance } from "lucide-react";

const SESSIONS = [
  { id: "sess_01", city: "Tokyo", country: "Japan", issue: "Food poisoning", date: "Jun 8, 2026", outcome: "Recovered", severity: "Pharmacy", icon: Pill, color: "var(--semantic-blue)" },
  { id: "sess_02", city: "Bangkok", country: "Thailand", issue: "Heat exhaustion", date: "Mar 14, 2026", outcome: "Clinic visit", severity: "Clinic", icon: Building, color: "var(--semantic-purple)" },
  { id: "sess_03", city: "Berlin", country: "Germany", issue: "Lost prescription", date: "Jan 22, 2026", outcome: "New script", severity: "Clinic", icon: Stethoscope, color: "var(--lavender-hover)" },
  { id: "sess_04", city: "Seoul", country: "South Korea", issue: "Allergic reaction", date: "Nov 3, 2025", outcome: "Emergency visit", severity: "Emergency", icon: Ambulance, color: "var(--semantic-red)" },
];

const STATS = [
  { label: "Total sessions", value: "4" },
  { label: "Countries", value: "4" },
  { label: "Resolved", value: "4" },
  { label: "Active", value: "0" },
];

export default function HistoryPage() {
  const { locale } = useParams() as { locale: string };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
            Travel timeline
          </p>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>
            Session History
          </h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
            Every care decision across countries — searchable, part of your growing health memory.
          </p>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="grid grid-cols-4 gap-2"
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="rounded-xl border p-4 text-center"
            style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
          >
            <p className="text-[22px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>{stat.value}</p>
            <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        <div
          className="absolute left-[15px] top-3 bottom-3 w-px"
          style={{ background: "var(--hairline-strong)" }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="space-y-3"
        >
          {SESSIONS.map((session) => {
            const Icon = session.icon;
            return (
              <motion.div
                key={session.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-[11px] top-5 flex size-[10px] items-center justify-center rounded-full"
                  style={{ background: "var(--canvas)" }}
                >
                  <div className="size-[6px] rounded-full" style={{ background: session.color }} />
                </div>

                <Link
                  href={`/${locale}/app/session/${session.id}`}
                  className="group block rounded-xl border p-4 transition-all duration-150 hover:bg-[var(--surface-2)]"
                  style={{
                    background: "var(--surface-1)",
                    borderColor: "var(--hairline)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: `color-mix(in srgb, ${session.color} 10%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${session.color} 20%, transparent)`,
                        }}
                      >
                        <Icon className="size-4" style={{ color: session.color }} />
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
                          {session.issue}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
                          <MapPin className="size-3" />
                          <span>{session.city}, {session.country}</span>
                          <span>·</span>
                          <Clock className="size-3" />
                          <span>{session.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span
                        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: "rgba(39,166,68,0.1)", color: "var(--semantic-success)", border: "1px solid rgba(39,166,68,0.2)" }}
                      >
                        <CheckCircle2 className="size-3" />
                        {session.outcome}
                      </span>
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: `color-mix(in srgb, ${session.color} 10%, transparent)`, color: session.color, border: `1px solid color-mix(in srgb, ${session.color} 20%, transparent)` }}
                      >
                        {session.severity}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="absolute bottom-4 right-4 size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" style={{ color: "var(--ink-tertiary)" }} />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {SESSIONS.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Clock className="size-10" style={{ color: "var(--ink-tertiary)" }} />
          <p className="mt-4 text-[15px] font-medium" style={{ color: "var(--ink-muted)" }}>No sessions yet</p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
            Start a session when symptoms appear
          </p>
        </div>
      )}
    </div>
  );
}
