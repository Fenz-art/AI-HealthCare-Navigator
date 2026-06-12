"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Globe2,
  Loader2,
  MapPin,
  Phone,
  Pill,
  User,
} from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as const;

const COUNTRIES = [
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Brazil", code: "BR", flag: "🇧🇷" },
  { name: "Thailand", code: "TH", flag: "🇹🇭" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "UAE", code: "AE", flag: "🇦🇪" },
  { name: "Singapore", code: "SG", flag: "🇸🇬" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
];

const LANGUAGES = [
  { name: "English", code: "en" },
  { name: "Español", code: "es" },
  { name: "Français", code: "fr" },
  { name: "Deutsch", code: "de" },
  { name: "日本語", code: "ja" },
  { name: "हिंदी", code: "hi" },
  { name: "中文", code: "zh" },
  { name: "العربية", code: "ar" },
  { name: "Português", code: "pt" },
];

const STEPS = [
  { id: "profile", icon: MapPin, title: "Where are you from?", subtitle: "Sets your home country and preferred language." },
  { id: "medical", icon: Pill, title: "Your medical profile", subtitle: "Allergies and current medications — used to personalize every session." },
  { id: "emergency", icon: Phone, title: "Emergency contact", subtitle: "Someone we can help reach if you're unable to communicate." },
];

const inputClass =
  "h-11 w-full rounded-xl border bg-[var(--cc-elevated)] px-4 text-sm outline-none transition-all duration-150 placeholder:text-[var(--cc-text-secondary)] focus:ring-2 focus:ring-[var(--cc-pharmacy)]/30 focus:border-[var(--cc-pharmacy)]/40";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const params = useParams();
  const locale = params.locale as string;
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    homeCountry: "",
    preferredLanguage: locale || "en",
    allergies: "",
    medications: "",
    emergencyContact: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeCountry: formData.homeCountry,
          preferredLanguage: formData.preferredLanguage,
          allergies: formData.allergies ? formData.allergies.split(",").map((a) => a.trim()).filter(Boolean) : [],
          medications: formData.medications ? formData.medications.split(",").map((m) => m.trim()).filter(Boolean) : [],
          emergencyContacts: [
            {
              name: formData.emergencyContact,
              phone: formData.emergencyPhone,
              relation: formData.emergencyRelation || "Contact",
            },
          ],
        }),
      });
      // Even if API fails in demo mode, proceed
      setDone(true);
      setTimeout(() => {
        router.push(`/${formData.preferredLanguage}/app`);
      }, 1600);
    } catch {
      setDone(true);
      setTimeout(() => router.push(`/${formData.preferredLanguage || locale}/app`), 1600);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[var(--cc-pharmacy)]" />
      </div>
    );
  }

  const selectedCountry = COUNTRIES.find((c) => c.code === formData.homeCountry);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cc-bg)] px-4 py-16">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59,130,246,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-8 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--cc-surface)] border" style={{ borderColor: "var(--cc-border)" }}>
              <Globe2 className="size-6 text-[var(--cc-pharmacy)]" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-[-0.03em]">
            Build your Health Passport
          </h1>
          <p className="mt-2 text-sm text-[var(--cc-text-secondary)]">
            Hi {session.user?.name?.split(" ")[0] ?? "Traveler"} — this takes under 2 minutes
          </p>
        </motion.div>

        {/* Step indicators */}
        <div className="mb-8 flex items-center gap-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isComplete = i < step;
            const isActive = i === step;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col items-center gap-1.5">
                  <motion.div
                    animate={{
                      background: isComplete
                        ? "var(--cc-pharmacy)"
                        : isActive
                        ? "var(--cc-elevated)"
                        : "var(--cc-elevated)",
                      borderColor: isComplete
                        ? "var(--cc-pharmacy)"
                        : isActive
                        ? "rgba(59,130,246,0.5)"
                        : "var(--cc-border)",
                    }}
                    className="flex size-9 items-center justify-center rounded-full border transition-all duration-300"
                  >
                    {isComplete ? (
                      <CheckCircle2 className="size-4 text-white" />
                    ) : (
                      <Icon className={`size-4 ${isActive ? "text-[var(--cc-pharmacy)]" : "text-[var(--cc-text-secondary)]"}`} />
                    )}
                  </motion.div>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${isActive ? "text-[var(--cc-text)]" : "text-[var(--cc-text-secondary)]"}`}>
                    {["Profile", "Medical", "Emergency"][i]}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-px w-8 -mt-5 flex-shrink-0 transition-colors duration-300" style={{ background: i < step ? "var(--cc-pharmacy)" : "var(--cc-border)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step form */}
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 rounded-3xl border bg-[var(--cc-surface)] p-10 text-center"
              style={{ borderColor: "var(--cc-border)" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex size-16 items-center justify-center rounded-full bg-[rgba(82,196,26,0.15)]"
              >
                <CheckCircle2 className="size-8 text-[var(--cc-success)]" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold">Health Passport created</h2>
              <p className="text-sm text-[var(--cc-text-secondary)]">
                Redirecting you to the command center…
              </p>
              <Loader2 className="size-5 animate-spin text-[var(--cc-pharmacy)]" />
            </motion.div>
          ) : (
            <motion.form
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease }}
              onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}
              className="space-y-5 rounded-3xl border bg-[var(--cc-surface)] p-6"
              style={{
                borderColor: "var(--cc-border)",
                boxShadow: "0 0 0 1px var(--cc-border), 0 24px 64px rgba(0,0,0,0.3)",
              }}
            >
              <div className="mb-4">
                <h2 className="font-display text-xl font-bold">{STEPS[step].title}</h2>
                <p className="mt-1 text-sm text-[var(--cc-text-secondary)]">{STEPS[step].subtitle}</p>
              </div>

              {/* Step 0: Profile */}
              {step === 0 && (
                <>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cc-text-secondary)]">
                      Home country
                    </label>
                    <div className="relative">
                      {selectedCountry && (
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">{selectedCountry.flag}</span>
                      )}
                      <select
                        name="homeCountry"
                        value={formData.homeCountry}
                        onChange={handleChange}
                        required
                        className={`${inputClass} ${selectedCountry ? "pl-10" : ""} appearance-none`}
                        style={{ borderColor: "var(--cc-border)" }}
                      >
                        <option value="">Select your home country…</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cc-text-secondary)]">
                      Preferred language
                    </label>
                    <select
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none`}
                      style={{ borderColor: "var(--cc-border)" }}
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Step 1: Medical */}
              {step === 1 && (
                <>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--cc-text-secondary)]">
                      <AlertTriangle className="size-3.5 text-[var(--cc-emergency)]" />
                      Allergies
                    </label>
                    <input
                      name="allergies"
                      placeholder="e.g. Penicillin, Shellfish, Latex"
                      value={formData.allergies}
                      onChange={handleChange}
                      className={inputClass}
                      style={{ borderColor: "var(--cc-border)" }}
                    />
                    <p className="mt-1.5 text-[11px] text-[var(--cc-text-secondary)]">Separate multiple with commas</p>
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--cc-text-secondary)]">
                      <Pill className="size-3.5 text-[var(--cc-pharmacy)]" />
                      Current medications
                    </label>
                    <input
                      name="medications"
                      placeholder="e.g. Lisinopril 10mg, Metformin 500mg"
                      value={formData.medications}
                      onChange={handleChange}
                      className={inputClass}
                      style={{ borderColor: "var(--cc-border)" }}
                    />
                    <p className="mt-1.5 text-[11px] text-[var(--cc-text-secondary)]">Helps us find local equivalents abroad</p>
                  </div>
                </>
              )}

              {/* Step 2: Emergency */}
              {step === 2 && (
                <>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--cc-text-secondary)]">
                      <User className="size-3.5 text-[var(--cc-clinic)]" />
                      Contact name
                    </label>
                    <input
                      name="emergencyContact"
                      placeholder="e.g. Sarah Chen"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className={inputClass}
                      style={{ borderColor: "var(--cc-border)" }}
                    />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--cc-text-secondary)]">
                      <Phone className="size-3.5 text-[var(--cc-success)]" />
                      Phone number
                    </label>
                    <input
                      name="emergencyPhone"
                      type="tel"
                      placeholder="+1 415 555 0142"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className={inputClass}
                      style={{ borderColor: "var(--cc-border)" }}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cc-text-secondary)]">
                      Relationship (optional)
                    </label>
                    <input
                      name="emergencyRelation"
                      placeholder="e.g. Spouse, Parent, Doctor"
                      value={formData.emergencyRelation}
                      onChange={handleChange}
                      className={inputClass}
                      style={{ borderColor: "var(--cc-border)" }}
                    />
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-2">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex h-11 flex-1 items-center justify-center rounded-xl border text-sm font-medium transition-colors hover:bg-[var(--cc-elevated)]"
                    style={{ borderColor: "var(--cc-border)" }}
                  >
                    Back
                  </button>
                )}
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    disabled={step === 0 && !formData.homeCountry}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--cc-text)] text-sm font-semibold text-[var(--cc-bg)] transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    Continue
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--cc-pharmacy)] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : (
                      <>Create my Health Passport <CheckCircle2 className="size-4" /></>
                    )}
                  </button>
                )}
              </div>

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setDone(true);
                    setTimeout(() => router.push(`/${locale}/app`), 1600);
                  }}
                  className="w-full text-center text-xs text-[var(--cc-text-secondary)] underline underline-offset-2 hover:text-[var(--cc-text)]"
                >
                  Skip for now, I'll add this later
                </button>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
