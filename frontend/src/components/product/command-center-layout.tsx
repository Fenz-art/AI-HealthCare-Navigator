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
import { cn } from "@/lib/utils";

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
        <div className="relative min-h-0 flex-[3] overflow-hidden rounded-2xl border hairline">
          <ProvidersMapLazy
            lat={session.lat!}
            lng={session.lng!}
            providers={providers}
            className="absolute inset-0 h-full w-full"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--cc-bg)] to-transparent" />
        </div>
      ) : isSelfCare ? (
        <div className="cc-panel flex flex-[3] flex-col items-center justify-center text-center">
          <p className="font-display text-2xl font-bold">Rest and monitor</p>
          <p className="mt-2 max-w-sm text-sm text-[var(--cc-text-secondary)]">
            Hydrate, rest, and watch for changes. Seek care if symptoms worsen.
          </p>
        </div>
      ) : null}

      <div className="grid min-h-0 flex-[2] gap-3 overflow-y-auto sm:grid-cols-3">
        {meds.length > 0 ? (
          <MedicationFlowCard medications={meds} />
        ) : (
          <div className="cc-panel flex items-center justify-center text-sm text-[var(--cc-text-secondary)]">
            No medication recommended
          </div>
        )}

        <div className="cc-panel space-y-2 overflow-y-auto">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--cc-text-secondary)]">
            Providers
          </p>
          {providers.length > 0 ? (
            providers.slice(0, 3).map((p) => (
              <ProviderCard key={`${p.name}-${p.lat}`} provider={p} compact />
            ))
          ) : (
            <p className="text-sm text-[var(--cc-text-secondary)]">None nearby</p>
          )}
        </div>

        <div className="cc-panel flex flex-col">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--cc-text-secondary)]">
            Interpreter
          </p>
          <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-[var(--cc-text-secondary)]">
            {session.interpreterContext ?? "Available after workflow completes."}
          </p>
          <Link
            href={`/${locale}/app/session/${session.id}/interpreter`}
            className={cn(
              "mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[var(--cc-elevated)] text-sm font-medium transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--cc-elevated),white_6%)]"
            )}
          >
            <Languages className="size-4" />
            Open interpreter
          </Link>
        </div>
      </div>

      <OutcomeCard sessionId={session.id} initialOutcome={session.outcome} />
    </div>
  );
}
