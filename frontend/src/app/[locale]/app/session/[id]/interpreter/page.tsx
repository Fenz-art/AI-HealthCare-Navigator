"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mic, Stethoscope, User } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { InterpreterResponse } from "@/lib/types";
import { InterpreterWave } from "@/components/product/interpreter-wave";
import { osVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * NATURAL SPRINT — Session interpreter view.
 * Dark dual-pane. Lavender PTT button. Hairline borders.
 */
export default function InterpreterPage() {
  const params = useParams<{ id: string; locale: string }>();
  const [data, setData] = useState<InterpreterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushing, setPushing] = useState(false);
  const [mode, setMode] = useState<"traveler" | "provider">("traveler");

  useEffect(() => {
    async function load() {
      try {
        setData(await api.getInterpreter(params.id));
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : "Unable to load interpreter.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className="lifted-panel mx-auto max-w-sm rounded-md p-5 text-center"
        style={{ background: "var(--surface-1)" }}
      >
        <p className="text-[13px]" style={{ color: "var(--semantic-red)" }}>
          {error ?? "Interpreter unavailable."}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={osVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto flex h-full max-w-4xl flex-col gap-4"
    >
      {/* Back + mode toggle */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${params.locale}/app/session/${params.id}`}
          className="inline-flex items-center gap-1.5 text-[13px] transition-colors duration-100"
          style={{ color: "var(--ink-tertiary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-subtle)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-tertiary)")}
        >
          <ArrowLeft className="size-3.5" />
          Back to session
        </Link>

        {/* Mode tabs */}
        <div
          className="flex rounded p-0.5"
          style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)" }}
        >
          {(["traveler", "provider"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="flex items-center gap-1.5 rounded px-3 py-1 text-[12px] font-medium capitalize transition-colors duration-100"
              style={{
                background: mode === m ? "var(--surface-4)" : "transparent",
                color: mode === m ? "var(--ink)" : "var(--ink-tertiary)",
              }}
            >
              {m === "traveler" ? <User className="size-3" /> : <Stethoscope className="size-3" />}
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div
        className="lifted-panel flex-1 overflow-hidden rounded-md"
        style={{ background: "var(--surface-1)" }}
      >
        {/* Voice zone */}
        <div
          className="px-6 py-7"
          style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}
        >
          <InterpreterWave active={pushing} />
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onMouseDown={() => setPushing(true)}
              onMouseUp={() => setPushing(false)}
              onMouseLeave={() => setPushing(false)}
              onTouchStart={() => setPushing(true)}
              onTouchEnd={() => setPushing(false)}
              className="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-150"
              style={{
                background: pushing ? "var(--lavender)" : "var(--surface-3)",
                border: `1px solid ${pushing ? "var(--lavender)" : "var(--hairline-strong)"}`,
                boxShadow: pushing ? "0 0 0 4px var(--lavender-muted)" : "none",
                color: pushing ? "var(--inverse-ink)" : "var(--ink-subtle)",
              }}
            >
              <Mic className="size-5" />
            </button>
          </div>
          <p className="mt-3 text-center text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
            Hold to speak · Release to translate · Medical context preserved
          </p>
        </div>

        {/* Dual pane */}
        <div className="grid lg:grid-cols-2">
          <section
            className={cn("p-5 transition-opacity duration-200", mode === "provider" && "opacity-35")}
            style={{ borderRight: "1px solid var(--hairline)" }}
          >
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
              <User className="size-3.5" /> Traveler · English
            </p>
            <p className="mt-3 text-[13px] leading-relaxed whitespace-pre-line" style={{ color: "var(--ink-subtle)" }}>
              {data.interpreterContextEnglish}
            </p>
          </section>
          <section className={cn("p-5 transition-opacity duration-200", mode === "traveler" && "opacity-35")}>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
              <Stethoscope className="size-3.5" /> Provider · {data.targetLanguage}
            </p>
            <p className="mt-3 text-[13px] font-medium leading-relaxed whitespace-pre-line" style={{ color: "var(--ink)" }}>
              {data.interpreterContextTranslated}
            </p>
          </section>
        </div>
      </div>

      {/* Footer status */}
      <div
        className="flex items-center justify-between rounded px-4 py-2.5 text-[11px] lifted-panel"
        style={{ background: "var(--surface-1)" }}
      >
        <span style={{ color: "var(--ink-tertiary)" }}>Live transcript · Context-aware · You approve before showing</span>
        <span className="font-mono" style={{ color: "var(--lavender-hover)" }}>{data.targetLanguage}</span>
      </div>
    </motion.div>
  );
}
