"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Compass, PlusCircle, Radio, Sparkles } from "lucide-react";
import { useSessionStore } from "@/stores/sessionStore";
import { motion } from "framer-motion";

export default function ActiveSessionPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const { sessionId } = useSessionStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionId) {
      router.replace(`/${locale}/app/session/${sessionId}`);
    } else {
      setChecking(false);
    }
  }, [sessionId, router, locale]);

  if (checking) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Compass className="size-8 animate-spin text-[var(--cc-pharmacy)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-10">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--cc-border)] bg-[var(--cc-surface)] p-8 md:p-12 cc-glow">
        {/* Decorative radar background */}
        <div className="absolute -right-20 -top-20 pointer-events-none opacity-20">
          <div className="relative size-80 rounded-full border border-[var(--cc-border)] flex items-center justify-center">
            <div className="absolute size-60 rounded-full border border-[var(--cc-border)] flex items-center justify-center">
              <div className="absolute size-40 rounded-full border border-[var(--cc-border)]" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute inset-0 border-t border-[var(--cc-pharmacy)] rounded-full"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--cc-border)] bg-[var(--cc-elevated)] px-3.5 py-1.5 text-xs text-[var(--cc-text-secondary)] mb-6">
            <Radio className="size-3.5 text-[var(--cc-emergency)] animate-pulse" />
            Air Traffic Control Mode
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--cc-text)] sm:text-4xl">
            No Active Flight Path
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--cc-text-secondary)]">
            You do not have an active healthcare navigation session in progress. 
            Start a new session to map symptoms, resolve medication equivalents, and locate nearby providers.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/app/session/new`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--cc-text)] px-6 text-sm font-semibold text-[var(--cc-bg)] transition-opacity hover:opacity-90"
            >
              <PlusCircle className="size-4" />
              Start new session
            </Link>
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--cc-border)] px-6 text-sm font-semibold text-[var(--cc-text)] transition-colors hover:bg-[var(--cc-elevated)]"
            >
              <Sparkles className="size-4 text-[var(--cc-pharmacy)]" />
              Ask Agent (⌘K)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
