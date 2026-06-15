"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  MessageCircle,
  Shield,
  FolderOpen,
  Clock3,
  MapPin,
  Users,
  Languages,
  FileText,
  Activity,
  UserCheck,
  Globe,
} from "lucide-react";

export function DoctorDashboard() {
  const { locale } = useParams() as { locale: string };

  const stats = [
    { label: "Pending Conversations", value: "8", icon: MessageCircle, color: "var(--lavender)" },
    { label: "Shared Passports", value: "15", icon: Shield, color: "var(--semantic-blue)" },
    { label: "Shared Records", value: "23", icon: FolderOpen, color: "var(--semantic-success)" },
    { label: "Unread Messages", value: "6", icon: Bell, color: "var(--semantic-warning)" },
  ];

  const pendingConversations = [
    { name: "Alex Burke", topic: "Pre-travel vaccination consult", time: "5m ago", unread: true },
    { name: "Sarah Chen", topic: "Chronic condition management", time: "1h ago", unread: true },
    { name: "Kenji Tanaka", topic: "Lab results follow-up", time: "3h ago", unread: false },
    { name: "Maria Santos", topic: "Travel clearance request", time: "6h ago", unread: true },
    { name: "James Wilson", topic: "Prescription review", time: "1d ago", unread: false },
  ];

  const recentPatients = [
    { name: "Emily Park", visit: "Routine checkup", date: "Today", age: "34" },
    { name: "Liam O'Brien", visit: "Travel consultation", date: "Yesterday", age: "28" },
    { name: "Yuki Nakamura", visit: "Vaccination follow-up", date: "2 days ago", age: "41" },
    { name: "Sophia Müller", visit: "Lab results review", date: "3 days ago", age: "55" },
  ];

  const interpreterRequests = [
    { name: "Wei Zhang", languages: "Mandarin → English", status: "Pending", flag: "CN" },
    { name: "Fatima Al-Rashid", languages: "Arabic → English", status: "Confirmed", flag: "AE" },
    { name: "Pierre Dubois", languages: "French → English", status: "Pending", flag: "FR" },
  ];

  const sharedPassports = [
    { name: "Aisha Patel", type: "Medical Visa", expiry: "Expires in 45 days", status: "Active" },
    { name: "Carlos Garcia", type: "Treatment Pass", expiry: "Expires in 12 days", status: "Expiring" },
    { name: "Olga Ivanova", type: "Emergency Pass", expiry: "Expires in 90 days", status: "Active" },
    { name: "Hiroshi Yamamoto", type: "Medical Visa", expiry: "Expired 3 days ago", status: "Expired" },
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
            <h1 className="mt-3 text-[30px] font-semibold tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>Doctor Dashboard</h1>
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
            <MessageCircle className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Pending Conversations</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {pendingConversations.map((conv) => (
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

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Recent Patients</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {recentPatients.map((patient) => (
              <div key={patient.name} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)" }}>
                  {patient.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{patient.name}</p>
                  <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>{patient.visit} · {patient.date}</p>
                </div>
                <span className="shrink-0 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>Age {patient.age}</span>
              </div>
            ))}
            <Link href={`/${locale}/app/patients`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all patients <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <Languages className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Interpreter Requests</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {interpreterRequests.map((req) => (
              <div key={req.name} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)" }}>
                  {req.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{req.name}</p>
                  <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>{req.languages}</p>
                </div>
                <span className="rounded-md px-2 py-0.5 text-[10px] font-medium" style={{ background: req.status === "Confirmed" ? "rgba(39,166,68,0.1)" : "rgba(255,183,77,0.1)", color: req.status === "Confirmed" ? "var(--semantic-success)" : "var(--semantic-warning)" }}>
                  {req.status}
                </span>
              </div>
            ))}
            <Link href={`/${locale}/app/interpreters`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all requests <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Shared Passports</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {sharedPassports.map((pass) => (
              <div key={pass.name} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)" }}>
                  {pass.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{pass.name}</p>
                  <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>{pass.type} · {pass.expiry}</p>
                </div>
                <span className="rounded-md px-2 py-0.5 text-[10px] font-medium" style={{ background: pass.status === "Active" ? "rgba(39,166,68,0.1)" : pass.status === "Expiring" ? "rgba(255,183,77,0.1)" : "rgba(239,68,68,0.1)", color: pass.status === "Active" ? "var(--semantic-success)" : pass.status === "Expiring" ? "var(--semantic-warning)" : "var(--semantic-red)" }}>
                  {pass.status}
                </span>
              </div>
            ))}
            <Link href={`/${locale}/app/passports`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all passports <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
