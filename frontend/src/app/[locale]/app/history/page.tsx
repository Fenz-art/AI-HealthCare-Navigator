"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { PageHeader } from "@/components/os/page-header";
import { motion as motionTokens } from "@/lib/motion";

const SESSIONS = [
  {
    id: "sess_01",
    city: "Tokyo",
    country: "Japan",
    issue: "Food poisoning",
    date: "Jun 8, 2026",
    outcome: "Recovered",
    severity: "Pharmacy",
    status: "resolved",
  },
  {
    id: "sess_02",
    city: "Bangkok",
    country: "Thailand",
    issue: "Heat exhaustion",
    date: "Mar 14, 2026",
    outcome: "Clinic visit",
    severity: "Clinic",
    status: "resolved",
  },
  {
    id: "sess_03",
    city: "Berlin",
    country: "Germany",
    issue: "Lost prescription",
    date: "Jan 22, 2026",
    outcome: "New script",
    severity: "Clinic",
    status: "resolved",
  },
];

export default function HistoryPage() {
  const { locale } = useParams() as { locale: string };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Travel timeline"
        title="Session History"
        description="Every care decision across countries — searchable, exportable, part of your health memory."
      />

      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--cc-border)]" />

        <div className="space-y-6">
          {SESSIONS.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: motionTokens.normal, ease: motionTokens.ease }}
              className="relative pl-12"
            >
              <div className="absolute left-3 top-5 size-3 rounded-full border-2 border-[var(--cc-pharmacy)] bg-[var(--cc-bg)]" />

              <Link
                href={`/${locale}/app/session/${session.id}`}
                className="cc-panel group block transition-colors duration-200 hover:border-[rgba(59,130,246,0.2)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-[var(--cc-text-secondary)]" />
                      <span className="text-sm font-semibold">
                        {session.city}, {session.country}
                      </span>
                    </div>
                    <p className="font-display mt-2 text-lg font-bold">{session.issue}</p>
                    <p className="mt-1 text-xs text-[var(--cc-text-secondary)]">
                      {session.date} · {session.severity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(82,196,26,0.12)] px-2 py-0.5 text-[10px] font-medium text-[var(--cc-success)]">
                      <CheckCircle2 className="size-3" />
                      {session.outcome}
                    </span>
                    <ArrowRight className="size-4 text-[var(--cc-text-secondary)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--cc-text)]" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
