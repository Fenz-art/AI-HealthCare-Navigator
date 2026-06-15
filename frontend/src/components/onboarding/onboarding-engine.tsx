"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Globe,
  Loader2,
  Mic,
  Pill,
  Plus,
  Shield,
  Upload,
  User,
  X,
  MapPin,
  Heart,
  AlertTriangle,
  FileText,
  Languages,
  Phone,
  Sparkles,
} from "lucide-react";
import { OnboardingShell } from "./onboarding-shell";
import { OnboardingPreview } from "./onboarding-preview";
import { HealthPassportPreview } from "./health-passport-preview";
import { ActivationScreen } from "./activation-screen";
import { RoleSelection } from "./role-selection";
import { PharmacistIdentityStep, PharmacyDetailsStep, PharmacistLicenseStep } from "./steps/pharmacist-steps";
import { DoctorIdentityStep, DoctorSpecialtyStep } from "./steps/doctor-steps";
import { AssistantIdentityStep, AssistantOrganizationStep } from "./steps/assistant-steps";
import { StepLayout, NavRow } from "./steps/shared";
import {
  type TravelerType,
  getRoleSteps,
  useOnboardingStore,
} from "@/stores/onboarding-store";
import { cn } from "@/lib/utils";
import { useVaultStore } from "@/stores/vault-store";

const TRAVELER_TYPES: { id: TravelerType; label: string; desc: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
  { id: "solo", label: "Solo Traveler", desc: "Independent trips, flexible destinations", icon: User },
  { id: "family", label: "Family Traveler", desc: "Traveling with children or dependents", icon: Heart },
  { id: "nomad", label: "Digital Nomad", desc: "Extended stays across multiple countries", icon: Globe },
  { id: "business", label: "Business Traveler", desc: "Regular work trips abroad", icon: Briefcase },
  { id: "student", label: "Student", desc: "Study abroad or exchange programs", icon: FileText },
  { id: "senior", label: "Senior Traveler", desc: "Retirement travel with health considerations", icon: Heart },
];

const COUNTRIES = [
  { code: "IN", name: "India" }, { code: "US", name: "United States" },
  { code: "JP", name: "Japan" }, { code: "TH", name: "Thailand" },
  { code: "DE", name: "Germany" }, { code: "SG", name: "Singapore" },
  { code: "GB", name: "United Kingdom" }, { code: "FR", name: "France" },
  { code: "ES", name: "Spain" }, { code: "BR", name: "Brazil" },
  { code: "AU", name: "Australia" }, { code: "CA", name: "Canada" },
  { code: "AE", name: "UAE" }, { code: "KR", name: "South Korea" },
  { code: "IT", name: "Italy" },
];

