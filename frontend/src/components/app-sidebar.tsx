"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Home", icon: "🏠" },
  { href: "/app/session/active", label: "Active Session", icon: "🩺" },
  { href: "/app/passport", label: "Health Passport", icon: "🛂" },
  { href: "/app/vault", label: "Health Vault", icon: "🗄️" },
  { href: "/app/interpreter", label: "Interpreter", icon: "🗣️" },
  { href: "/app/history", label: "History", icon: "🕒" },
  { href: "/app/settings", label: "Settings", icon: "⚙️" },
];

interface AppSidebarProps {
  user: { name?: string | null; email?: string | null };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const params = useParams() as { locale?: string };
  const locale = params?.locale ?? "en";

  return (
    <aside className="hidden h-full w-72 flex-col border-r border-slate-200 bg-white p-5 md:flex">
      <div className="mb-8">
        <div className="text-2xl font-semibold tracking-tight text-slate-900">CareCompass</div>
        <p className="text-xs text-slate-500 mt-1">Traveler Health OS</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const href = `/${locale}${item.href}`;
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                active ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <div className="font-semibold text-slate-900">{user.name ?? 'Traveler'}</div>
        <div className="truncate text-slate-500">{user.email ?? 'No email'}</div>
      </div>
    </aside>
  );
}
