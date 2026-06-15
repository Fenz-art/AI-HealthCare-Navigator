"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Code2, Globe2, Loader2, ShieldCheck } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function LoginPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const [loading, setLoading] = useState<"google" | "dev" | null>(null);
  const [devExpanded, setDevExpanded] = useState(false);
  const [devEmail, setDevEmail] = useState("dev@carecompass.local");

  async function handleGoogleSignIn() {
    setLoading("google");
    await signIn("google", { callbackUrl: `/${locale}/app/onboarding` });
  }

  async function handleDevSignIn() {
    setLoading("dev");
    await signIn("developer", {
      email: devEmail,
      callbackUrl: `/${locale}/app/onboarding`,
    });
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--mk-bg)] px-4">
      {/* Atmospheric background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,92,38,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Top nav */}
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

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="w-full max-w-[380px]"
      >
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--mk-border)] bg-[var(--mk-surface)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mk-text-secondary)]">
            <ShieldCheck className="size-3 text-[var(--mk-accent)]" />
            Secure · Encrypted · Private
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--mk-text)]">
            Your passport to
            <br />
            <span className="text-[var(--mk-accent)]">healthcare anywhere</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--mk-text-secondary)]">
            Sign in to access your health vault, passport,<br />
            and AI navigation for travel emergencies.
          </p>
        </div>

        {/* Sign-in card */}
        <div
          className="overflow-hidden rounded-2xl border bg-[var(--mk-surface)]"
          style={{
            borderColor: "var(--mk-border-strong)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset",
          }}
        >
          <div className="p-6">
            <button
              id="google-signin-btn"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading !== null}
              className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[var(--mk-text)] text-sm font-semibold text-[var(--mk-bg)] transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            >
              {loading === "google" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  {/* Google G SVG */}
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--mk-border)]" />
              <span className="text-[11px] font-medium text-[var(--mk-text-tertiary)]">or</span>
              <div className="h-px flex-1 bg-[var(--mk-border)]" />
            </div>

            {/* Developer bypass */}
            <div className="overflow-hidden rounded-xl border border-dashed" style={{ borderColor: "var(--mk-border-strong)" }}>
              <button
                id="dev-bypass-toggle"
                type="button"
                onClick={() => setDevExpanded((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[var(--mk-elevated)]"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="size-3.5 text-[var(--mk-text-tertiary)]" />
                  <span className="text-xs font-medium text-[var(--mk-text-secondary)]">
                    Developer bypass
                  </span>
                </div>
                <ArrowRight
                  className={`size-3.5 text-[var(--mk-text-tertiary)] transition-transform duration-200 ${devExpanded ? "rotate-90" : ""}`}
                />
              </button>

              <AnimatePresence>
                {devExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease }}
                    className="overflow-hidden"
                  >
                    <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: "var(--mk-border)" }}>
                      <p className="mb-3 text-[11px] leading-relaxed text-[var(--mk-text-tertiary)]">
                        Skip Google OAuth for local development. Instantly signs in with a mock developer account.
                      </p>
                      <input
                        type="email"
                        value={devEmail}
                        onChange={(e) => setDevEmail(e.target.value)}
                        placeholder="dev@carecompass.local"
                        className="mb-3 h-9 w-full rounded-lg border bg-[var(--mk-elevated)] px-3 text-xs outline-none focus:ring-2 focus:ring-[var(--mk-accent)]/30"
                        style={{ borderColor: "var(--mk-border)" }}
                      />
                      <button
                        id="dev-signin-btn"
                        type="button"
                        onClick={handleDevSignIn}
                        disabled={loading !== null}
                        className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[var(--mk-elevated)] text-xs font-semibold text-[var(--mk-text)] transition-colors hover:bg-[rgba(0,0,0,0.08)] disabled:opacity-50"
                      >
                        {loading === "dev" ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <>
                            <Code2 className="size-3.5" />
                            Sign in as Developer
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t px-6 py-3.5" style={{ borderColor: "var(--mk-border)" }}>
            <p className="text-center text-[11px] leading-relaxed text-[var(--mk-text-tertiary)]">
              By continuing, you agree to CareCompass's{" "}
              <span className="underline underline-offset-2">Terms of Service</span>{" "}
              and{" "}
              <span className="underline underline-offset-2">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bottom trust signals */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute bottom-8 flex items-center gap-6"
      >
        {["20 countries", "30 active ingredients", "Medical-grade interpreter"].map((text) => (
          <p key={text} className="text-[11px] text-[var(--mk-text-tertiary)]">
            {text}
          </p>
        ))}
      </motion.div>
    </div>
  );
}