const ALLERGY_PRESETS = ["Penicillin", "Peanuts", "Shellfish", "Latex", "Sulfa", "Ibuprofen", "None"];
const LANGUAGES = [
  { code: "en", name: "English" }, { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" }, { code: "de", name: "German" },
  { code: "es", name: "Spanish" }, { code: "fr", name: "French" },
  { code: "zh", name: "Chinese" }, { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" }, { code: "ko", name: "Korean" },
  { code: "th", name: "Thai" }, { code: "vi", name: "Vietnamese" },
];

const MEDICATION_SUGGESTIONS = ["Metformin", "Lisinopril", "Atorvastatin", "Levothyroxine", "Omeprazole", "Amoxicillin", "Losartan", "Albuterol", "Aspirin", "Ibuprofen"];
const ILLNESS_PRESETS = ["Diabetes", "Hypertension", "Heart Disease", "Cancer", "Epilepsy", "Tuberculosis", "Asthma", "None"];

export function OnboardingEngine() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const { data: session, update } = useSession();
  const { step, setStep, data, updateData } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [medSearch, setMedSearch] = useState("");
  const [nameInput, setNameInput] = useState(data.identity.name);
  const [animDir, setAnimDir] = useState<1 | -1>(1);
  const [illnessSearch, setIllnessSearch] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");

  const steps = getRoleSteps(data.role);
  const maxStep = Math.max(...steps);

  const next = () => { setAnimDir(1); setStep(step + 1); };
  const back = () => { setAnimDir(-1); setStep(Math.max(0, step - 1)); };

  const finish = async () => {
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        role: data.role,
        name: data.identity.name,
        homeCountry: data.homeCountry,
        preferredLanguage: data.identity.language,
        onboardingComplete: true,
      };

      if (data.role === "PATIENT") {
        body.allergies = data.allergies.filter((a) => a !== "None");
        body.medications = data.medications.map((m) => `${m.name} ${m.dosage}`);
        body.emergencyContacts = data.emergencyContacts;
        body.bloodGroup = data.bloodGroup;
        useVaultStore.getState().populateFromOnboarding({
          hasInsurance: data.hasInsurance === "yes",
          insuranceUploaded: data.insuranceUploaded,
          medications: data.medications,
          allergies: data.allergies,
          conditions: data.conditions,
          medicalHistoryUploaded: data.medicalHistoryUploaded,
          bloodGroup: data.bloodGroup,
        });
      }

      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await update({ role: data.role, onboardingComplete: true });
      }
    } catch {
      /* proceed in demo mode */
    }
    setStep(maxStep);
    setLoading(false);
  };

  const filteredMeds = MEDICATION_SUGGESTIONS.filter((m) => m.toLowerCase().includes(medSearch.toLowerCase()));
  const filteredIllnesses = ILLNESS_PRESETS.filter((i) => i.toLowerCase().includes(illnessSearch.toLowerCase()));

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "var(--canvas)" }}>
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  const _session = session;

  if (step >= maxStep) {
    return (
      <ActivationScreen
        onEnter={() => router.push(`/${locale}/app`)}
        summary={{
          destinations: data.frequentDestinations.length,
          medications: data.medications.length,
          allergies: data.allergies.filter((a) => a !== "None").length,
          insurance: data.hasInsurance === "yes",
          interpreter: data.voiceInterpreterEnabled,
          conditions: data.conditions.length,
        }}
      />
    );
  }

  const pageVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, filter: "blur(4px)" }),
    center: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, filter: "blur(4px)" }),
  };

  function renderPatientStep(s: number) {
    switch (s) {
      case 1:
        return (
          <StepLayout icon={<User className="size-5" />} title="Who are you?" subtitle="This helps us personalize your healthcare operating system.">
            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Your name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
                  <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Enter your full name"
                    className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none transition-colors focus:ring-2"
                    style={{ borderColor: nameInput ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)", caretColor: "var(--lavender)" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Home country</label>
                  <select value={data.identity.country} onChange={(e) => updateData({ identity: { ...data.identity, country: e.target.value } })}
                    className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none focus:ring-2"
                    style={{ borderColor: data.identity.country ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)" }}>
                    <option value="">Select...</option>
                    {COUNTRIES.map((c) => <option key={c.code} value={c.code} className="bg-[var(--surface-1)]">{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Language</label>
                  <select value={data.identity.language} onChange={(e) => updateData({ identity: { ...data.identity, language: e.target.value } })}
                    className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none focus:ring-2"
                    style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}>
                    {LANGUAGES.map((l) => <option key={l.code} value={l.code} className="bg-[var(--surface-1)]">{l.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Date of birth</label>
                <input type="date" value={data.dateOfBirth} onChange={(e) => updateData({ dateOfBirth: e.target.value })}
                  className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none focus:ring-2"
                  style={{ borderColor: data.dateOfBirth ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)" }} />
              </div>
            </div>
            <NavRow onNext={() => { updateData({ identity: { ...data.identity, name: nameInput } }); next(); }}
              nextDisabled={!nameInput || !data.identity.country} />
          </StepLayout>
        );

      case 2:
        return (
          <StepLayout icon={<Heart className="size-5" />} title="Blood group" subtitle="Required. This appears on your passport and is critical in emergencies.">
            <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map((bg) => {
                const selected = data.bloodGroup === bg;
                return (
                  <motion.button
                    key={bg}
                    type="button"
                    onClick={() => { updateData({ bloodGroup: bg }); next(); }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center justify-center rounded-xl border py-4 text-[15px] font-semibold transition-all"
                    style={{
                      borderColor: selected ? "var(--lavender)" : "var(--hairline)",
                      background: selected ? "var(--lavender-muted)" : "var(--surface-1)",
                      color: selected ? "var(--lavender-hover)" : "var(--ink-muted)",
                    }}
                  >
                    {bg}
                  </motion.button>
                );
              })}
            </div>
            <NavRow onBack={back} onNext={() => {}} nextDisabled showNext={false} />
          </StepLayout>
        );

      case 3:
        return (
          <StepLayout icon={<User className="size-5" />} title="How do you travel?" subtitle="Select your traveler profile — this shapes how we prepare your healthcare OS.">
            <div className="mt-6 grid gap-2.5">
              {TRAVELER_TYPES.map((t) => {
                const Icon = t.icon;
                const selected = data.travelerType === t.id;
                return (
                  <motion.button key={t.id} type="button" onClick={() => { updateData({ travelerType: t.id }); next(); }}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className={cn("group flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200", selected && "border-[var(--lavender)] bg-[var(--lavender-muted)]")}
                    style={{ borderColor: selected ? "var(--lavender)" : "var(--hairline)", background: selected ? "var(--lavender-muted)" : "var(--surface-1)" }}>
                    <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors", selected ? "bg-[var(--lavender)] text-[var(--inverse-ink)]" : "bg-[var(--surface-2)] text-[var(--ink-subtle)]")}>
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold" style={{ color: selected ? "var(--lavender-hover)" : "var(--ink)" }}>{t.label}</p>
                      <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-subtle)" }}>{t.desc}</p>
                    </div>
                    <ArrowRight className="size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" style={{ color: "var(--ink-tertiary)" }} />
                  </motion.button>
                );
              })}
            </div>
            <NavRow onBack={back} onNext={() => {}} nextDisabled showNext={false} />
          </StepLayout>
        );

      case 4:
        return (
          <StepLayout icon={<Globe className="size-5" />} title="Where do you travel?" subtitle="Select your home country and destinations you frequently visit.">
            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2.5 block text-[12px] font-medium tracking-wide" style={{ color: "var(--ink-subtle)" }}>HOME COUNTRY</label>
                <select value={data.homeCountry} onChange={(e) => updateData({ homeCountry: e.target.value })}
                  className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none focus:ring-2"
                  style={{ borderColor: data.homeCountry ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)" }}>
                  <option value="">Select your home country...</option>
                  {COUNTRIES.map((c) => <option key={c.code} value={c.code} className="bg-[var(--surface-1)]">{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2.5 block text-[12px] font-medium tracking-wide" style={{ color: "var(--ink-subtle)" }}>FREQUENT DESTINATIONS</label>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.filter((c) => c.code !== data.homeCountry).map((c) => {
                    const selected = data.frequentDestinations.includes(c.code);
                    return (
                      <motion.button key={c.code} type="button"
                        onClick={() => updateData({ frequentDestinations: selected ? data.frequentDestinations.filter((d) => d !== c.code) : [...data.frequentDestinations, c.code] })}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className={cn("rounded-lg border px-3.5 py-2 text-[13px] transition-all duration-150", selected && "border-[var(--lavender)]")}
                        style={{ borderColor: selected ? "var(--lavender)" : "var(--hairline)", background: selected ? "var(--lavender-muted)" : "var(--surface-2)", color: selected ? "var(--lavender-hover)" : "var(--ink-muted)" }}>
                        {c.name}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="mb-2.5 block text-[12px] font-medium tracking-wide" style={{ color: "var(--ink-subtle)" }}>UPCOMING DESTINATION (optional)</label>
                <select value={data.upcomingDestination} onChange={(e) => updateData({ upcomingDestination: e.target.value })}
                  className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none"
                  style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}>
                  <option value="">Not sure yet...</option>
                  {COUNTRIES.map((c) => <option key={c.code} value={c.code} className="bg-[var(--surface-1)]">{c.name}</option>)}
                </select>
              </div>
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={!data.homeCountry} />
          </StepLayout>
        );

      case 5:
        return (
          <StepLayout icon={<Shield className="size-5" />} title="Health insurance" subtitle="Do you have travel health insurance?">
            <div className="mt-6 grid grid-cols-3 gap-3">
              {(["yes", "no", "skip"] as const).map((opt) => {
                const selected = data.hasInsurance === opt;
                return (
                  <motion.button key={opt} type="button"
                    onClick={() => { updateData({ hasInsurance: opt }); if (opt !== "yes") next(); }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className={cn("flex flex-col items-center gap-2 rounded-xl border py-5 transition-all duration-200", selected && "border-[var(--lavender)] bg-[var(--lavender-muted)]")}
                    style={{ borderColor: selected ? "var(--lavender)" : "var(--hairline)", background: selected ? "var(--lavender-muted)" : "var(--surface-1)" }}>
                    <div className={cn("flex size-10 items-center justify-center rounded-full", selected ? "bg-[var(--lavender)]" : "bg-[var(--surface-2)]")}>
                      <Shield className="size-5" style={{ color: selected ? "var(--inverse-ink)" : "var(--ink-tertiary)" }} />
                    </div>
                    <span className="text-[13px] font-medium capitalize" style={{ color: selected ? "var(--lavender-hover)" : "var(--ink)" }}>{opt === "skip" ? "Skip" : opt}</span>
                  </motion.button>
                );
              })}
            </div>
            {data.hasInsurance === "yes" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
                <div className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-5 transition-colors hover:border-[var(--lavender)]"
                  style={{ borderColor: data.insuranceUploaded ? "var(--lavender)" : "var(--hairline-strong)", background: "var(--surface-2)" }}>
                  <div className="flex size-12 items-center justify-center rounded-lg" style={{ background: "var(--lavender-muted)" }}>
                    <Upload className="size-5" style={{ color: "var(--lavender)" }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{data.insuranceUploaded ? "Insurance card uploaded" : "Upload insurance card"}</p>
                    <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>{data.insuranceUploaded ? data.insuranceProvider : "PDF or image — we extract the details"}</p>
                  </div>
                  {data.insuranceUploaded && <CheckCircle2 className="ml-auto size-5" style={{ color: "var(--semantic-success)" }} />}
                </div>
                <div className="flex gap-3">
                  <motion.button type="button" onClick={() => { updateData({ insuranceUploaded: true, insuranceProvider: "Demo Insurance Co." }); next(); }}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-lg border py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ borderColor: "var(--hairline)", color: "var(--ink-tertiary)" }}>Skip for now</motion.button>
                  <motion.button type="button" onClick={next} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="btn-primary flex-1">Continue</motion.button>
                </div>
              </motion.div>
            )}
            {data.hasInsurance && data.hasInsurance !== "yes" && <NavRow onBack={back} onNext={next} />}
          </StepLayout>
        );

      case 6:
        return (
          <StepLayout icon={<Pill className="size-5" />} title="Current medications" subtitle="Required. We identify local equivalents while traveling.">
            <div className="mt-6">
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
                <input value={medSearch} onChange={(e) => setMedSearch(e.target.value)} placeholder="Search medication name..."
                  className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none transition-colors focus:ring-2"
                  style={{ borderColor: medSearch ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)", caretColor: "var(--lavender)" }} />
              </div>
              <AnimatePresence>
                {medSearch && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="mt-2 overflow-hidden rounded-lg border" style={{ borderColor: "var(--hairline)", background: "var(--surface-2)" }}>
                    {filteredMeds.map((m) => (
                      <button key={m} type="button"
                        onClick={() => { updateData({ medications: [...data.medications, { name: m, dosage: "Standard", frequency: "As prescribed" }] }); setMedSearch(""); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-[var(--surface-3)]" style={{ color: "var(--ink-muted)" }}>
                        <Plus className="size-3.5 shrink-0" style={{ color: "var(--lavender)" }} />{m}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {data.medications.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-1.5">
                  <p className="text-[11px] font-medium tracking-wide" style={{ color: "var(--ink-tertiary)" }}>ADDED MEDICATIONS ({data.medications.length})</p>
                  {data.medications.map((med, i) => (
                    <motion.div key={med.name + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between rounded-lg border px-4 py-2.5" style={{ borderColor: "var(--hairline)" }}>
                      <div className="flex items-center gap-3">
                        <Pill className="size-3.5" style={{ color: "var(--lavender)" }} />
                        <span className="text-[13px]" style={{ color: "var(--ink)" }}>{med.name}</span>
                        <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>{med.dosage}</span>
                      </div>
                      <button type="button" onClick={() => updateData({ medications: data.medications.filter((_, j) => j !== i) })}
                        className="flex size-6 items-center justify-center rounded transition-colors hover:bg-[var(--surface-3)]" style={{ color: "var(--ink-tertiary)" }}>
                        <X className="size-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={data.medications.length === 0} />
          </StepLayout>
        );

      case 7:
        return (
          <StepLayout icon={<AlertTriangle className="size-5" />} title="Known allergies" subtitle="Required. These power alerts and medication safety checks.">
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {ALLERGY_PRESETS.map((a) => {
                  const selected = data.allergies.includes(a);
                  return (
                    <motion.button key={a} type="button"
                      onClick={() => updateData({ allergies: a === "None" ? ["None"] : selected ? data.allergies.filter((x) => x !== a) : [...data.allergies.filter((x) => x !== "None"), a] })}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                      className={cn("flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] transition-all", selected && "border-[var(--lavender)]")}
                      style={{ borderColor: selected ? "var(--lavender)" : "var(--hairline)", background: selected ? "var(--lavender-muted)" : "var(--surface-1)", color: selected ? "var(--lavender-hover)" : "var(--ink-muted)" }}>
                      {selected && <CheckCircle2 className="size-3.5" />}{a}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-2">
                <input value={customAllergy} onChange={(e) => setCustomAllergy(e.target.value)} placeholder="Add custom allergy..."
                  className="h-10 flex-1 rounded-lg border bg-transparent px-3 text-[13px] outline-none focus:ring-2"
                  style={{ borderColor: "var(--hairline)", color: "var(--ink)", caretColor: "var(--lavender)" }}
                  onKeyDown={(e) => { if (e.key === "Enter" && customAllergy.trim()) { updateData({ allergies: [...data.allergies.filter((a) => a !== "None"), customAllergy.trim()] }); setCustomAllergy(""); } }} />
                <motion.button type="button" onClick={() => { if (customAllergy.trim()) { updateData({ allergies: [...data.allergies.filter((a) => a !== "None"), customAllergy.trim()] }); setCustomAllergy(""); } }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={!customAllergy.trim()}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg disabled:opacity-30" style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
                  <Plus className="size-4" />
                </motion.button>
              </div>
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={data.allergies.length === 0} />
          </StepLayout>
        );

      case 8:
        return (
          <StepLayout icon={<AlertTriangle className="size-5" />} title="Critical medical conditions" subtitle="Required. Have you ever been diagnosed with any serious medical condition?">
            <div className="mt-6">
              <div className="relative mb-3">
                <AlertTriangle className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
                <input value={illnessSearch} onChange={(e) => setIllnessSearch(e.target.value)} placeholder="Search conditions..."
                  className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none focus:ring-2"
                  style={{ borderColor: illnessSearch ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)", caretColor: "var(--lavender)" }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredIllnesses.map((cond) => {
                  const selected = data.conditions.includes(cond);
                  return (
                    <motion.button key={cond} type="button"
                      onClick={() => updateData({ conditions: cond === "None" ? ["None"] : selected ? data.conditions.filter((x) => x !== cond) : [...data.conditions.filter((x) => x !== "None"), cond] })}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                      className={cn("flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] transition-all", selected && "border-[var(--lavender)]")}
                      style={{ borderColor: selected ? "var(--lavender)" : "var(--hairline)", background: selected ? "var(--lavender-muted)" : "var(--surface-1)", color: selected ? "var(--lavender-hover)" : "var(--ink-muted)" }}>
                      {selected && <CheckCircle2 className="size-3.5" />}{cond}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-2">
                <input placeholder="Or type a custom condition..." className="h-10 flex-1 rounded-lg border bg-transparent px-3 text-[13px] outline-none"
                  style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
                  onKeyDown={(e) => { if (e.key === "Enter" && illnessSearch.trim() && !ILLNESS_PRESETS.includes(illnessSearch.trim())) { updateData({ conditions: [...data.conditions.filter((c) => c !== "None"), illnessSearch.trim()] }); setIllnessSearch(""); } }} />
              </div>
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={data.conditions.length === 0} />
          </StepLayout>
        );

      case 9:
        return (
          <StepLayout icon={<FileText className="size-5" />} title="Medical history" subtitle="Would you like to upload historical medical records?">
            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button type="button" onClick={() => { updateData({ medicalHistoryUploaded: true }); next(); }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-3 rounded-xl border py-8 transition-colors hover:border-[var(--lavender)]" style={{ borderColor: "var(--hairline)" }}>
                <div className="flex size-12 items-center justify-center rounded-full" style={{ background: "var(--lavender-muted)" }}>
                  <Upload className="size-5" style={{ color: "var(--lavender)" }} />
                </div>
                <span className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>Upload records</span>
                <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>PDF, images, or scans</span>
              </motion.button>
              <motion.button type="button" onClick={next} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-3 rounded-xl border py-8 transition-colors" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
                <div className="flex size-12 items-center justify-center rounded-full" style={{ background: "var(--surface-2)" }}>
                  <ArrowRight className="size-5" style={{ color: "var(--ink-tertiary)" }} />
                </div>
                <span className="text-[13px] font-medium" style={{ color: "var(--ink-muted)" }}>Later</span>
                <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>Add later from Vault</span>
              </motion.button>
            </div>
            <NavRow onBack={back} onNext={next} />
          </StepLayout>
        );

      case 10:
        return (
          <StepLayout icon={<Phone className="size-5" />} title="Emergency contacts" subtitle="Required. Who should we notify if something happens while you travel?">
            <div className="mt-6 space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
                <input placeholder="Contact name" value={data.emergencyContacts[0]?.name ?? ""}
                  onChange={(e) => { const contacts = [...data.emergencyContacts]; contacts[0] = { ...contacts[0], name: e.target.value, relation: contacts[0]?.relation ?? "", phone: contacts[0]?.phone ?? "" }; updateData({ emergencyContacts: contacts }); }}
                  className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none focus:ring-2"
                  style={{ borderColor: "var(--hairline)", color: "var(--ink)" }} />
              </div>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
                <input placeholder="Relation (e.g., spouse, parent)" value={data.emergencyContacts[0]?.relation ?? ""}
                  onChange={(e) => { const contacts = [...data.emergencyContacts]; contacts[0] = { ...contacts[0], relation: e.target.value, name: contacts[0]?.name ?? "", phone: contacts[0]?.phone ?? "" }; updateData({ emergencyContacts: contacts }); }}
                  className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none focus:ring-2"
                  style={{ borderColor: "var(--hairline)", color: "var(--ink)" }} />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
                <input placeholder="Phone number with country code" value={data.emergencyContacts[0]?.phone ?? ""}
                  onChange={(e) => { const contacts = [...data.emergencyContacts]; contacts[0] = { ...contacts[0], phone: e.target.value, name: contacts[0]?.name ?? "", relation: contacts[0]?.relation ?? "" }; updateData({ emergencyContacts: contacts }); }}
                  className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none focus:ring-2"
                  style={{ borderColor: "var(--hairline)", color: "var(--ink)" }} />
              </div>
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={!data.emergencyContacts[0]?.name || !data.emergencyContacts[0]?.phone} />
          </StepLayout>
        );

      case 11:
        return (
          <StepLayout icon={<Languages className="size-5" />} title="Interpreter preferences" subtitle="Medical-grade, dual-language interpretation — configured for your needs.">
            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2.5 block text-[12px] font-medium tracking-wide" style={{ color: "var(--ink-subtle)" }}>PREFERRED LANGUAGE</label>
                <select value={data.interpreterLanguage} onChange={(e) => updateData({ interpreterLanguage: e.target.value })}
                  className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none" style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}>
                  {LANGUAGES.map((l) => <option key={l.code} value={l.code} className="bg-[var(--surface-1)]">{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-3 block text-[12px] font-medium tracking-wide" style={{ color: "var(--ink-subtle)" }}>VOICE INTERPRETER</label>
                <motion.button type="button" onClick={() => updateData({ voiceInterpreterEnabled: !data.voiceInterpreterEnabled })}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center gap-4 rounded-xl border p-4 transition-all"
                  style={{ borderColor: data.voiceInterpreterEnabled ? "var(--lavender)" : "var(--hairline)", background: data.voiceInterpreterEnabled ? "var(--lavender-muted)" : "var(--surface-1)" }}>
                  <div className={cn("flex size-12 items-center justify-center rounded-full transition-colors", data.voiceInterpreterEnabled ? "bg-[var(--lavender)]" : "bg-[var(--surface-2)]")}>
                    <Mic className="size-5" style={{ color: data.voiceInterpreterEnabled ? "var(--inverse-ink)" : "var(--ink-tertiary)" }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-medium" style={{ color: data.voiceInterpreterEnabled ? "var(--lavender-hover)" : "var(--ink)" }}>
                      {data.voiceInterpreterEnabled ? "Voice interpreter enabled" : "Enable voice interpreter"}
                    </p>
                    <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>Push-to-talk, real-time translation</p>
                  </div>
                  <div className={cn("flex size-6 items-center justify-center rounded-full border-2 transition-all", data.voiceInterpreterEnabled ? "border-[var(--lavender)] bg-[var(--lavender)]" : "border-[var(--hairline-strong)]")}>
                    {data.voiceInterpreterEnabled && <CheckCircle2 className="size-3.5" style={{ color: "var(--inverse-ink)" }} />}
                  </div>
                </motion.button>
              </div>
            </div>
            <NavRow onBack={back} onNext={next} />
          </StepLayout>
        );

      case 12:
        return (
          <StepLayout icon={<Shield className="size-5" />} title="Your Health Passport" subtitle="Review your medical identity — shareable with any provider, anywhere in the world.">
            <HealthPassportPreview name={data.identity.name || _session.user?.name || "Traveler"} data={data} />
            <motion.button type="button" onClick={finish} disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-semibold transition-all"
              style={{ background: "var(--lavender)", color: "var(--inverse-ink)", opacity: loading ? 0.7 : 1 }}>
              {loading ? <Loader2 className="size-5 animate-spin" /> : <>Activate CareCompass <Sparkles className="size-4" /></>}
            </motion.button>
            <button type="button" onClick={back} className="mt-3 w-full text-center text-[12px]" style={{ color: "var(--ink-tertiary)" }}>Back — review or edit</button>
          </StepLayout>
        );

      default:
        return null;
    }
  }

  function renderNonPatientStep(s: number) {
    switch (data.role) {
      case "PHARMACIST": {
        switch (s) {
          case 1: return <PharmacistIdentityStep onNext={next} />;
          case 2: return <PharmacyDetailsStep onNext={next} onBack={back} />;
          case 3: return <PharmacistLicenseStep onNext={next} onBack={back} />;
          default: return null;
        }
      }
      case "DOCTOR": {
        switch (s) {
          case 1: return <DoctorIdentityStep onNext={next} />;
          case 2: return <DoctorSpecialtyStep onNext={next} onBack={back} />;
          default: return null;
        }
      }
      case "MEDICAL_ASSISTANT":
      case "CLINIC_STAFF":
      case "HOSPITAL_STAFF": {
        switch (s) {
          case 1: return <AssistantIdentityStep onNext={next} />;
          case 2: return <AssistantOrganizationStep onNext={next} onBack={back} />;
          default: return null;
        }
      }
      default:
        return null;
    }
  }

  return (
    <OnboardingShell preview={<OnboardingPreview />}>
      <AnimatePresence mode="wait" custom={animDir}>
        <motion.div key={step} custom={animDir} variants={pageVariants} initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}>
          {step === 0 && <RoleSelection />}
          {step !== 0 && data.role === "PATIENT" && renderPatientStep(step)}
          {step !== 0 && data.role && data.role !== "PATIENT" && renderNonPatientStep(step)}
        </motion.div>
      </AnimatePresence>
    </OnboardingShell>
  );
}
