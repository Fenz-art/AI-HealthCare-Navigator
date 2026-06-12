"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRight, Globe, Keyboard, MessageSquare, Smartphone } from "lucide-react";

const PLATFORMS = [
  {
    id: "01",
    label: "web",
    icon: Globe,
    title: "Navigate on the web.",
    description:
      "Full command center — severity, meds, map, interpreter. The healthcare OS in your browser.",
    cta: "Open dashboard",
    href: "/app/session/new",
    demo: (
      <div className="space-y-2 rounded-lg border bg-[var(--mk-elevated)] p-3 mk-hairline">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">CareCompass · Tokyo session</span>
          <span className="text-[var(--mk-accent)]">94% match</span>
        </div>
        <div className="rounded border bg-[var(--mk-surface)] px-2 py-1.5 text-[10px] text-[var(--mk-success)] mk-hairline">
          Submitted · Pharmacy route
        </div>
      </div>
    ),
  },
  {
    id: "02",
    label: "mobile",
    icon: Smartphone,
    title: "Care in your pocket.",
    description:
      "Push notifications when severity changes. One tap to open interpreter or directions.",
    cta: "Get the app",
    href: "/app/session/new",
    demo: (
      <div className="rounded-lg border bg-[var(--mk-elevated)] p-3 text-xs mk-hairline">
        <p className="text-[var(--mk-text-secondary)]">CareCompass</p>
        <p className="mt-1 font-medium">Pharmacy 0.4km · Tap for directions</p>
        <p className="mt-2 text-[var(--mk-success)]">✓ Interpreter ready · ja-JP</p>
      </div>
    ),
  },
  {
    id: "03",
    label: "interpreter",
    icon: MessageSquare,
    title: "Speak. We translate.",
    description:
      "Hold-to-talk with live waveform. Medical context preserved. Provider mode for the counter.",
    cta: "Try interpreter",
    href: "/app/interpreter",
    demo: (
      <div className="flex h-12 items-end justify-center gap-0.5 rounded-lg border bg-[var(--mk-elevated)] p-2 mk-hairline">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-[var(--mk-accent)]"
            style={{ height: `${20 + Math.sin(i * 0.8) * 30 + 20}%`, opacity: 0.5 + (i % 3) * 0.15 }}
          />
        ))}
      </div>
    ),
  },
  {
    id: "04",
    label: "agent",
    icon: Keyboard,
    title: "Command-first. ⌘K.",
    description:
      "Raycast-speed agent built into the OS. Find meds, translate docs, search history — keyboard native.",
    cta: "Open agent",
    href: "/app",
    demo: (
      <div className="rounded-lg border bg-[#1a1a1a] p-3 font-mono text-[10px] text-[#a3a3a3]">
        <p>
          <span className="text-[#666]">$</span> find pharmacy near shibuya
        </p>
        <p className="mt-1 text-[var(--mk-success)]">→ Matsumoto Kiyoshi · 0.4km · open</p>
      </div>
    ),
  },
];

export function PlatformsMatrix() {
  const locale = useLocale();

  return (
    <section className="border-t mk-hairline py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm text-[var(--mk-text-secondary)]">Wherever you travel.</p>
        <h2 className="mk-headline mt-3">One agent. Four doors.</h2>

        <div className="mt-14 grid border mk-hairline sm:grid-cols-2">
          {PLATFORMS.map((platform, i) => {
            const Icon = platform.icon;
            const isRight = i % 2 === 1;
            const isBottom = i >= 2;
            return (
              <div
                key={platform.id}
                className={`p-8 sm:p-10 ${isRight ? "sm:border-l mk-hairline" : ""} ${isBottom ? "border-t mk-hairline" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-[var(--mk-text-tertiary)]" />
                  <span className="mk-mono">
                    {platform.id} — {platform.label}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-xl font-bold tracking-tight">
                  {platform.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--mk-text-secondary)]">
                  {platform.description}
                </p>
                <div className="mt-6">{platform.demo}</div>
                <Link
                  href={`/${locale}${platform.href}`}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--mk-text)] transition-opacity hover:opacity-70"
                >
                  {platform.cta}
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
