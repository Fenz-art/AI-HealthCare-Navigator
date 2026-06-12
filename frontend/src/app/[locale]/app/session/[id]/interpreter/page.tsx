"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mic, Stethoscope, User } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { InterpreterResponse } from "@/lib/types";
import { InterpreterWave } from "@/components/product/interpreter-wave";
import { motion as motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function InterpreterPage() {
  const params = useParams<{ id: string; locale: string }>();
  const [data, setData] = useState<InterpreterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushing, setPushing] = useState(false);
  const [mode, setMode] = useState<"traveler" | "provider">("traveler");

  useEffect(() => {
    async function loadInterpreter() {
      try {
        const response = await api.getInterpreter(params.id);
        setData(response);
      } catch (err) {
        setError(
          err instanceof ApiClientError ? err.message : "Unable to load interpreter."
        );
      } finally {
        setLoading(false);
      }
    }
    loadInterpreter();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[var(--cc-pharmacy)]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="cc-panel text-center text-[var(--cc-emergency)]">
        {error ?? "Interpreter unavailable."}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.normal, ease: motionTokens.ease }}
      className="mx-auto flex h-full max-w-5xl flex-col gap-5"
    >
      <div className="flex items-center justify-between">
        <Link
          href={`/${params.locale}/app/session/${params.id}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--cc-text-secondary)] transition-colors hover:text-[var(--cc-text)]"
        >
          <ArrowLeft className="size-4" />
          Back to session
        </Link>
        <div className="flex rounded-full border hairline p-0.5">
          {(["traveler", "provider"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-200",
                mode === m
                  ? "bg-[var(--cc-elevated)] text-[var(--cc-text)]"
                  : "text-[var(--cc-text-secondary)]"
              )}
            >
              {m === "traveler" ? <User className="size-3" /> : <Stethoscope className="size-3" />}
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="cc-glow overflow-hidden rounded-3xl border hairline">
        <div className="border-b hairline bg-[var(--cc-surface)] px-6 py-8">
          <InterpreterWave active={pushing} />
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onMouseDown={() => setPushing(true)}
              onMouseUp={() => setPushing(false)}
              onMouseLeave={() => setPushing(false)}
              onTouchStart={() => setPushing(true)}
              onTouchEnd={() => setPushing(false)}
              className={cn(
                "flex size-20 items-center justify-center rounded-full transition-all duration-200",
                pushing
                  ? "scale-105 bg-[var(--cc-pharmacy)] text-white shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                  : "bg-[var(--cc-elevated)] text-[var(--cc-text)] hover:bg-[var(--cc-surface)]"
              )}
            >
              <Mic className="size-7" />
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--cc-text-secondary)]">
            Hold to speak · Release to translate · Medical context preserved
          </p>
        </div>

        <div className="grid lg:grid-cols-2">
          <section
            className={cn(
              "border-b p-6 lg:border-b-0 lg:border-r hairline transition-opacity duration-300",
              mode === "provider" ? "opacity-40" : "opacity-100"
            )}
          >
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--cc-text-secondary)]">
              <User className="size-3.5" />
              Traveler · English
            </p>
            <p className="mt-4 text-sm leading-[1.7] whitespace-pre-line">
              {data.interpreterContextEnglish}
            </p>
          </section>
          <section
            className={cn(
              "p-6 transition-opacity duration-300",
              mode === "traveler" ? "opacity-40" : "opacity-100"
            )}
          >
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--cc-pharmacy)]">
              <Stethoscope className="size-3.5" />
              Provider · {data.targetLanguage}
            </p>
            <p className="mt-4 text-sm font-medium leading-[1.7] whitespace-pre-line">
              {data.interpreterContextTranslated}
            </p>
          </section>
        </div>
      </div>

      <div className="cc-elevated flex items-center justify-between rounded-2xl px-5 py-3 text-xs text-[var(--cc-text-secondary)]">
        <span>Live transcript · Context-aware · You approve before showing</span>
        <span className="font-mono text-[var(--cc-pharmacy)]">{data.targetLanguage}</span>
      </div>
    </motion.div>
  );
}
