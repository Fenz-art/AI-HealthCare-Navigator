"use client";

import { ExternalLink } from "lucide-react";
import type { ProviderRecommendation } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProviderCardProps = {
  provider: ProviderRecommendation;
};

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <article className="surface-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium leading-snug">{provider.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{provider.address}</p>
        </div>
        <Badge variant="outline" className="shrink-0 capitalize">
          {provider.type.toLowerCase()}
        </Badge>
      </div>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${provider.lat},${provider.lng}`}
        target="_blank"
        rel="noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-3 inline-flex rounded-full"
        )}
      >
        Directions
        <ExternalLink className="size-3.5" />
      </a>
    </article>
  );
}
