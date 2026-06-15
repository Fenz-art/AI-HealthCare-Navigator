"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  AlertTriangle,
  Command,
  Compass,
  Home,
  PlusCircle,
  Search,
  Activity,
  Bell,
  MapPin,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { PageTransition } from "@/components/motion/page-transition";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { getNavForRole } from "@/lib/navigation";
import { NotificationDropdown } from "@/components/real-time/notification-dropdown";
import { usePresenceStore } from "@/stores/presence-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams() as { locale?: string };
  const locale = params?.locale ?? "en";
  const { data: session } = useSession();
  const { setCommandPaletteOpen, activeSessionId } = useUIStore();
  const startHeartbeat = usePresenceStore((s) => s.startHeartbeat);
  const stopHeartbeat = usePresenceStore((s) => s.stopHeartbeat);
  const setCurrentUserId = usePresenceStore((s) => s.setCurrentUserId);

  useEffect(() => {
    if (session?.user?.id) {
      setCurrentUserId(session.user.id);
      startHeartbeat(session.user.id);
    }
    return () => stopHeartbeat();
  }, [session?.user?.id, startHeartbeat, stopHeartbeat, setCurrentUserId]);

  const isEmergency = pathname.includes("/app/emergency");
  const userRole = session?.user?.role as string | undefined;

  const isActive = (href: string) => {
    const resolved = `/${locale}${href}`;
    if (href === "/app") return pathname === resolved;
    return pathname === resolved || pathname.startsWith(`${resolved}/`);
  };

  const renderNavItem = (item: { href: string; label: string; icon: LucideIcon; accent?: boolean; live?: boolean }) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={`/${locale}${item.href}`}
        className={cn(
          "relative flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-all duration-100",
          active
            ? "text-[var(--ink)]"
            : "text-[var(--ink-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-muted)]",
          item.accent && !active
            ? "text-[var(--lavender-hover)] hover:bg-[var(--lavender-muted)] hover:text-[var(--lavender-hover)]"
            : ""
        )}
        style={active ? { background: "var(--surface-3)" } : {}}
      >
        {active && (
          <span
            className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r"
            style={{ background: "var(--lavender)" }}
          />
        )}
        <Icon
          className="size-[16px] shrink-0"
          strokeWidth={active ? 2 : 1.5}
          style={active ? { color: "var(--lavender)" } : {}}
        />
        {item.label}
        {item.live && activeSessionId && (
          <span
            className="ml-auto h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: "var(--lavender)" }}
          />
        )}
      </Link>
    );
  };

  const navSections = getNavForRole(userRole as any);

  return (
    <div
      className={cn("flex h-screen overflow-hidden", isEmergency && "bg-[#0d0101]")}
      style={{ background: isEmergency ? undefined : "var(--canvas)", color: "var(--ink)" }}
    >
      {/* ── Left Sidebar ── */}
      <aside
        className="hidden w-[228px] shrink-0 flex-col md:flex"
        style={{
          background: "var(--surface-1)",
          borderRight: "1px solid var(--hairline)",
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center justify-between px-3 py-3"
          style={{ borderBottom: "1px solid var(--hairline)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-5 w-5 items-center justify-center rounded"
              style={{ background: "var(--lavender)" }}
            >
              <span className="text-[10px] font-bold" style={{ color: "var(--inverse-ink)" }}>C</span>
            </div>
            <span className="text-[13px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
              CareCompass
            </span>
          </div>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex h-5 w-5 items-center justify-center rounded transition-colors duration-100 hover:bg-[var(--surface-3)]"
            style={{ color: "var(--ink-tertiary)" }}
            aria-label="Open command palette"
          >
            <Command className="size-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-2 pt-2 pb-1.5">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] transition-colors duration-100 hover:bg-[var(--surface-3)]"
            style={{
              background: "var(--surface-2)",
              color: "var(--ink-tertiary)",
              border: "1px solid var(--hairline)",
            }}
          >
            <Search className="size-3.5 shrink-0" />
            <span className="flex-1 text-left">Search</span>
            <kbd
              className="rounded px-1 py-0.5 font-mono text-[10px]"
              style={{ background: "var(--surface-3)", color: "var(--ink-tertiary)", border: "1px solid var(--hairline)" }}
            >
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Role-based nav sections */}
        {navSections.map((section, i) => (
          <nav key={section.title} className={cn("space-y-px px-2 pb-1.5", i > 0 ? "pt-2" : "pt-1.5")} style={i > 0 ? { borderTop: "1px solid var(--hairline)" } : {}}>
            <p className="px-1 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
              {section.title}
            </p>
            {section.items.map(renderNavItem)}
          </nav>
        ))}

        {/* Spacer + Emergency */}
        <div className="flex-1" />
        <div className="px-2 pb-1.5">
          <Link
            href={`/${locale}/app/emergency`}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-colors duration-100",
              isEmergency
                ? "bg-red-500/10 text-red-400"
                : "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
            )}
          >
            <AlertTriangle className="size-[16px] shrink-0" strokeWidth={1.5} />
            Emergency
          </Link>
        </div>

        {/* User row */}
        <div
          className="flex items-center gap-2.5 px-3 py-2.5"
          style={{ borderTop: "1px solid var(--hairline)" }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
            style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}
          >
            {session?.user?.name
              ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
              : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium" style={{ color: "var(--ink)" }}>
              {session?.user?.name ?? "User"}
            </p>
            <p className="truncate text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
              {session?.user?.role
                ? session.user.role.split("_").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ")
                : "Patient"}
            </p>
          </div>
          <button
            className="flex size-6 items-center justify-center rounded transition-colors hover:bg-[var(--surface-3)]"
            style={{ color: "var(--ink-tertiary)" }}
          >
            <Sparkles className="size-3.5" />
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header
          className="flex h-[48px] shrink-0 items-center justify-between px-4 sm:px-5"
          style={{
            borderBottom: "1px solid var(--hairline)",
            background: "var(--surface-1)",
            boxShadow: "inset 0 -1px 0 var(--hairline)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Logo href={`/${locale}/app`} showWordmark={false} />
            </div>
            <div className="hidden items-center gap-2 text-[13px] md:flex">
              <MapPin className="size-3" style={{ color: "var(--lavender)" }} />
              <span style={{ color: "var(--ink-subtle)" }}>Tokyo, Japan</span>
              <span style={{ color: "var(--hairline-strong)" }}>·</span>
              <span style={{ color: "var(--ink-muted)" }}>19:04 JST</span>
            </div>
          </div>

          {activeSessionId ? (
            <div
              className="hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium md:flex"
              style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)", border: "1px solid rgba(94,106,210,0.2)" }}
            >
              <Activity className="size-3" />
              Session active
            </div>
          ) : (
            <div className="hidden items-center gap-1.5 text-[12px] md:flex" style={{ color: "var(--ink-tertiary)" }}>
              <Compass className="size-3.5" />
              No active session
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {session?.user?.id && <NotificationDropdown userId={session.user.id} />}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden h-7 items-center gap-1.5 rounded px-2 text-[12px] transition-colors duration-100 hover:bg-[var(--surface-3)] md:flex"
              style={{ color: "var(--ink-subtle)", border: "1px solid var(--hairline)" }}
            >
              <Search className="size-3" style={{ color: "var(--lavender)" }} />
              <span>Search</span>
            </button>
          </div>
        </header>

        {/* Workspace */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5" style={{ background: "var(--canvas)" }}>
          <PageTransition key={pathname}>{children}</PageTransition>
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="flex border-t md:hidden"
          style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
        >
          {navSections.flatMap((s) => s.items).slice(0, 5).map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
                style={{ color: active ? "var(--ink)" : "var(--ink-tertiary)" }}
              >
                <Icon
                  className="size-[18px]"
                  style={active ? { color: "var(--lavender)" } : {}}
                />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Right Context Panel ── */}
      <aside
        className="hidden w-[260px] shrink-0 flex-col overflow-y-auto xl:flex"
        style={{ borderLeft: "1px solid var(--hairline)", background: "var(--surface-1)" }}
      >
        <ContextPanel />
      </aside>
    </div>
  );
}

/* ── Context Panel ── */
function ContextPanel() {
  return (
    <div className="p-4 space-y-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
        Health Snapshot
      </p>

      <div
        className="rounded-xl p-3.5 space-y-3"
        style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold"
            style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}
          >
            AB
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>Alex Burke</p>
            <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>O+ · No allergies</p>
          </div>
        </div>
        <div className="space-y-2 pt-2" style={{ borderTop: "1px solid var(--hairline)" }}>
          {[
            { label: "Insurance", value: "Active", ok: true },
            { label: "Vaccinations", value: "12/13" },
            { label: "Emergency Contact", value: "Set" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>{row.label}</span>
              <span
                className="text-[11px] font-medium"
                style={{ color: row.ok ? "var(--semantic-success)" : "var(--ink-muted)" }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
        Network Status
      </p>
      <div
        className="rounded-xl p-3.5 space-y-2"
        style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full animate-provider-pulse" style={{ background: "var(--semantic-success)" }} />
          <span className="text-[12px]" style={{ color: "var(--ink-muted)" }}>Connected</span>
        </div>
        {[
          { label: "Pharmacies nearby", value: "24" },
          { label: "Clinics nearby", value: "8" },
          { label: "Hospitals nearby", value: "3" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>{row.label}</span>
            <span className="text-[11px] font-medium font-mono" style={{ color: "var(--ink-muted)" }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-3.5"
        style={{ background: "var(--lavender-muted)", border: "1px solid rgba(94,106,210,0.18)" }}
      >
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--lavender-hover)" }}>
          Press{" "}
          <kbd
            className="rounded px-1 py-0.5 font-mono text-[10px]"
            style={{ border: "1px solid rgba(94,106,210,0.3)", background: "rgba(94,106,210,0.08)" }}
          >
            ⌘K
          </kbd>{" "}
          to ask the CareCompass Agent.
        </p>
      </div>

      <p className="text-[10px] leading-relaxed opacity-50" style={{ color: "var(--ink-subtle)" }}>
        CareCompass provides navigation guidance only. For emergencies, call local services immediately.
      </p>
    </div>
  );
}
