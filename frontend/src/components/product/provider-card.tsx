"use client";

import { ExternalLink } from "lucide-react";
import type { ProviderRecommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * NATURAL SPRINT — Provider card.
 * Semantic type colours. Hairline border. No drop-shadows.
 */
const TYPE_COLORS: Record<string, string> = {
  PHARMACY: "var(--semantic-blue)",
  CLINIC:   "var(--semantic-purple)",
  HOSPITAL: "var(--lavender-hover)",
};

type ProviderCardProps = {
  provider: ProviderRecommendation;
  compact?: boolean;
};

export function ProviderCard({ provider, compact }: ProviderCardProps) {
  const color = TYPE_COLORS[provider.type] ?? "var(--lavender)";

  return (
    <article
      className={cn(
        "cc-card-hover rounded",
        compact ? "p-2.5" : "p-3.5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={cn("font-medium leading-snug", compact ? "text-[13px]" : "text-[14px]")} style={{ color: "var(--ink-muted)" }}>
          {provider.name}
        </p>
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
          style={{
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            color,
            border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
          }}
        >
          {provider.type.toLowerCase()}
        </span>
      </div>
      {!compact && (
        <p className="mt-1 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>{provider.address}</p>
      )}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${provider.lat},${provider.lng}`}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-[11px] transition-colors duration-100"
        style={{ color: "var(--ink-tertiary)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-muted)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-tertiary)")}
      >
        Directions <ExternalLink className="size-3" />
      </a>
    </article>
  );
}
