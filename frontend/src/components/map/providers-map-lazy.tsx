"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { ProviderRecommendation } from "@/lib/types";

const ProvidersMap = dynamic(
  () => import("./providers-map").then((mod) => mod.ProvidersMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-52 items-center justify-center"
        style={{ background: "var(--surface-2)" }}
      >
        <Loader2 className="size-5 animate-spin" style={{ color: "var(--lavender)" }} />
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
