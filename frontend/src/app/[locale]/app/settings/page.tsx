"use client";

import { useState } from "react";
import { Bell, Globe, Moon, Shield, User } from "lucide-react";
import { PageHeader } from "@/components/os/page-header";
import { cn } from "@/lib/utils";

const SETTINGS_GROUPS = [
  {
    title: "Account",
    icon: User,
    items: [
      { label: "Display name", value: "Alex Traveler", type: "text" as const },
      { label: "Email", value: "alex@example.com", type: "text" as const },
    ],
  },
  {
    title: "Preferences",
    icon: Globe,
    items: [
      { label: "Home country", value: "United States", type: "select" as const },
      { label: "Preferred language", value: "English", type: "select" as const },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Session updates", value: true, type: "toggle" as const },
      { label: "Severity changes", value: true, type: "toggle" as const },
      { label: "Outcome reminders", value: false, type: "toggle" as const },
    ],
  },
  {
    title: "Privacy",
    icon: Shield,
    items: [
      { label: "Share location during sessions", value: true, type: "toggle" as const },
      { label: "Anonymous outcome data", value: true, type: "toggle" as const },
    ],
  },
];

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors duration-200",
        on ? "bg-[var(--cc-pharmacy)]" : "bg-[var(--cc-elevated)]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white transition-transform duration-200",
          on ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        eyebrow="System"
        title="Settings"
        description="Preferences, privacy, and account — minimal, intentional, under your control."
      />

      <div className="space-y-6">
        {SETTINGS_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <section key={group.title} className="cc-panel">
              <div className="flex items-center gap-2 border-b hairline pb-4">
                <Icon className="size-4 text-[var(--cc-text-secondary)]" />
                <h2 className="text-sm font-semibold">{group.title}</h2>
              </div>
              <div className="mt-2 divide-y hairline">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-4 first:pt-2"
                  >
                    <span className="text-sm text-[var(--cc-text-secondary)]">
                      {item.label}
                    </span>
                    {item.type === "toggle" ? (
                      <Toggle defaultOn={item.value as boolean} />
                    ) : (
                      <span className="text-sm font-medium">{item.value as string}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <section className="cc-panel">
          <div className="flex items-center gap-2 border-b hairline pb-4">
            <Moon className="size-4 text-[var(--cc-text-secondary)]" />
            <h2 className="text-sm font-semibold">Appearance</h2>
          </div>
          <p className="mt-4 text-sm text-[var(--cc-text-secondary)]">
            Dark command center is optimized for operational focus. Light mode coming soon.
          </p>
        </section>
      </div>
    </div>
  );
}
