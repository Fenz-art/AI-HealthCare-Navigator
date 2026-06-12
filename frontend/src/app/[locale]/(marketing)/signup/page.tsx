"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Globe2, ShieldCheck } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function SignupPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--mk-bg)] px-4">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,92,38,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-5">
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <div className="flex size-7 items-center justify-center rounded-full bg-[var(--mk-text)]">
            <Globe2 className="size-4 text-[var(--mk-bg)]" strokeWidth={2.5} />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-[var(--mk-text)] group-hover:opacity-70 transition-opacity">
            CareCompass
          </span>
        </Link>
        <p className="text-xs text-[var(--mk-text-tertiary)]">
          Health navigation OS for travelers
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="w-full max-w-[380px]"
      >
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--mk-border)] bg-[var(--mk-surface)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mk-text-secondary)]">
            <ShieldCheck className="size-3 text-[var(--mk-accent)]" />
            Secure · Encrypted · Private
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--mk-text)]">
            Create account
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--mk-text-secondary)]">
            Account creation is integrated with Google authentication for global security standards.
          </p>
        </div>

        <div
          className="overflow-hidden rounded-2xl border bg-[var(--mk-surface)]"
          style={{
            borderColor: "var(--mk-border-strong)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset",
          }}
        >
          <div className="p-6 text-center space-y-4">
            <p className="text-sm text-[var(--mk-text-secondary)]">
              No forms needed. We sync secure data with your Google account.
            </p>
            <Link
              href={`/${locale}/login`}
              className="inline-flex w-full h-11 items-center justify-center rounded-full bg-[var(--mk-text)] text-[var(--mk-bg)] text-sm font-semibold tracking-wide transition-all hover:opacity-90"
            >
              Continue to Sign in
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
