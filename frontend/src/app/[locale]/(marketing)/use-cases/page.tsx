"use client";

import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { UseCaseJourney } from "@/components/marketing/use-case-journey";
import { MarketingFooter } from "@/components/story/marketing-footer";
import { useLocale } from "next-intl";

const CASES = [
  {
    city: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    title: "Food poisoning in Tokyo",
    subtitle: "Late-night convenience store meal turns into nausea and fever.",
    outcome: "Recovered · 6h",
    steps: [
      { phase: "Detect", title: "Symptoms logged at hotel", detail: "Severity routes to pharmacy — not ER." },
      { phase: "Navigate", title: "Loperamide → Imodium HP", detail: "Local brand mapped from active ingredient." },
      { phase: "Locate", title: "Matsukiyo · 0.4 km", detail: "Open now. Walking directions ready." },
      { phase: "Resolve", title: "Outcome saved to passport", detail: "Timeline updated for future Tokyo trips." },
    ],
  },
  {
    city: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    title: "Lost prescription in Bangkok",
    subtitle: "Blood pressure medication left at home. Need local equivalent fast.",
    outcome: "Refilled · same day",
    steps: [
      { phase: "Vault", title: "Prescription retrieved", detail: "Health vault shows Lisinopril 10mg history." },
      { phase: "Navigate", title: "Thai equivalent found", detail: "Same active ingredient at Boots pharmacy." },
      { phase: "Translate", title: "Thai medical card ready", detail: "Pharmacist sees dosage in Thai script." },
      { phase: "Resolve", title: "Refill documented", detail: "Added to travel medication timeline." },
    ],
  },
  {
    city: "Madrid",
    country: "Spain",
    flag: "🇪🇸",
    title: "Allergy attack in Madrid",
    subtitle: "Shellfish reaction at tapas bar. Need antihistamine and clinic guidance.",
    outcome: "Stabilized · 2h",
    steps: [
      { phase: "Detect", title: "Allergy alert triggered", detail: "Shellfish on file — severity elevated." },
      { phase: "Locate", title: "Farmacia + clinic mapped", detail: "Nearest open pharmacy with epinephrine nearby." },
      { phase: "Translate", title: "Spanish interpreter live", detail: "Explain reaction history to clinician." },
      { phase: "Resolve", title: "Emergency contact notified", detail: "Spouse alerted per passport settings." },
    ],
  },
  {
    city: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    title: "Child fever in Berlin",
    subtitle: "3-year-old spiking fever. Parents need calm, clear next steps.",
    outcome: "Clinic visit · resolved",
    steps: [
      { phase: "Detect", title: "Pediatric severity check", detail: "Routes to clinic — not self-care." },
      { phase: "Locate", title: "Kinderarzt · 1.2 km", detail: "Family clinic open until 20:00." },
      { phase: "Translate", title: "German medical summary", detail: "Vaccination history from vault attached." },
      { phase: "Resolve", title: "Outcome for family timeline", detail: "Shared across family health passport." },
    ],
  },
];

export default function UseCasesPage() {
  const locale = useLocale();

  return (
    <SmoothScrollProvider>
      <section className="border-b px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32" style={{ borderColor: "var(--hairline)" }}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mk-label">Simulations</p>
          <h1 className="mk-display-xl mt-6 text-[2.5rem] sm:text-[3.5rem]">
            Built for how travelers actually get sick.
          </h1>
          <p className="mk-subhead mx-auto mt-6 max-w-xl">
            Each scenario is a cinematic journey — not a marketing card. Hover to watch the path unfold.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          {CASES.map((c) => (
            <UseCaseJourney key={c.title} {...c} />
          ))}
        </div>
      </section>

      <MarketingFooter locale={locale} />
    </SmoothScrollProvider>
  );
}
