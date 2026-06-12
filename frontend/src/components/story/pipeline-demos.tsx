"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoCard } from "./demo-card";
import { motion as motionTokens } from "@/lib/motion";

const SCAN_LOG = [
  { time: "23:11:10", url: "scanning tokyo-medical.jp/providers", new: false },
  { time: "23:11:12", url: "scanning matsukiyo.co.jp/stores", new: false },
  { time: "23:11:14", url: "match: pharmacy · 0.4km · open now", new: true },
  { time: "23:11:16", url: "mapping loperamide → Imodium HP", new: true },
  { time: "23:11:18", url: "interpreter: ja-JP ready", new: false },
];

export function DetectDemo() {
  const [lines, setLines] = useState<typeof SCAN_LOG>([]);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i < SCAN_LOG.length) {
        setLines((prev) => [...prev, SCAN_LOG[i]]);
        i++;
      } else {
        clearInterval(id);
      }
    }, 700);
    return () => clearInterval(id);
  }, []);

  return (
    <DemoCard
      eyebrow="01 · DETECT — HEAD START"
      title="Symptoms in. Severity out. Before you panic-search."
      subtitle="Real-time navigation graph across 20+ countries"
      footer={
        <p className="mk-mono">
          0 manual searches needed · care routing computed instantly.
        </p>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border bg-[var(--mk-elevated)] p-4 font-mono text-xs mk-hairline">
          <AnimatePresence>
            {lines.map((line) => (
              <motion.div
                key={line.time + line.url}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: motionTokens.easeOut }}
                className="flex items-center gap-3 py-1"
              >
                <span className="text-[var(--mk-text-tertiary)]">[{line.time}]</span>
                <span className="text-[var(--mk-text-secondary)]">{line.url}</span>
                {line.new ? (
                  <span className="rounded-full bg-[var(--mk-accent-muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--mk-accent)]">
                    +1 new
                  </span>
                ) : null}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-4 mk-hairline">
            <p className="mk-mono mb-3">TIME TO CARE</p>
            <div className="flex items-end gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--mk-text-tertiary)]">
                  Via CareCompass
                </p>
                <div className="mt-2 h-2 w-24 rounded-full bg-[var(--mk-accent)]" />
                <p className="mt-1 font-display text-2xl font-bold">4 min</p>
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-[var(--mk-text-tertiary)]">
                  Via search & guess
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-[var(--mk-border-strong)]" />
                <p className="mt-1 text-sm text-[var(--mk-text-secondary)]">45+ min</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border p-4 mk-hairline">
            <p className="mk-mono mb-2">SEVERITY</p>
            <p className="font-display text-xl font-bold">Pharmacy visit</p>
            <p className="mt-1 text-sm text-[var(--mk-text-secondary)]">
              Not emergency · Self-care insufficient · Guided OTC route
            </p>
          </div>
        </div>
      </div>
    </DemoCard>
  );
}

export function NavigateDemo() {
  return (
    <DemoCard
      eyebrow="02 · NAVIGATE — LOCAL MEDS"
      title="Your medication. Their brand. Instantly."
      subtitle="Active ingredient graph across 20 countries"
    >
      <div className="space-y-2">
        {[
          { from: "Loperamide", to: "Imodium HP", market: "Japan", match: "Exact" },
          { from: "Oral rehydration", to: "OS-1 / Oresol", market: "Japan", match: "Equivalent" },
          { from: "Acetaminophen", to: "タイレノール A", market: "Japan", match: "Exact" },
        ].map((row, i) => (
          <motion.div
            key={row.from}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: motionTokens.easeOut }}
            className="flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 mk-hairline"
          >
            <span className="text-sm text-[var(--mk-text-secondary)] line-through decoration-[var(--mk-danger)]/40">
              {row.from}
            </span>
            <span className="text-[var(--mk-text-tertiary)]">→</span>
            <span className="text-sm font-semibold text-[var(--mk-text)]">{row.to}</span>
            <span className="ml-auto rounded-full bg-[var(--mk-success-muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--mk-success)]">
              {row.match} · {row.market}
            </span>
          </motion.div>
        ))}
      </div>
    </DemoCard>
  );
}

