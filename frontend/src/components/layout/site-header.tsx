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
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl",
        isMarketing
          ? "border-[var(--mk-border)] bg-[var(--mk-bg)]/85"
          : "hairline bg-[var(--cc-bg)]/80"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo variant={isMarketing ? "marketing" : "default"} />
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors duration-200",
                isMarketing
                  ? "text-[var(--mk-text-secondary)] hover:text-[var(--mk-text)]"
                  : "text-[var(--cc-text-secondary)] hover:text-[var(--cc-text)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/login`}
            className={cn(
              "hidden h-9 items-center rounded-full px-4 text-sm font-medium transition-colors duration-200 sm:inline-flex",
              isMarketing
                ? "text-[var(--mk-text-secondary)] hover:text-[var(--mk-text)]"
                : "text-[var(--cc-text-secondary)] hover:text-[var(--cc-text)]"
            )}
          >
            Sign in
          </Link>
          <Link
            href={`/${locale}/app/session/new`}
            className={cn(
              "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-all duration-200",
              isMarketing ? "mk-btn-primary h-9 !px-5" : "btn-primary h-9 px-4 text-sm"
            )}
          >
            Start session
          </Link>
        </div>
      </div>
    </header>
  );
}
