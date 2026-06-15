"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Users,
  MessageCircle,
  Languages,
  Shield,
  AlertTriangle,
  Clock3,
  MapPin,
  FileText,
} from "lucide-react";

export function MedicalAssistantDashboard() {
  const { locale } = useParams() as { locale: string };

  const stats = [
    { label: "Active Travelers", value: "12", icon: Users, color: "var(--lavender)" },
    { label: "Open Conversations", value: "8", icon: MessageCircle, color: "var(--semantic-success)" },
    { label: "Translation Queue", value: "5", icon: Languages, color: "var(--semantic-blue)" },
    { label: "Pending Reviews", value: "3", icon: Shield, color: "var(--semantic-warning)" },
  ];

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
            </div>
            <h1 className="mt-3 text-[30px] font-semibold tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>Medical Assistant</h1>
            <p className="mt-1.5 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
            style={{ border: "1px solid var(--hairline)" }}>
            <Bell className="size-4" style={{ color: "var(--ink-subtle)" }} />
            <span className="absolute right-2 top-2 h-[6px] w-[6px] rounded-full" style={{ background: "var(--lavender)" }} />
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } }}>
              <div className="relative overflow-hidden rounded-xl border p-5" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: `color-mix(in srgb, ${stat.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${stat.color} 20%, transparent)` }}>
                    <Icon className="size-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-tertiary)" }}>{stat.label}</p>
                    <p className="mt-0.5 text-[24px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>{stat.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Active Travelers</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {[
              { name: "Alex Burke", country: "Japan", status: "Active" },
              { name: "Sarah Chen", country: "Thailand", status: "Pending" },
              { name: "Marco Rossi", country: "Germany", status: "Active" },
            ].map((traveler) => (
              <div key={traveler.name} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)" }}>
                  {traveler.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{traveler.name}</p>
                  <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>{traveler.country}</p>
                </div>
                <span className="rounded-md px-2 py-0.5 text-[10px] font-medium" style={{ background: traveler.status === "Active" ? "rgba(39,166,68,0.1)" : "rgba(255,183,77,0.1)", color: traveler.status === "Active" ? "var(--semantic-success)" : "var(--semantic-warning)" }}>
                  {traveler.status}
                </span>
              </div>
            ))}
            <Link href={`/${locale}/app/assigned`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all travelers <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <Languages className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Translation Queue</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {[
              { document: "Lab Report", patient: "Alex Burke", pair: "EN → JA", status: "In Progress" },
              { document: "Prescription", patient: "Sarah Chen", pair: "EN → TH", status: "Pending" },
              { document: "Vaccination Record", patient: "Kenji Tanaka", pair: "EN → DE", status: "Complete" },
            ].map((item) => (
              <div key={item.document} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--lavender-muted)" }}>
                  <FileText className="size-4" style={{ color: "var(--lavender)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{item.document}</p>
                  <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>{item.patient} · {item.pair}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium" style={{ color: item.status === "Complete" ? "var(--semantic-success)" : item.status === "In Progress" ? "var(--semantic-blue)" : "var(--semantic-warning)" }}>
                  {item.status}
                </span>
              </div>
            ))}
            <Link href={`/${locale}/app/translations`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all translations <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Open Conversations</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {[
              { name: "Alex Burke", topic: "Travel health consultation", time: "5m ago", unread: true },
              { name: "Sarah Chen", topic: "Prescription review · Metformin", time: "1h ago", unread: true },
              { name: "Kenji Tanaka", topic: "Lab results interpretation", time: "3h ago", unread: false },
            ].map((conv) => (
              <div key={conv.name} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)" }}>
                  {conv.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{conv.name}</p>
                    {conv.unread && <span className="h-2 w-2 rounded-full shrink-0" style={{ background: "var(--lavender)" }} />}
                  </div>
                  <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>{conv.topic}</p>
                </div>
                <span className="shrink-0 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>{conv.time}</span>
              </div>
            ))}
            <Link href={`/${locale}/app/conversations`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all conversations <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Escalations</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {[
              { case: "Allergic reaction", patient: "Alex Burke", priority: "High" },
              { case: "Lost prescription", patient: "Sarah Chen", priority: "Medium" },
              { case: "Insurance issue", patient: "Marco Rossi", priority: "Low" },
            ].map((esc) => (
              <div key={esc.case} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-2 shrink-0 rounded-full" style={{ background: esc.priority === "High" ? "var(--semantic-red)" : esc.priority === "Medium" ? "var(--semantic-warning)" : "var(--ink-tertiary)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{esc.case}</p>
                  <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>{esc.patient}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium" style={{ color: esc.priority === "High" ? "var(--semantic-red)" : esc.priority === "Medium" ? "var(--semantic-warning)" : "var(--ink-tertiary)" }}>
                  {esc.priority}
                </span>
              </div>
            ))}
            <Link href={`/${locale}/app/escalations`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all escalations <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
