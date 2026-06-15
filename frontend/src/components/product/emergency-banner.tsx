"use client";

import { Phone } from "lucide-react";
import type { SeverityLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * NATURAL SPRINT — Severity badge / emergency banner.
 * Semantic colours for each level. No teal. No drop-shadows.
 * Lavender for SELF_CARE neutral state.
 */
const SEVERITY_STYLES: Record<string, { color: string; label: string }> = {
  SELF_CARE: { color: "var(--semantic-success)",  label: "Self care"  },
  PHARMACY:  { color: "var(--semantic-blue)",     label: "Pharmacy"   },
  CLINIC:    { color: "var(--semantic-purple)",   label: "Clinic"     },
  HOSPITAL:  { color: "var(--lavender-hover)",    label: "Hospital"   },
  EMERGENCY: { color: "var(--semantic-red)",      label: "Emergency"  },
};

type EmergencyBannerProps = {
  severity: SeverityLevel | string | null;
  location?: string | null;
  guidance?: string;
  className?: string;
};

export function EmergencyBanner({ severity, location, guidance, className }: EmergencyBannerProps) {
  const level = severity ?? "CLINIC";
  const style = SEVERITY_STYLES[level] ?? SEVERITY_STYLES.CLINIC;
  const isEmergency = level === "EMERGENCY";

  return (
    <div
      className={cn("relative overflow-hidden rounded-md px-4 py-3", className)}
      style={{
        background: isEmergency
          ? "rgba(255,77,79,0.08)"
          : "var(--surface-2)",
        border: `1px solid ${isEmergency ? "rgba(255,77,79,0.3)" : "var(--hairline)"}`,
        borderTopColor: isEmergency ? "rgba(255,77,79,0.5)" : "rgba(255,255,255,0.07)",
        borderLeft: `3px solid ${style.color}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
            Recommended next step
          </p>
          <p className="mt-1 text-[22px] font-semibold tracking-tight" style={{ color: style.color, letterSpacing: "-0.4px" }}>
            {style.label}
          </p>
          {location && (
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>Near {location}</p>
          )}
          {guidance && (
            <p className="mt-2 max-w-lg text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
              {guidance}
            </p>
          )}
        </div>
      </div>

      {isEmergency && (
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="tel:112"
            className="inline-flex h-8 items-center gap-1.5 rounded px-3 text-[12px] font-semibold"
            style={{ background: "var(--semantic-red)", color: "#fff" }}
          >
            <Phone className="size-3.5" /> Call 112
          </a>
          <a
            href="tel:911"
            className="inline-flex h-8 items-center rounded px-3 text-[12px] font-medium"
            style={{ border: "1px solid rgba(255,77,79,0.4)", color: "var(--semantic-red)" }}
          >
            US: 911
          </a>
        </div>
      )}
    </div>
  );
}
