"use client";

import { Phone } from "lucide-react";
import type { SeverityLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES: Record<string, { bg: string; label: string }> = {
  SELF_CARE: { bg: "var(--cc-success)", label: "Self care" },
  PHARMACY: { bg: "var(--cc-pharmacy)", label: "Pharmacy" },
  CLINIC: { bg: "var(--cc-clinic)", label: "Clinic" },
  HOSPITAL: { bg: "var(--cc-hospital)", label: "Hospital" },
  EMERGENCY: { bg: "var(--cc-emergency)", label: "Emergency" },
};

type EmergencyBannerProps = {
  severity: SeverityLevel | string | null;
  location?: string | null;
  guidance?: string;
  className?: string;
};

export function EmergencyBanner({
  severity,
  location,
  guidance,
  className,
}: EmergencyBannerProps) {
  const level = severity ?? "CLINIC";
  const style = SEVERITY_STYLES[level] ?? SEVERITY_STYLES.CLINIC;
  const isEmergency = level === "EMERGENCY";
  const isSelfCare = level === "SELF_CARE";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl px-5 py-4 sm:px-6 sm:py-5",
        isSelfCare && "border border-[var(--cc-success)]/20 bg-[color-mix(in_srgb,var(--cc-success)_8%,var(--cc-surface))]",
        !isSelfCare && !isEmergency && "cc-elevated",
        isEmergency && "bg-[var(--cc-emergency)]",
        className
      )}
      style={!isSelfCare && !isEmergency ? { borderLeft: `3px solid ${style.bg}` } : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--cc-text-secondary)]">
            Recommended next step
          </p>
          <p
            className="font-display mt-1 text-2xl font-bold sm:text-3xl"
            style={!isEmergency ? { color: style.bg } : undefined}
          >
            {style.label}
          </p>
          {location ? (
            <p className="mt-1 text-sm text-[var(--cc-text-secondary)]">Near {location}</p>
          ) : null}
          {guidance ? (
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--cc-text-secondary)]">
              {guidance}
            </p>
          ) : null}
        </div>
      </div>
      {isEmergency ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="tel:112"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[var(--cc-emergency)]"
          >
            <Phone className="size-4" />
            Call 112
          </a>
          <a
            href="tel:911"
            className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-sm font-medium text-white"
          >
            US: 911
          </a>
        </div>
      ) : null}
    </div>
  );
}
