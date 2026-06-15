"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Compass, PlusCircle, Activity } from "lucide-react";
import { useSessionStore } from "@/stores/sessionStore";
import { motion } from "framer-motion";
import { osVariants } from "@/lib/motion";

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
        <Compass
          className="size-6 animate-spin"
          style={{ color: "var(--lavender)" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={osVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-2xl"
    >
      {/* Empty state — Linear-style */}
      <div
        className="lifted-panel rounded-md p-8"
        style={{ background: "var(--surface-1)" }}
      >
        {/* Icon */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-md mb-5"
          style={{ background: "var(--surface-3)", border: "1px solid var(--hairline)" }}
        >
          <Activity className="size-5" style={{ color: "var(--ink-tertiary)" }} />
        </div>

        {/* Copy */}
        <h1
          className="text-[22px] font-semibold tracking-tight"
          style={{ color: "var(--ink)", letterSpacing: "-0.4px" }}
        >
          No active session
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
          Start a new session to assess symptoms, map local medication equivalents, and
          locate nearby care providers.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/${locale}/app/session/new`}
            className="btn-primary gap-2"
          >
            <PlusCircle className="size-4" />
            Start new session
          </Link>
          <button
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
              )
            }
            className="btn-secondary gap-2"
          >
            Ask Agent
            <kbd
              className="rounded px-1 py-0.5 font-mono text-[10px]"
              style={{ background: "var(--surface-4)", border: "1px solid var(--hairline)", color: "var(--ink-tertiary)" }}
            >
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
