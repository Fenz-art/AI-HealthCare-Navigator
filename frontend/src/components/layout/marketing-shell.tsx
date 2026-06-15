"use client";

import { SiteHeader } from "@/components/layout/site-header";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-marketing flex min-h-full flex-col bg-[var(--canvas)]">
      <SiteHeader variant="marketing" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
