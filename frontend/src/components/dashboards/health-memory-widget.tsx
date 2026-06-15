"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Heart,
  Pill,
  AlertTriangle,
  Stethoscope,
  Shield,
  Syringe,
  Loader2,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { MemorySummary } from "@/lib/types";

const MEMORY_ITEMS = [
  { key: "conditions", icon: Heart, label: "Conditions", color: "var(--semantic-red)" },
  { key: "medications", icon: Pill, label: "Medications", color: "var(--semantic-blue)" },
  { key: "allergies", icon: AlertTriangle, label: "Allergies", color: "var(--semantic-red)" },
  { key: "vaccinations", icon: Syringe, label: "Vaccinations", color: "var(--semantic-success)" },
  { key: "procedures", icon: Stethoscope, label: "Procedures", color: "var(--semantic-purple)" },
  { key: "insurance", icon: Shield, label: "Insurance", color: "var(--semantic-success)" },
];

export function HealthMemoryWidget() {
  const { data: session } = useSession();
  const { locale } = useParams() as { locale: string };
  const [summary, setSummary] = useState<MemorySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    api.getMemorySummary(session.user.id)
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const total = summary
    ? Object.values(summary).reduce((acc, arr) => acc + arr.length, 0)
    : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      <Link href={`/${locale}/app/vault`}
        className="group relative block overflow-hidden rounded-xl border p-5 transition-all duration-150"
        style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
        <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(94,106,210,0.03), transparent 40%)" }} />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex size-9 items-center justify-center rounded-lg"
              style={{ background: "var(--lavender-muted)", border: "1px solid rgba(94,106,210,0.15)" }}>
              <Brain className="size-4" style={{ color: "var(--lavender)" }} />
            </div>
            {total > 0 && (
              <span className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                style={{ background: "color-mix(in srgb, var(--lavender) 10%, transparent)", color: "var(--lavender-hover)" }}>
                {total} records
              </span>
            )}
          </div>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-tertiary)" }}>
            Health Memory
          </p>

          {loading ? (
            <div className="flex items-center gap-2 mt-3">
              <Loader2 className="size-4 animate-spin" style={{ color: "var(--lavender)" }} />
              <span className="text-[12px]" style={{ color: "var(--ink-tertiary)" }}>Loading...</span>
            </div>
          ) : !summary || total === 0 ? (
            <p className="mt-2 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
              No medical memory yet. Upload documents to build your health profile.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {MEMORY_ITEMS.map((item) => {
                const items = summary[item.key as keyof typeof summary] as string[];
                const count = items?.length ?? 0;
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                    style={{ background: "var(--surface-2)" }}>
                    <Icon className="size-3.5 shrink-0" style={{ color: item.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium truncate" style={{ color: "var(--ink-tertiary)" }}>
                        {item.label}
                      </p>
                      <p className="text-[13px] font-semibold tabular-nums" style={{ color: "var(--ink)" }}>
                        {count}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
