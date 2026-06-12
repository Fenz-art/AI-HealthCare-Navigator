"use client";

import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  return (
    <div className={`theme-marketing flex min-h-full flex-col ${locale}`}>
      <SiteHeader variant="marketing" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
