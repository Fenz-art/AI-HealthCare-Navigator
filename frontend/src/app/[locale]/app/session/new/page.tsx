"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, MapPin, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { COMMON_SYMPTOMS } from "@/lib/constants";
import { useSessionStore } from "@/stores/sessionStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { osVariants, linearSpring } from "@/lib/motion";

/**
 * NATURAL SPRINT — New Session wizard
 * 4-step linear flow. Surface ladder. Lavender-blue progress & accents.
 * No rounded-3xl, no backdrop-blur, no drop-shadows.
 */
export default function NewSessionPage() {
  const t = useTranslations("session");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    location, countryCode, lat, lng, symptoms, allergies,
    setLocation, setCoordinates, toggleSymptom, setSymptoms, setAllergies,
    setSessionId,
  } = useSessionStore();

  async function detectLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not available in this browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates(pos.coords.latitude, pos.coords.longitude);
        if (!location) setLocation("Current location", countryCode);
        setLoading(false);
      },
      () => { setError("Unable to detect location. Enter manually."); setLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleAnalyze() {
    if (symptoms.length === 0) { setError("Select at least one symptom."); return; }
    if (lat == null || lng == null) { setError("Location required."); return; }
    setError(null);
    setLoading(true);
    try {
      const session = await api.createSession({
        symptoms, allergies, currentMeds: [],
        location: location || "Current location",
        countryCode, includedPassport: false,
        includedDocuments: [], lat, lng,
      });
      setSessionId(session.id);
      router.push(`/${locale}/app/session/${session.id}/consent`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Shared input style
  const inputCls = "w-full h-10 rounded px-3 text-[13px] outline-none transition-colors duration-150";
  const inputStyle = {
    background: "var(--surface-3)",
    border: "1px solid var(--hairline)",
    color: "var(--ink)",
  };
  const inputFocusCls = "focus:ring-1 focus:ring-[var(--lavender)]";

  const STEPS = ["Location", "Symptoms", "Context", "Review"];

  return (
    <div className="mx-auto max-w-xl space-y-6 py-2">
      {/* Progress header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
            Case Setup
          </p>
          <p className="font-mono text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
            {step + 1} / {STEPS.length}
          </p>
        </div>

        {/* Step dots + line */}
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center">
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors duration-200"
                style={{
                  background: i <= step ? "var(--lavender)" : "var(--surface-3)",
                  color: i <= step ? "var(--inverse-ink)" : "var(--ink-tertiary)",
                  border: `1px solid ${i <= step ? "var(--lavender)" : "var(--hairline)"}`,
                }}
              >
                {i < step ? <CheckCircle2 className="size-3" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="h-px flex-1 transition-colors duration-300"
                  style={{ background: i < step ? "var(--lavender)" : "var(--hairline)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={osVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ── Step 0: Location ── */}
          {step === 0 && (
            <div className="lifted-panel rounded-md p-6 space-y-5" style={{ background: "var(--surface-1)" }}>
              <div>
                <h2 className="text-[18px] font-semibold tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.3px" }}>
                  Where are you?
                </h2>
                <p className="mt-1 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
                  Used to find nearby care providers and medication stock.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium" style={{ color: "var(--ink-tertiary)" }}>City / Region</label>
                  <input
                    type="text" value={location}
                    onChange={(e) => setLocation(e.target.value, countryCode)}
                    placeholder="e.g. Shibuya, Tokyo"
                    className={cn(inputCls, inputFocusCls)}
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium" style={{ color: "var(--ink-tertiary)" }}>Country Code</label>
                  <input
                    type="text" value={countryCode} maxLength={2}
                    onChange={(e) => setLocation(location, e.target.value.toUpperCase())}
                    placeholder="JP"
                    className={cn(inputCls, inputFocusCls, "font-mono w-24")}
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium" style={{ color: "var(--ink-tertiary)" }}>Coordinates</label>
                  <div className="flex gap-2">
                    <input
                      type="number" placeholder="Latitude" value={lat ?? ""}
                      onChange={(e) => setCoordinates(parseFloat(e.target.value) || 0, lng || 0)}
                      className={cn(inputCls, inputFocusCls, "font-mono flex-1")}
                      style={inputStyle}
                    />
                    <input
                      type="number" placeholder="Longitude" value={lng ?? ""}
                      onChange={(e) => setCoordinates(lat || 0, parseFloat(e.target.value) || 0)}
                      className={cn(inputCls, inputFocusCls, "font-mono flex-1")}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <button
                  type="button" onClick={detectLocation} disabled={loading}
                  className="btn-secondary w-full gap-2"
                >
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : <MapPin className="size-3.5" style={{ color: "var(--lavender)" }} />}
                  {loading ? "Detecting…" : "Auto-detect Location"}
                </button>
              </div>

              {error && <p className="text-[12px]" style={{ color: "var(--semantic-red)" }}>{error}</p>}

              <button
                type="button" onClick={() => setStep(1)}
                disabled={!location || lat == null || lng == null}
                className="btn-primary w-full gap-2"
              >
                Continue <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}

          {/* ── Step 1: Symptoms ── */}
          {step === 1 && (
            <div className="lifted-panel rounded-md p-6 space-y-5" style={{ background: "var(--surface-1)" }}>
              <div>
                <h2 className="text-[18px] font-semibold tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.3px" }}>
                  Describe symptoms
                </h2>
                <p className="mt-1 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
                  Type or tap common tokens to build the clinical narrative.
                </p>
              </div>

              <textarea
                placeholder="e.g. Diarrhea, stomach cramping, fever since yesterday…"
                value={symptoms.join(", ")}
                onChange={(e) => {
                  const s = e.target.value.split(",").map(x => x.trim()).filter(Boolean);
                  setSymptoms(s);
                }}
                rows={3}
                className={cn(inputFocusCls, "w-full rounded px-3 py-2.5 text-[13px] outline-none resize-none")}
                style={{ ...inputStyle, height: "auto" }}
              />

              <div className="space-y-2">
                <p className="text-[11px] font-medium" style={{ color: "var(--ink-tertiary)" }}>Common symptoms</p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SYMPTOMS.map((s) => {
                    const active = symptoms.includes(s);
                    return (
                      <button
                        key={s} type="button" onClick={() => toggleSymptom(s)}
                        className="rounded px-2.5 py-1 text-[12px] font-medium transition-colors duration-100"
                        style={{
                          background: active ? "var(--lavender)" : "var(--surface-3)",
                          color: active ? "var(--inverse-ink)" : "var(--ink-subtle)",
                          border: `1px solid ${active ? "var(--lavender)" : "var(--hairline)"}`,
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(0)} className="btn-secondary flex-1 gap-1.5">
                  <ArrowLeft className="size-3.5" /> Back
                </button>
                <button type="button" onClick={() => setStep(2)} disabled={symptoms.length === 0} className="btn-primary flex-1 gap-1.5">
                  Continue <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Context ── */}
          {step === 2 && (
            <div className="lifted-panel rounded-md p-6 space-y-5" style={{ background: "var(--surface-1)" }}>
              <div>
                <h2 className="text-[18px] font-semibold tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.3px" }}>
                  Allergies & context
                </h2>
                <p className="mt-1 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
                  Filters safe OTC options. Leave blank if none.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium" style={{ color: "var(--ink-tertiary)" }}>Allergies</label>
                <textarea
                  placeholder="e.g. Penicillin, aspirin…"
                  value={allergies.join(", ")}
                  onChange={(e) => {
                    const a = e.target.value.split(",").map(x => x.trim()).filter(Boolean);
                    useSessionStore.getState().setAllergies(a);
                  }}
                  rows={3}
                  className={cn(inputFocusCls, "w-full rounded px-3 py-2.5 text-[13px] outline-none resize-none")}
                  style={{ ...inputStyle, height: "auto" }}
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 gap-1.5">
                  <ArrowLeft className="size-3.5" /> Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1 gap-1.5">
                  Continue <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Review ── */}
          {step === 3 && (
            <div className="lifted-panel rounded-md p-6 space-y-5" style={{ background: "var(--surface-1)" }}>
              <div>
                <h2 className="text-[18px] font-semibold tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.3px" }}>
                  Review session
                </h2>
                <p className="mt-1 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
                  Confirm before running the severity engine and navigation graph.
                </p>
              </div>

              {/* Data manifest */}
              <div
                className="rounded font-mono text-[12px] divide-y"
                style={{ background: "var(--surface-3)", border: "1px solid var(--hairline)" }}
              >
                {[
                  { key: "LOCATION", val: location || "Current position" },
                  { key: "COORDS", val: lat != null ? `${lat.toFixed(4)}, ${lng?.toFixed(4)}` : "—" },
                  { key: "COUNTRY", val: countryCode || "—" },
                ].map((row) => (
                  <div key={row.key} className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--hairline)" }}>
                    <span style={{ color: "var(--ink-tertiary)" }}>{row.key}</span>
                    <span style={{ color: "var(--ink-muted)" }}>{row.val}</span>
                  </div>
                ))}
                <div className="px-3 py-2">
                  <span style={{ color: "var(--ink-tertiary)" }}>SYMPTOMS</span>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {symptoms.map((s) => (
                      <span key={s} className="rounded px-1.5 py-0.5 text-[11px]"
                        style={{ background: "var(--surface-4)", border: "1px solid var(--hairline)", color: "var(--ink-muted)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                {allergies.length > 0 && (
                  <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: "1px solid var(--hairline)" }}>
                    <span style={{ color: "var(--ink-tertiary)" }}>ALLERGIES</span>
                    <span style={{ color: "var(--ink-muted)" }}>{allergies.join(", ")}</span>
                  </div>
                )}
              </div>

              {error && <p className="text-[12px]" style={{ color: "var(--semantic-red)" }}>{error}</p>}

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 gap-1.5">
                  <ArrowLeft className="size-3.5" /> Back
                </button>
                <button type="button" onClick={handleAnalyze} disabled={loading} className="btn-primary flex-1 gap-1.5">
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : null}
                  {loading ? "Analyzing…" : "Compute Path"}
                  {!loading && <ArrowRight className="size-3.5" />}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
