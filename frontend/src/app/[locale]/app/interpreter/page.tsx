"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Stethoscope,
  User,
  Languages,
  Volume2,
  ArrowRightLeft,
  Clock,
  MessageCircle,
} from "lucide-react";
import { InterpreterWave } from "@/components/product/interpreter-wave";
import { cn } from "@/lib/utils";

const TRANSCRIPT_HISTORY = [
  { role: "traveler", text: "I have food poisoning with diarrhea. I need loperamide and oral rehydration solution.", translation: "食中毒による下痢があります。ロペラミドと経口補水液が必要です。" },
  { role: "provider", text: "How long have you had the symptoms? Do you have a fever?", translation: "症状はどのくらい続いていますか？熱はありますか？" },
  { role: "traveler", text: "About 6 hours. Temperature is 37.8°C. No blood in stool.", translation: "約6時間です。体温は37.8°Cです。血便はありません。" },
];

export default function InterpreterPage() {
  const { locale } = useParams() as { locale: string };
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"traveler" | "provider">("traveler");
  const [currentText, setCurrentText] = useState(TRANSCRIPT_HISTORY[0].text);
  const [currentTranslation, setCurrentTranslation] = useState(TRANSCRIPT_HISTORY[0].translation);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentText]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
            The moat
          </p>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>
            Medical Interpreter
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
            Medical-grade, dual-language interpretation with live voice and full session context.
          </p>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
      >
        {/* Voice zone */}
        <div
          className="px-6 py-8 text-center"
          style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}
        >
          <InterpreterWave active={isActive} />
          <div className="mt-6 flex items-center justify-center gap-4">
            <motion.button
              type="button"
              onMouseDown={() => setIsActive(true)}
              onMouseUp={() => setIsActive(false)}
              onMouseLeave={() => setIsActive(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full transition-all duration-150",
                isActive && "ring-4",
              )}
              style={{
                background: isActive ? "var(--lavender)" : "var(--surface-3)",
                border: `1px solid ${isActive ? "var(--lavender)" : "var(--hairline-strong)"}`,
                boxShadow: isActive ? "0 0 0 8px var(--lavender-muted)" : "none",
                color: isActive ? "var(--inverse-ink)" : "var(--ink-subtle)",
              }}
            >
              {isActive ? <Mic className="size-6" /> : <MicOff className="size-6" />}
            </motion.button>
          </div>
          <p className="mt-3 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
            {isActive ? "Listening — speak naturally" : "Push and hold to speak"}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium" style={{ background: "var(--surface-3)", color: "var(--ink-muted)", border: "1px solid var(--hairline)" }}>
              <Volume2 className="size-3" /> EN
            </span>
            <ArrowRightLeft className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium" style={{ background: "var(--surface-3)", color: "var(--ink-muted)", border: "1px solid var(--hairline)" }}>
              <Volume2 className="size-3" /> 日本語
            </span>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex" style={{ borderBottom: "1px solid var(--hairline)" }}>
          {(["traveler", "provider"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="flex flex-1 items-center justify-center gap-2 py-3 text-[13px] font-medium capitalize transition-colors duration-100"
              style={{
                background: mode === m ? "var(--surface-2)" : "transparent",
                color: mode === m ? "var(--ink)" : "var(--ink-tertiary)",
                borderBottom: mode === m ? "2px solid var(--lavender)" : "2px solid transparent",
              }}
            >
              {m === "traveler" ? <User className="size-4" /> : <Stethoscope className="size-4" />}
              {m}
            </button>
          ))}
        </div>

        {/* Dual-pane transcript */}
        <div className="grid lg:grid-cols-2">
          <div className={cn("p-5", mode === "provider" && "opacity-40")} style={{ borderRight: "1px solid var(--hairline)" }}>
            <div className="flex items-center gap-2 mb-3">
              <User className="size-4" style={{ color: "var(--lavender)" }} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
                Traveler · English
              </p>
            </div>
            <div className="space-y-3">
              {TRANSCRIPT_HISTORY.map((entry, i) => (
                <div key={i}>
                  {entry.role === "traveler" && (
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                      {entry.text}
                    </p>
                  )}
                </div>
              ))}
              <div className="rounded-lg p-3" style={{ background: "rgba(94,106,210,0.06)", border: "1px solid rgba(94,106,210,0.1)" }}>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink)" }}>
                  {currentText}
                </p>
              </div>
            </div>
          </div>

          <div className={cn("p-5", mode === "traveler" && "opacity-40")}>
            <div className="flex items-center gap-2 mb-3">
              <Languages className="size-4" style={{ color: "var(--lavender-hover)" }} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
                Provider · 日本語
              </p>
            </div>
            <div className="space-y-3">
              {TRANSCRIPT_HISTORY.map((entry, i) => (
                <div key={i}>
                  {entry.role === "traveler" && (
                    <p key={i} className="text-[13px] font-medium leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                      {entry.translation}
                    </p>
                  )}
                </div>
              ))}
              <div className="rounded-lg p-3" style={{ background: "rgba(94,106,210,0.06)", border: "1px solid rgba(94,106,210,0.1)" }}>
                <p className="text-[13px] font-medium leading-relaxed" style={{ color: "var(--ink)" }}>
                  {currentTranslation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
          <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
            <Clock className="inline size-3 mr-1" />
            Real-time · Medical-grade
          </span>
          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
            <MessageCircle className="size-3" />
            Full context from active session
          </span>
        </div>
      </div>
    </div>
  );
}
