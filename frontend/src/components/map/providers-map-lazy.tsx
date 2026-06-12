"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { ProviderRecommendation } from "@/lib/types";

const ProvidersMap = dynamic(
  () => import("./providers-map").then((mod) => mod.ProvidersMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-52 items-center justify-center rounded-2xl bg-muted/40">
        <Loader2 className="size-6 animate-spin text-[var(--compass-teal)]" />
      </div>
    ),
  }
);

type ProvidersMapLazyProps = {
  lat: number;
  lng: number;
  providers: ProviderRecommendation[];
  className?: string;
};

export function ProvidersMapLazy(props: ProvidersMapLazyProps) {
  return <ProvidersMap {...props} />;
}
