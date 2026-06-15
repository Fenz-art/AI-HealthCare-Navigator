"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  variant?: "marketing" | "default";
};

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const locale = useLocale();
  const isMarketing = variant === "marketing";

  const navLinks = [
    { href: `/${locale}/how-it-works`, label: "How it works" },
    { href: `/${locale}/features`, label: "Features" },
    { href: `/${locale}/use-cases`, label: "Use cases" },
    { href: `/${locale}/about`, label: "About" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b",
        isMarketing ? "bg-[var(--canvas)]/90" : "bg-[var(--canvas)]/80"
      )}
      style={{ borderColor: "var(--hairline)", height: 56 }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo variant={isMarketing ? "marketing" : "default"} />
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] transition-colors duration-200"
              style={{ color: "var(--ink-subtle)" }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--ink)")}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--ink-subtle)")}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/login`}
            className="hidden h-8 items-center rounded-md px-3.5 text-[13px] font-medium transition-colors sm:inline-flex"
            style={{ color: "var(--ink-muted)" }}
          >
            Sign in
          </Link>
          <Link href={`/${locale}/signup`} className="mk-btn-primary h-8 px-3.5 text-[13px]">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