export function LocateDemo() {
  const providers = [
    { name: "Matsumoto Kiyoshi", dist: "0.4 km", status: "Open · 24h", type: "Pharmacy" },
    { name: "Tomod's Shibuya", dist: "0.7 km", status: "Open until 22:00", type: "Pharmacy" },
    { name: "Shibuya Central Clinic", dist: "1.2 km", status: "Walk-in", type: "Clinic" },
  ];

  return (
    <DemoCard
      eyebrow="03 · LOCATE — ON MAP"
      title="Care you can walk to. Directions included."
      subtitle="Geo-ranked providers · severity-matched facility type"
    >
      <div className="relative overflow-hidden rounded-xl border bg-[var(--mk-elevated)] mk-hairline">
        <div className="absolute inset-0 opacity-30">
          <svg className="h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <motion.circle
              cx="200"
              cy="100"
              r="40"
              fill="none"
              stroke="var(--mk-accent)"
              strokeWidth="1"
              strokeOpacity="0.3"
              animate={{ r: [40, 60, 40], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="200" cy="100" r="4" fill="var(--mk-accent)" />
          </svg>
        </div>
        <div className="relative space-y-2 p-4">
          {providers.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className="flex items-center justify-between rounded-lg border bg-[var(--mk-surface)] px-4 py-3 mk-hairline"
            >
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-[var(--mk-text-secondary)]">
                  {p.type} · {p.dist}
                </p>
              </div>
              <span className="text-xs text-[var(--mk-success)]">{p.status}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </DemoCard>
  );
}

export function TranslateDemo() {
  return (
    <DemoCard
      eyebrow="04 · TRANSLATE — INTERPRETER"
      title="Show the pharmacist exactly what you need."
      subtitle="Dual-language · medical context · provider mode"
      footer={
        <div className="flex items-center justify-between text-xs text-[var(--mk-text-secondary)]">
          <span>4 changes · nothing sent yet</span>
          <span className="flex gap-4">
            <button type="button" className="hover:text-[var(--mk-text)]">
              Edit
            </button>
            <button type="button" className="font-medium text-[var(--mk-text)]">
              Approve & show
            </button>
          </span>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-4 mk-hairline">
          <p className="mk-mono mb-3">TRAVELER · EN</p>
          <p className="text-sm leading-relaxed text-[var(--mk-text-secondary)]">
            I have food poisoning with diarrhea. I need loperamide and oral rehydration. No
            penicillin allergy.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--mk-accent)]/20 bg-[var(--mk-accent-muted)]/30 p-4">
          <p className="mk-mono mb-3 text-[var(--mk-accent)]">PROVIDER · 日本語</p>
          <p className="text-sm font-medium leading-relaxed">
            食中毒による下痢があります。ロペラミドと経口補水液が必要です。ペニシリンアレルギーはありません。
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <span className="text-[var(--mk-danger)]">−</span>
          <span className="text-[var(--mk-text-secondary)] line-through">
            I think I have food poisoning from fish, my stomach is in intense pain.
          </span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-[var(--mk-success)]">+</span>
          <span className="font-medium">
            ロペラミド（イモジウムHP）と経口補水液（OS-1）をお願いします。ペニシリンアレルギーはありません。
          </span>
        </div>
      </div>
    </DemoCard>
  );
}

export function ResolveDemo() {
  const columns = [
    { label: "SUBMITTED", count: 1, items: ["Pharmacy visit · Matsumoto"] },
    { label: "IN FLIGHT", count: 0, items: [] },
    { label: "RESOLVED", count: 0, items: [] },
    { label: "OUTCOME", count: 1, items: ["Symptoms improving"] },
  ];

  return (
    <DemoCard
      eyebrow="05 · RESOLVE — OUTCOME"
      title="What happened. Tracked. Remembered."
      subtitle="Every session strengthens your travel health memory"
      footer={
        <p className="mk-mono">0 manual steps · 1 session routed automatically</p>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {columns.map((col) => (
          <div key={col.label} className="rounded-xl border p-3 mk-hairline">
            <p className="mk-mono">
              {col.label} ({col.count})
            </p>
            {col.items.map((item) => (
              <p key={item} className="mt-2 text-xs font-medium text-[var(--mk-text)]">
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>
    </DemoCard>
  );
}
