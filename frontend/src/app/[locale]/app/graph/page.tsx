"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Clock,
  Pill,
  Stethoscope,
  Building,
  Ambulance,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { HealthcareJourney, OutcomeStatus } from "@/lib/types";

const OUTCOME_LABELS: Record<OutcomeStatus, { label: string; color: string }> = {
  RECOVERED: { label: "Recovered", color: "var(--semantic-success)" },
  IMPROVED:  { label: "Improved",  color: "var(--semantic-blue)" },
  UNCHANGED: { label: "No change", color: "var(--ink-tertiary)" },
  WORSENED:  { label: "Worsened",  color: "var(--semantic-red)" },
};

const SEVERITY_ICONS: Record<string, typeof Pill> = {
  SELF_CARE: Sparkles,
  PHARMACY:  Pill,
  CLINIC:    Stethoscope,
  HOSPITAL:  Building,
  EMERGENCY: Ambulance,
};

const SEVERITY_COLORS: Record<string, string> = {
  SELF_CARE: "var(--semantic-success)",
  PHARMACY:  "var(--semantic-blue)",
  CLINIC:    "var(--semantic-purple)",
  HOSPITAL:  "var(--semantic-orange)",
  EMERGENCY: "var(--semantic-red)",
};

export default function GraphPage() {
  const { locale } = useParams() as { locale: string };
  const { data: authSession } = useSession();
  const [journeys, setJourneys] = useState<HealthcareJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authSession?.user?.id) return;
    const userId = authSession.user.id;
    async function load() {
      try {
        const data = await api.getUserJourneys(userId);
        setJourneys(data);
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : "Unable to load journeys.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authSession?.user?.id]);

  const resolvedCount = journeys.filter((j) => j.outcomeStatus === "RECOVERED" || j.outcomeStatus === "IMPROVED").length;
  const countries    = new Set(journeys.map((j) => j.country)).size;

  if (!authSession?.user?.id) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-center py-20">
          <p style={{ color: "var(--ink-tertiary)" }}>Sign in to view your health journeys.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
            Patient view
          </p>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>
            My Health Journeys
          </h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
            Every healthcare interaction, stored as a graph node. Your personal health timeline across countries.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin" style={{ color: "var(--lavender)" }} />
        </div>
      ) : error ? (
        <div className="lifted-panel rounded-md p-6 text-center" style={{ background: "var(--surface-1)" }}>
          <AlertCircle className="mx-auto size-8" style={{ color: "var(--semantic-red)" }} />
          <p className="mt-2 text-[13px]" style={{ color: "var(--ink-subtle)" }}>{error}</p>
        </div>
      ) : journeys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <MapPin className="size-10" style={{ color: "var(--ink-tertiary)" }} />
          <p className="mt-4 text-[15px] font-medium" style={{ color: "var(--ink-muted)" }}>No journeys yet</p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
            Complete a care session to start building your health graph.
          </p>
          <Link
            href={`/${locale}/app/session/new`}
            className="btn-primary mt-6 gap-2"
          >
            <Sparkles className="size-4" />
            Start a session
          </Link>
        </div>
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-4 gap-2"
          >
            {[
              { label: "Total journeys", value: journeys.length },
              { label: "Countries", value: countries },
              { label: "Resolved", value: resolvedCount },
              { label: "Active", value: journeys.length - resolvedCount },
            ].map((stat) => (
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
              {journeys.map((journey) => {
                const Icon = SEVERITY_ICONS[journey.severity] ?? Pill;
                const color = SEVERITY_COLORS[journey.severity] ?? "var(--ink-tertiary)";
                const outcomeInfo = OUTCOME_LABELS[journey.outcomeStatus] ?? OUTCOME_LABELS.UNCHANGED;
                const date = new Date(journey.createdAt);
                const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

                return (
                  <motion.div
                    key={journey.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                    className="relative pl-12"
                  >
                    <div
                      className="absolute left-[11px] top-5 flex size-[10px] items-center justify-center rounded-full"
                      style={{ background: "var(--canvas)" }}
                    >
                      <div className="size-[6px] rounded-full" style={{ background: color }} />
                    </div>

                    {journey.sessionId ? (
                      <Link
                        href={`/${locale}/app/session/${journey.sessionId}`}
                        className="group block rounded-xl border p-4 transition-all duration-150 hover:bg-[var(--surface-2)]"
                        style={{
                          background: "var(--surface-1)",
                          borderColor: "var(--hairline)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                        }}
                      >
                        <JourneyCardContent journey={journey} Icon={Icon} color={color} outcomeInfo={outcomeInfo} dateStr={dateStr} />
                      </Link>
                    ) : (
                      <div
                        className="block rounded-xl border p-4"
                        style={{
                          background: "var(--surface-1)",
                          borderColor: "var(--hairline)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                        }}
                      >
                        <JourneyCardContent journey={journey} Icon={Icon} color={color} outcomeInfo={outcomeInfo} dateStr={dateStr} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

function JourneyCardContent({ journey, Icon, color, outcomeInfo, dateStr }: {
  journey: HealthcareJourney;
  Icon: typeof Pill;
  color: string;
  outcomeInfo: { label: string; color: string };
  dateStr: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
          }}
        >
          <Icon className="size-4" style={{ color }} />
        </div>
        <div>
          <p className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
            {Array.isArray(journey.symptoms) ? journey.symptoms.slice(0, 2).join(", ") : "Unknown"}
            {Array.isArray(journey.symptoms) && journey.symptoms.length > 2 ? "..." : ""}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
            <MapPin className="size-3" />
            <span>{journey.city ? `${journey.city}, ` : ""}{journey.country}</span>
            <span>·</span>
            <Clock className="size-3" />
            <span>{dateStr}</span>
          </div>
          {journey.recoveryTimeDays != null && (
            <p className="mt-1 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
              Recovery: {journey.recoveryTimeDays} day{journey.recoveryTimeDays !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium"
          style={{ background: `color-mix(in srgb, ${outcomeInfo.color} 15%, transparent)`, color: outcomeInfo.color, border: `1px solid color-mix(in srgb, ${outcomeInfo.color} 25%, transparent)` }}
        >
          <CheckCircle2 className="size-3" />
          {outcomeInfo.label}
        </span>
        <span
          className="rounded-md px-2 py-0.5 text-[10px] font-medium capitalize"
          style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, color, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}
        >
          {journey.recommendation.toLowerCase().replace(/_/g, " ")}
        </span>
      </div>
    </div>
  );
}
