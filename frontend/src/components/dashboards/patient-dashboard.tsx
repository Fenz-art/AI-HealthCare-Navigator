"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bell,
  Clock3,
  Compass,
  FileText,
  Languages,
  MapPin,
  MessageCircle,
  Pill,
  PlusCircle,
  Shield,
  Sparkles,
  Stethoscope,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HealthMemoryWidget } from "@/components/dashboards/health-memory-widget";
import { RecentActivityWidget, UnreadConversationsWidget, PendingTasksWidget, PassportSharesWidget, DocumentProcessingWidget } from "@/components/real-time/dashboard-widgets";

const QUICK_ACTIONS = [
  { label: "New session", href: "/app/session/new", icon: Stethoscope, accent: true },
  { label: "Active session", href: "/app/session/active", icon: Compass },
  { label: "Health Passport", href: "/app/passport", icon: Shield },
  { label: "Interpreter", href: "/app/interpreter", icon: Languages },
];

const WIDGETS = [
  { id: "session", icon: Compass, label: "Active session", value: "No active session", meta: "Start a new session when symptoms appear", href: "/app/session/new", accent: true, badge: null },
  { id: "passport", icon: Shield, label: "Health passport", value: "Complete", meta: "3 allergies · 2 medications", href: "/app/passport", badge: "Ready", badgeColor: "var(--semantic-success)" },
  { id: "timeline", icon: Clock3, label: "Travel health timeline", value: "4 sessions", meta: "Tokyo · Bangkok · Berlin", href: "/app/history", badge: null },
  { id: "vault", icon: FileText, label: "Health vault", value: "6 documents", meta: "2 pending translation", href: "/app/vault", badge: "2 pending", badgeColor: "var(--lavender-hover)" },
];



export function PatientDashboard() {
  const { locale } = useParams() as { locale: string };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)", border: "1px solid rgba(94,106,210,0.15)" }}>
                <MapPin className="size-3" /> Tokyo, JP
              </span>
              <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>·</span>
              <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>19:04 JST</span>
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]" style={{ background: "rgba(39,166,68,0.1)", color: "var(--semantic-success)" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--semantic-success)]" /> All systems ready
              </span>
            </div>
            <h1 className="mt-3 text-[30px] font-semibold tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>Command center</h1>
            <p className="mt-1.5 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
              style={{ border: "1px solid var(--hairline)" }}>
              <Bell className="size-4" style={{ color: "var(--ink-subtle)" }} />
              <span className="absolute right-2 top-2 h-[6px] w-[6px] rounded-full" style={{ background: "var(--lavender)" }} />
            </motion.button>
            <Link href={`/${locale}/app/session/new`}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-all"
              style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
              <PlusCircle className="size-4" /> New session
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="flex gap-2">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={`/${locale}${action.href}`}
              className={cn("flex flex-1 items-center gap-2.5 rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-150", action.accent && "text-[var(--lavender-hover)]")}
              style={{ background: action.accent ? "var(--lavender-muted)" : "var(--surface-1)", border: `1px solid ${action.accent ? "rgba(94,106,210,0.15)" : "var(--hairline)"}`, color: action.accent ? "var(--lavender-hover)" : "var(--ink-muted)" }}>
              <Icon className="size-4 shrink-0" />
              {action.label}
              <ArrowRight className="ml-auto size-3.5 opacity-40" />
            </Link>
          );
        })}
      </motion.div>

      <motion.div initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-3 sm:grid-cols-2">
        {WIDGETS.map((widget) => {
          const Icon = widget.icon;
          return (
            <motion.div key={widget.id}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } }}>
              <Link href={`/${locale}${widget.href}`}
                className="group relative block overflow-hidden rounded-xl border p-5 transition-all duration-150"
                style={{ background: "var(--surface-1)", borderColor: "var(--hairline)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(94,106,210,0.03), transparent 40%)" }} />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex size-9 items-center justify-center rounded-lg" style={{ background: "var(--surface-2)" }}>
                      <Icon className="size-4" style={{ color: widget.accent ? "var(--lavender)" : "var(--ink-subtle)" }} />
                    </div>
                    {widget.badge && (
                      <span className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: `color-mix(in srgb, ${widget.badgeColor} 10%, transparent)`, color: widget.badgeColor }}>
                        {widget.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-tertiary)" }}>{widget.label}</p>
                  <p className="mt-1 text-[17px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>{widget.value}</p>
                  <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-subtle)" }}>{widget.meta}</p>
                </div>
                <ArrowRight className="absolute bottom-5 right-5 size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" style={{ color: "var(--ink-tertiary)" }} />
              </Link>
            </motion.div>
          );
        })}
        <HealthMemoryWidget />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="size-4" style={{ color: "var(--ink-tertiary)" }} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Live Activity</p>
            </div>
            <RecentActivityWidget />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="size-4" style={{ color: "var(--ink-tertiary)" }} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Conversations</p>
            </div>
            <UnreadConversationsWidget />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="space-y-4">
          <PendingTasksWidget />
          <PassportSharesWidget />
          <DocumentProcessingWidget />
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Healthcare Copilot</p>
          </div>
          <div className="relative overflow-hidden rounded-xl border p-5" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
            <div className="absolute right-0 top-0 size-40 translate-x-16 -translate-y-16 rounded-full opacity-[0.03]" style={{ background: "var(--lavender)" }} />
            <div className="relative">
              <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: "var(--lavender-muted)", border: "1px solid rgba(94,106,210,0.15)" }}>
                <Sparkles className="size-5" style={{ color: "var(--lavender)" }} />
              </div>
              <p className="mt-4 text-[14px] font-semibold" style={{ color: "var(--ink)" }}>Ask the agent</p>
              <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>Translate documents, manage your passport, organize the vault, or prepare a provider package.</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Translate document", "Find medication", "Share passport"].map((suggestion) => (
                  <button key={suggestion} className="rounded-lg px-2.5 py-1.5 text-[11px] transition-colors hover:bg-[var(--surface-3)]"
                    style={{ background: "var(--surface-2)", color: "var(--ink-subtle)", border: "1px solid var(--hairline)" }}>
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
                <kbd className="rounded px-1.5 py-0.5 font-mono text-[10px]" style={{ background: "var(--surface-3)", border: "1px solid var(--hairline)", color: "var(--ink-tertiary)" }}>⌘K</kbd>
                <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>Open command palette</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
