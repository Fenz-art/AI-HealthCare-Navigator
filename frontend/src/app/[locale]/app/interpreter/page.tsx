"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Mic, Stethoscope, User } from "lucide-react";
import { PageHeader } from "@/components/os/page-header";
import { InterpreterWave } from "@/components/product/interpreter-wave";
import { cn } from "@/lib/utils";

export default function InterpreterPage() {
  const { locale } = useParams() as { locale: string };
  const [pushing, setPushing] = useState(false);
  const [mode, setMode] = useState<"traveler" | "provider">("traveler");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        eyebrow="The moat"
        title="Interpreter"
        description="Medical-grade translation with live voice, dual display, and provider mode. Open from any active session for full context."
        action={
          <Link href={`/${locale}/app/session/new`} className="btn-primary">
            Start session
          </Link>
        }
      />

      <div className="cc-glow overflow-hidden rounded-3xl border hairline">
        <div className="border-b hairline bg-[var(--cc-surface)] px-6 py-8">
          <InterpreterWave active={pushing} />
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onMouseDown={() => setPushing(true)}
              onMouseUp={() => setPushing(false)}
              onMouseLeave={() => setPushing(false)}
              className={cn(
                "flex size-16 items-center justify-center rounded-full transition-all duration-200",
                pushing
                  ? "bg-[var(--cc-pharmacy)] text-white shadow-[0_0_32px_rgba(59,130,246,0.35)]"
                  : "bg-[var(--cc-elevated)]"
              )}
            >
              <Mic className="size-6" />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-[var(--cc-text-secondary)]">
            Demo mode · Start a session for live medical context
          </p>
        </div>

        <div className="flex rounded-none border-b hairline p-1">
          {(["traveler", "provider"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-medium capitalize transition-colors",
                mode === m
                  ? "bg-[var(--cc-elevated)] text-[var(--cc-text)]"
                  : "text-[var(--cc-text-secondary)]"
              )}
            >
              {m === "traveler" ? <User className="size-3.5" /> : <Stethoscope className="size-3.5" />}
              {m}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2">
          <div
            className={cn(
              "border-b p-6 lg:border-b-0 lg:border-r hairline",
              mode === "provider" && "opacity-40"
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--cc-text-secondary)]">
              Traveler · English
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--cc-text-secondary)]">
              I have food poisoning with diarrhea. I need loperamide and oral rehydration. No
              penicillin allergy.
            </p>
          </div>
          <div className={cn("p-6", mode === "traveler" && "opacity-40")}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--cc-pharmacy)]">
              Provider · 日本語
            </p>
            <p className="mt-4 text-sm font-medium leading-relaxed">
              食中毒による下痢があります。ロペラミドと経口補水液が必要です。ペニシリンアレルギーはありません。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
