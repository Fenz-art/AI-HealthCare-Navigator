"use client";

import { EmergencyBanner } from "@/components/product/emergency-banner";
import { ProvidersMapLazy } from "@/components/map/providers-map-lazy";
import type { SeverityLevel, TravelHealthSession } from "@/lib/types";
import { SEVERITY_GUIDANCE } from "@/lib/constants";
import { MedicationFlowCard } from "@/components/product/medication-flow-card";
import { ProviderCard } from "@/components/product/provider-card";
import { OutcomeCard } from "@/components/product/outcome-card";
import Link from "next/link";
import { Languages } from "lucide-react";

type CommandCenterLayoutProps = {
  session: TravelHealthSession;
  locale?: string;
};

export function CommandCenterLayout({ session, locale = "en" }: CommandCenterLayoutProps) {
  const severity = (session.severity ?? "CLINIC") as SeverityLevel;
  const isSelfCare = severity === "SELF_CARE";
  const meds = session.medRecs ?? [];
  const providers = session.providerRecs ?? [];
  const showMap =
    !isSelfCare && session.lat != null && session.lng != null && providers.length > 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 md:h-[calc(100vh-3.5rem)]">
      <EmergencyBanner
        severity={severity}
        location={session.location}
        guidance={SEVERITY_GUIDANCE[severity]}
      />

      {showMap ? (
        <div
          className="relative min-h-0 flex-[3] overflow-hidden rounded-md"
          style={{ border: "1px solid var(--hairline)" }}
        >
          <ProvidersMapLazy
            lat={session.lat!}
            lng={session.lng!}
            providers={providers}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : isSelfCare ? (
        <div
          className="lifted-panel flex flex-[3] flex-col items-center justify-center rounded-md p-8 text-center"
          style={{ background: "var(--surface-1)" }}
        >
          <p
            className="text-[18px] font-semibold tracking-tight"
            style={{ color: "var(--ink)", letterSpacing: "-0.3px" }}
          >
            Rest and monitor
          </p>
          <p className="mt-2 max-w-sm text-[13px]" style={{ color: "var(--ink-subtle)" }}>
            Hydrate, rest, and watch for changes. Seek care if symptoms worsen.
          </p>
        </div>
      ) : null}

      <div className="grid min-h-0 flex-[2] gap-2 overflow-y-auto sm:grid-cols-3">
        {meds.length > 0 ? (
          <MedicationFlowCard medications={meds} />
        ) : (
          <div
            className="lifted-panel flex items-center justify-center rounded-md text-[13px]"
            style={{ background: "var(--surface-1)", color: "var(--ink-tertiary)" }}
          >
            No medication recommended
          </div>
        )}

        <div
          className="lifted-panel space-y-2 overflow-y-auto rounded-md p-4"
          style={{ background: "var(--surface-1)" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--ink-tertiary)" }}
          >
            Providers
          </p>
          {providers.length > 0 ? (
            providers.slice(0, 3).map((p) => (
              <ProviderCard key={`${p.name}-${p.lat}`} provider={p} compact />
            ))
          ) : (
            <p className="text-[13px]" style={{ color: "var(--ink-tertiary)" }}>None nearby</p>
          )}
        </div>

        <div
          className="lifted-panel flex flex-col rounded-md p-4"
          style={{ background: "var(--surface-1)" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--ink-tertiary)" }}
          >
            Interpreter
          </p>
          <p
            className="mt-2 line-clamp-4 flex-1 text-[13px] leading-relaxed"
            style={{ color: "var(--ink-subtle)" }}
          >
            {session.interpreterContext ?? "Available after workflow completes."}
          </p>
          <Link
            href={`/${locale}/app/session/${session.id}/interpreter`}
            className="btn-secondary mt-4 gap-2"
          >
            <Languages className="size-3.5" />
            Open interpreter
          </Link>
        </div>
      </div>

      <OutcomeCard sessionId={session.id} initialOutcome={session.outcome} />
    </div>
  );
}
