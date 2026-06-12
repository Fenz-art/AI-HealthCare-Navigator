"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  FileText,
  PlusCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion as motionTokens } from "@/lib/motion";

const QUICK_ACTIONS = [
  {
    href: "/app/session/new",
    icon: PlusCircle,
    title: "Start session",
    description: "Describe symptoms · get guided next steps",
    accent: "var(--cc-pharmacy)",
    primary: true,
  },
  {
    href: "/app/passport",
    icon: Shield,
    title: "Health passport",
    description: "Allergies, meds, emergency contacts",
    accent: "var(--cc-clinic)",
  },
  {
    href: "/app/vault",
    icon: FileText,
    title: "Health vault",
    description: "Documents · translate · share",
    accent: "var(--cc-hospital)",
  },
  {
    href: "/app/history",
    icon: Compass,
    title: "Travel timeline",
    description: "Past sessions across countries",
    accent: "var(--cc-success)",
  },
];

export default function AppHomePage() {
  const { locale } = useParams() as { locale: string };

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionTokens.slow, ease: motionTokens.ease }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--cc-text-secondary)]">
          Health OS · Command center
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Ready when you need it.
        </h1>
        <p className="mt-3 text-[var(--cc-text-secondary)]">
          Tokyo, JP · Traveling ·{" "}
          <span className="text-[var(--cc-text)]">No active session</span>
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {QUICK_ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.08 + i * 0.06,
                duration: motionTokens.normal,
                ease: motionTokens.ease,
              }}
            >
              <Link
                href={`/${locale}${action.href}`}
                className={`group relative block overflow-hidden rounded-2xl border p-6 transition-all duration-200 hairline ${
                  action.primary
                    ? "bg-gradient-to-br from-[var(--cc-surface)] to-[var(--cc-elevated)] hover:border-[rgba(59,130,246,0.3)]"
                    : "bg-[var(--cc-surface)] hover:border-[rgba(255,255,255,0.1)]"
                }`}
              >
                <div
                  className="absolute right-0 top-0 h-32 w-32 rounded-bl-[5rem] opacity-60"
                  style={{
                    background: `radial-gradient(circle at top right, color-mix(in srgb, ${action.accent} 15%, transparent), transparent)`,
                  }}
                />
                <Icon className="size-5" style={{ color: action.accent }} />
                <p className="font-display relative mt-5 text-xl font-bold">
                  {action.title}
                </p>
                <p className="relative mt-1.5 text-sm text-[var(--cc-text-secondary)]">
                  {action.description}
                </p>
                <span
                  className="relative mt-5 inline-flex items-center gap-1 text-sm font-medium transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ color: action.accent }}
                >
                  Open <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: motionTokens.normal }}
        className="cc-elevated flex items-center justify-between rounded-2xl px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="size-4 text-[var(--cc-pharmacy)]" />
          <p className="text-sm text-[var(--cc-text-secondary)]">
            Press <kbd className="rounded border hairline px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd> to open the agent
          </p>
        </div>
      </motion.div>
    </div>
  );
}
