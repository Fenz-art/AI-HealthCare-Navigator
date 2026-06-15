"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { motion as motionTokens } from "@/lib/motion";
import {
  Compass,
  FileText,
  Languages,
  Pill,
  Search,
  Sparkles,
  Clock3,
  Shield,
} from "lucide-react";

const ACTIONS = [
  { label: "Start new session", icon: Compass, href: "/app/session/new", kbd: "N" },
  { label: "Find medication", icon: Pill, href: "/app/session/new" },
  { label: "Open interpreter", icon: Languages, href: "/app/interpreter" },
  { label: "Health vault", icon: FileText, href: "/app/vault" },
  { label: "Health passport", icon: Shield, href: "/app/passport" },
  { label: "Session history", icon: Clock3, href: "/app/history" },
  { label: "Generate travel card", icon: Sparkles, href: "/app/passport" },
];

type FloatingCommandBarProps = {
  locale?: string;
};

export function FloatingCommandBar({ locale = "en" }: FloatingCommandBarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.fast }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: motionTokens.normal, ease: motionTokens.ease }}
            className="lifted-panel fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-xl"
            style={{
              background: "var(--surface-2)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}
          >
            <Command className="flex flex-col" loop>
              <div
                className="flex items-center gap-3 px-4"
                style={{ borderBottom: "1px solid var(--hairline)" }}
              >
                <Search className="size-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
                <Command.Input
                  placeholder="What do you need?"
                  className="h-14 flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--ink)", caretColor: "var(--lavender)" }}
                />
                <kbd
                  className="rounded px-1.5 py-0.5 font-mono text-[10px]"
                  style={{
                    border: "1px solid var(--hairline)",
                    background: "var(--surface-3)",
                    color: "var(--ink-tertiary)",
                  }}
                >
                  esc
                </kbd>
              </div>
              <Command.List className="max-h-72 overflow-y-auto p-2">
                <Command.Empty
                  className="px-3 py-8 text-center text-sm"
                  style={{ color: "var(--ink-subtle)" }}
                >
                  No results.
                </Command.Empty>
                <Command.Group
                  heading="Actions"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em]"
                  style={{ ["--cmdk-group-heading-color" as string]: "var(--ink-tertiary)" }}
                >
                  {ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Command.Item
                        key={action.label}
                        value={action.label}
                        onSelect={() => setOpen(false)}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors duration-100 aria-selected:bg-[var(--surface-3)]"
                      >
                        <Link
                          href={`/${locale}${action.href}`}
                          className="flex w-full items-center gap-3"
                          onClick={() => setOpen(false)}
                        >
                          <Icon className="size-4" style={{ color: "var(--ink-subtle)" }} />
                          <span className="flex-1" style={{ color: "var(--ink-muted)" }}>
                            {action.label}
                          </span>
                          {action.kbd ? (
                            <kbd
                              className="rounded px-1.5 py-0.5 font-mono text-[10px]"
                              style={{
                                border: "1px solid var(--hairline)",
                                background: "var(--surface-3)",
                                color: "var(--ink-tertiary)",
                              }}
                            >
                              {action.kbd}
                            </kbd>
                          ) : null}
                        </Link>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              </Command.List>
              <div
                className="px-4 py-2.5"
                style={{ borderTop: "1px solid var(--hairline)" }}
              >
                <p className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
                  CareCompass Agent · Navigation, not diagnosis
                </p>
              </div>
            </Command>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex size-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 hover:opacity-90 md:bottom-6"
        style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}
        aria-label="Open command bar (Ctrl+K)"
      >
        <Sparkles className="size-5" />
      </button>
    </>
  );
}
