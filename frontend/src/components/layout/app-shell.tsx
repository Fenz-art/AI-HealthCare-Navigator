"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  AlertTriangle,
  Clock3,
  Compass,
  FileText,
  Home,
  Languages,
  PlusCircle,
  Search,
  Settings,
  Shield,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { FloatingCommandBar } from "@/components/product/floating-command-bar";
import { PageTransition } from "@/components/motion/page-transition";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/session/new", label: "New session", icon: PlusCircle },
  { href: "/app/session/active", label: "Active", icon: Compass },
  { href: "/app/passport", label: "Passport", icon: Shield },
  { href: "/app/vault", label: "Vault", icon: FileText },
  { href: "/app/interpreter", label: "Interpreter", icon: Languages },
  { href: "/app/history", label: "History", icon: Clock3 },
  { href: "/app/emergency", label: "Emergency", icon: AlertTriangle },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams() as { locale?: string };
  const locale = params?.locale ?? "en";

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--cc-bg)] text-[var(--cc-text)]">
      {/* Linear-inspired sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r hairline bg-[var(--cc-surface)] md:flex">
        <div className="border-b hairline px-4 py-4">
          <Logo href={`/${locale}/app`} showWordmark />
          <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-[var(--cc-text-secondary)]">
            Health OS
          </p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {navItems.map((item) => {
            const resolvedHref = `/${locale}${item.href}`;
            const active =
              pathname === resolvedHref ||
              (item.href !== "/app" && pathname.startsWith(`${resolvedHref}/`)) ||
              (item.href === "/app" && pathname === resolvedHref);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={resolvedHref}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                  active
                    ? "bg-[var(--cc-elevated)] text-[var(--cc-text)]"
                    : "text-[var(--cc-text-secondary)] hover:bg-[var(--cc-elevated)]/60 hover:text-[var(--cc-text)]"
                )}
              >
                {active ? (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--cc-pharmacy)]" />
                ) : null}
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navigation */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b hairline bg-[var(--cc-surface)]/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <Logo href={`/${locale}/app`} showWordmark={false} />
          </div>
          <div className="hidden items-center gap-2 text-sm text-[var(--cc-text-secondary)] md:flex">
            <Compass className="size-3.5 text-[var(--cc-pharmacy)]" />
            <span>Tokyo, JP</span>
            <span className="text-[var(--cc-border)]">·</span>
            <span className="text-[var(--cc-text)]">No active session</span>
          </div>
          <button
            type="button"
            className="hidden h-9 items-center gap-2 rounded-lg border hairline bg-[var(--cc-elevated)] px-3 text-sm text-[var(--cc-text-secondary)] md:flex"
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
          >
            <Search className="size-3.5" />
            <span>Search</span>
            <kbd className="rounded border hairline px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <PageTransition key={pathname}>{children}</PageTransition>
        </main>

        {/* Mobile bottom nav */}
        <nav className="flex border-t hairline bg-[var(--cc-surface)] md:hidden">
          {navItems.slice(0, 5).map((item) => {
            const resolvedHref = `/${locale}${item.href}`;
            const active = pathname === resolvedHref || pathname.startsWith(`${resolvedHref}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={resolvedHref}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2 text-[10px]",
                  active ? "text-[var(--cc-text)]" : "text-[var(--cc-text-secondary)]"
                )}
              >
                <Icon className="size-5" />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Context panel — desktop */}
      <aside className="hidden w-72 shrink-0 border-l hairline bg-[var(--cc-surface)] p-4 xl:block">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--cc-text-secondary)]">
          Context
        </p>
        <div className="cc-panel mt-3 text-sm text-[var(--cc-text-secondary)]">
          <p>Medical navigation guidance only.</p>
          <p className="mt-2">For emergencies, call local services immediately.</p>
        </div>
      </aside>

      <FloatingCommandBar locale={locale} />
    </div>
  );
}
