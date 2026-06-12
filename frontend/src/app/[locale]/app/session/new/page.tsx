"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, MapPin, Sparkles, ArrowRight, ArrowLeft, HeartPulse, CheckCircle2 } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { COMMON_SYMPTOMS } from "@/lib/constants";
import { useSessionStore } from "@/stores/sessionStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function NewSessionPage() {
  const t = useTranslations('session');
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    location,
    countryCode,
    lat,
    lng,
    symptoms,
    allergies,
    currentMeds,
    duration,
    setLocation,
    setCoordinates,
    toggleSymptom,
    setSymptoms,
    toggleAllergy,
    setAllergies,
    addCurrentMed,
    removeCurrentMed,
    setDuration,
    setSessionId,
  } = useSessionStore();

  async function detectLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not available in this browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates(position.coords.latitude, position.coords.longitude);
        if (!location) {
          setLocation("Current location", countryCode);
        }
        setLoading(false);
      },
      () => {
        setError("Unable to detect location. Enter it manually.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleAnalyze() {
    if (symptoms.length === 0) {
      setError("Select at least one symptom.");
      return;
    }

    if (lat == null || lng == null) {
      setError("Location is required. Detect or confirm your coordinates.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const session = await api.createSession({
        symptoms,
        allergies,
        currentMeds,
        duration: duration || undefined,
        location: location || "Current location",
        countryCode,
        includedPassport: false,
        includedDocuments: [],
        lat,
        lng,
      });

      setSessionId(session.id);
      router.push(`/${locale}/app/session/${session.id}/consent`);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-4">
      {/* Header and Step Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="size-5 text-[var(--cc-emergency)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--cc-text-secondary)]">
              Case Setup
            </span>
          </div>
          <span className="text-xs font-mono text-[var(--cc-text-secondary)]">
            Step {step + 1} of 4
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--cc-elevated)]">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--cc-pharmacy)] to-[var(--cc-clinic)]"
            initial={{ width: "25%" }}
            animate={{ width: `${(step + 1) * 25}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && (
            <div className="cc-panel space-y-6 cc-glow">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--cc-text)]">Where are you located?</h2>
                <p className="mt-1.5 text-xs text-[var(--cc-text-secondary)]">
                  We use coordinates to fetch nearby open pharmacies, clinics, and emergency routes.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--cc-text-secondary)]">Current City/Region</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value, countryCode)}
                    placeholder="e.g. Shibuya, Tokyo"
                    className="w-full h-11 rounded-lg border border-[var(--cc-border)] bg-[var(--cc-elevated)] px-3 text-sm outline-none focus:border-[var(--cc-pharmacy)] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--cc-text-secondary)]">Country Code (2 Letters)</label>
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setLocation(location, e.target.value.toUpperCase())}
                    placeholder="e.g. JP"
                    maxLength={2}
                    className="w-full h-11 rounded-lg border border-[var(--cc-border)] bg-[var(--cc-elevated)] px-3 text-sm outline-none focus:border-[var(--cc-pharmacy)] transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--cc-text-secondary)]">Coordinates (Auto-filled or manual)</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Latitude"
                      value={lat ?? ""}
                      onChange={(e) => setCoordinates(parseFloat(e.target.value) || 0, lng || 0)}
                      className="flex-1 h-11 rounded-lg border border-[var(--cc-border)] bg-[var(--cc-elevated)] px-3 text-sm outline-none focus:border-[var(--cc-pharmacy)] transition-colors font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Longitude"
                      value={lng ?? ""}
                      onChange={(e) => setCoordinates(lat || 0, parseFloat(e.target.value) || 0)}
                      className="flex-1 h-11 rounded-lg border border-[var(--cc-border)] bg-[var(--cc-elevated)] px-3 text-sm outline-none focus:border-[var(--cc-pharmacy)] transition-colors font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={loading}
                  className="flex w-full h-11 items-center justify-center gap-2 rounded-lg border border-[var(--cc-border)] bg-[var(--cc-elevated)] px-4 text-xs font-semibold text-[var(--cc-text)] transition-colors hover:bg-[var(--cc-surface)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Detecting Geolocation...
                    </>
                  ) : (
                    <>
                      <MapPin className="size-4 text-[var(--cc-pharmacy)]" />
                      Auto-detect Location
                    </>
                  )}
                </button>
              </div>

              {error && <p className="text-xs font-medium text-[var(--cc-emergency)]">{error}</p>}

              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={!location || lat == null || lng == null}
                className="flex w-full h-11 items-center justify-center gap-2 rounded-lg bg-[var(--cc-text)] text-[var(--cc-bg)] text-xs font-semibold tracking-wide transition-opacity hover:opacity-95 disabled:opacity-50"
              >
                Continue
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="cc-panel space-y-6 cc-glow">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--cc-text)]">Describe symptoms</h2>
                <p className="mt-1.5 text-xs text-[var(--cc-text-secondary)]">
                  Enter symptoms manually or choose common tokens below to populate the narrative.
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  placeholder="e.g. Diarrhea, stomach cramping, fever since yesterday..."
                  value={symptoms.join(", ")}
                  onChange={(e) => {
                    const syms = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s);
                    setSymptoms(syms);
                  }}
                  className="w-full min-h-[100px] rounded-lg border border-[var(--cc-border)] bg-[var(--cc-elevated)] p-3.5 text-sm outline-none focus:border-[var(--cc-pharmacy)] transition-colors resize-none"
                />

                <div className="space-y-2">
                  <span className="text-xs font-medium text-[var(--cc-text-secondary)]">Common Symptoms</span>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_SYMPTOMS.map((symptom) => {
                      const isSelected = symptoms.includes(symptom);
                      return (
                        <button
                          type="button"
                          key={symptom}
                          onClick={() => toggleSymptom(symptom)}
                          className={cn(
                            "rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all duration-200",
                            isSelected
                              ? "bg-[var(--cc-pharmacy)] border-[var(--cc-pharmacy)] text-white"
                              : "bg-[var(--cc-elevated)] border-[var(--cc-border)] text-[var(--cc-text-secondary)] hover:border-[rgba(255,255,255,0.15)] hover:text-[var(--cc-text)]"
                          )}
                        >
                          {symptom}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex flex-1 h-11 items-center justify-center gap-2 rounded-lg border border-[var(--cc-border)] px-4 text-xs font-semibold text-[var(--cc-text)] transition-colors hover:bg-[var(--cc-elevated)]"
                >
                  <ArrowLeft className="size-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={symptoms.length === 0}
                  className="flex flex-1 h-11 items-center justify-center gap-2 rounded-lg bg-[var(--cc-text)] text-[var(--cc-bg)] text-xs font-semibold tracking-wide transition-opacity hover:opacity-95 disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="cc-panel space-y-6 cc-glow">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--cc-text)]">Allergies & Medical Context</h2>
                <p className="mt-1.5 text-xs text-[var(--cc-text-secondary)]">
                  List any active substance allergies to filter out safe OTC medication options.
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  placeholder="e.g. Penicillin, sulfa drugs, aspirin (leave blank if none)"
                  value={allergies.join(", ")}
                  onChange={(e) => {
                    const selected = e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter((item) => item);
                    setAllergies(selected);
                  }}
                  className="w-full min-h-[100px] rounded-lg border border-[var(--cc-border)] bg-[var(--cc-elevated)] p-3.5 text-sm outline-none focus:border-[var(--cc-pharmacy)] transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex flex-1 h-11 items-center justify-center gap-2 rounded-lg border border-[var(--cc-border)] px-4 text-xs font-semibold text-[var(--cc-text)] transition-colors hover:bg-[var(--cc-elevated)]"
                >
                  <ArrowLeft className="size-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex flex-1 h-11 items-center justify-center gap-2 rounded-lg bg-[var(--cc-text)] text-[var(--cc-bg)] text-xs font-semibold tracking-wide transition-opacity hover:opacity-95"
                >
                  Continue
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="cc-panel space-y-6 cc-glow">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--cc-text)]">Review Session Setup</h2>
                <p className="mt-1.5 text-xs text-[var(--cc-text-secondary)]">
                  Double check details before running the severity analyzer and global mapping engine.
                </p>
              </div>

              <div className="space-y-4 rounded-xl border border-[var(--cc-border)] bg-[var(--cc-elevated)] p-4 text-xs space-y-3 font-mono">
                <div className="flex justify-between py-1 border-b border-[var(--cc-border)]">
                  <span className="text-[var(--cc-text-secondary)]">LOCATION:</span>
                  <span className="text-[var(--cc-text)] font-semibold">{location || "Current position"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--cc-border)]">
                  <span className="text-[var(--cc-text-secondary)]">COORDINATES:</span>
                  <span className="text-[var(--cc-text)]">{lat?.toFixed(4)}, {lng?.toFixed(4)}</span>
                </div>
                <div className="flex flex-col py-1 border-b border-[var(--cc-border)] gap-1">
                  <span className="text-[var(--cc-text-secondary)] font-semibold">SYMPTOMS:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {symptoms.map(s => (
                      <span key={s} className="bg-[var(--cc-surface)] px-2 py-0.5 rounded text-[10px] border border-[var(--cc-border)]">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--cc-text-secondary)]">ALLERGIES:</span>
                  <span className="text-[var(--cc-text)]">{allergies.length > 0 ? allergies.join(", ") : "None declared"}</span>
                </div>
              </div>

              {error && <p className="text-xs font-medium text-[var(--cc-emergency)]">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex flex-1 h-11 items-center justify-center gap-2 rounded-lg border border-[var(--cc-border)] px-4 text-xs font-semibold text-[var(--cc-text)] transition-colors hover:bg-[var(--cc-elevated)]"
                >
                  <ArrowLeft className="size-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex flex-1 h-11 items-center justify-center gap-2 rounded-lg bg-[var(--cc-text)] text-[var(--cc-bg)] text-xs font-bold tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 text-[var(--cc-pharmacy)]" />
                      Compute Path
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
