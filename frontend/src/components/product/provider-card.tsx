"use client";

import { ExternalLink } from "lucide-react";
import type { ProviderRecommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<string, string> = {
  PHARMACY: "var(--cc-pharmacy)",
  CLINIC: "var(--cc-clinic)",
  HOSPITAL: "var(--cc-hospital)",
};

type ProviderCardProps = {
  provider: ProviderRecommendation;
  compact?: boolean;
};

export function ProviderCard({ provider, compact }: ProviderCardProps) {
  const color = TYPE_COLORS[provider.type] ?? "var(--cc-pharmacy)";

  return (
    <article
      className={cn(
        "rounded-xl border bg-[var(--cc-bg)] transition-colors duration-150 hover:border-[rgba(255,255,255,0.1)]",
        compact ? "p-3" : "p-4"
      )}
      style={{ borderColor: "var(--cc-border)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={cn("font-medium leading-snug", compact && "text-sm")}>
            {provider.name}
          </p>
          {!compact ? (
            <p className="mt-1 text-sm text-[var(--cc-text-secondary)]">{provider.address}</p>
          ) : null}
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase"
          style={{
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            color,
          }}
        >
          {provider.type.toLowerCase()}
        </span>
      </div>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${provider.lat},${provider.lng}`}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--cc-text-secondary)] hover:text-[var(--cc-text)]"
      >
        Directions
        <ExternalLink className="size-3" />
      </a>
    </article>
  );
}
