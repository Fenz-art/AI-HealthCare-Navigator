import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it works",
};

const steps = [
  {
    stage: "01",
    label: "DETECT",
    title: "Assess Severity & Context",
    body: "Describe your symptoms in plain language. Our system maps them against active ingredients, allergies, and emergency signals — establishing security before you spiral.",
  },
  {
    stage: "02",
    label: "NAVIGATE",
    title: "Medication Cross-Mapping",
    body: "We identify equivalent local brand names, chemical equivalents, and matching active ingredients for your current medicines in the host country.",
  },
  {
    stage: "03",
    label: "LOCATE",
    title: "Geo-Ranked Providers",
    body: "Locate pharmacies, clinics, and severity-appropriate hospitals within walking distance. View distances, directions, and real-time open status.",
  },
  {
    stage: "04",
    label: "TRANSLATE",
    title: "Medical Interpreter Card",
    body: "A dual-language card is prepared with your precise symptoms and details translated into the local language. Show it directly to the pharmacist or clinician.",
  },
  {
    stage: "05",
    label: "RESOLVE",
    title: "Strengthen Travel Memory",
    body: "Your outcome is saved to your personal Health Passport and Vault, compounding your health intelligence for any future journeys.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="mk-label mb-3">Core Engine</p>
        <h1 className="mk-headline">Five stages. One agent. Zero guesswork.</h1>
        <p className="mk-subhead mt-5">
          CareCompass is built for travelers who need direction, not diagnosis. Here is how your travel companion handles the chaos.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
        {steps.map((step) => (
          <div key={step.title} className="rounded-2xl border bg-[var(--mk-surface)] p-6 shadow-sm border-[var(--mk-border-strong)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[var(--mk-accent)] tracking-wider block mb-4">
                {step.stage} · {step.label}
              </span>
              <h2 className="text-lg font-bold text-[var(--mk-text)]">{step.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--mk-text-secondary)]">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
