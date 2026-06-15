"use client";

import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import {
  DetectDemo,
  LocateDemo,
  NavigateDemo,
  ResolveDemo,
  TranslateDemo,
} from "@/components/story/pipeline-demos";
import { NarrativeSection } from "@/components/marketing/narrative-section";
import { DemoCard } from "@/components/story/demo-card";
import { MarketingFooter } from "@/components/story/marketing-footer";
import { useLocale } from "next-intl";

const STEPS = [
  {
    eyebrow: "01 · Traveler gets sick",
    title: "Symptoms arrive in an unfamiliar city.",
    description:
      "You describe what you feel once. CareCompass captures context — location, language, medications — before panic sets in.",
    demo: <DetectDemo />,
  },
  {
    eyebrow: "02 · Symptoms become uncertainty",
    title: "The hardest part is not knowing what to do next.",
    description:
      "Severity engine routes you to self-care, pharmacy, clinic, or hospital. No diagnosis — only the next safe step.",
    demo: (
      <DemoCard eyebrow="Uncertainty resolved" title="Severity: moderate · pharmacy route" subtitle="Confidence before you leave the hotel">
        <div className="space-y-3 font-mono text-xs">
          {["Nausea + fever cluster detected", "No emergency signals", "Route: OTC + hydration + pharmacy"].map(
            (line) => (
              <p key={line} style={{ color: "var(--ink-muted)" }}>
                → {line}
              </p>
            )
          )}
        </div>
      </DemoCard>
    ),
    reverse: true,
  },
  {
    eyebrow: "03 · AI determines next step",
    title: "One agent orchestrates the entire path.",
    description:
      "Medication lookup, provider search, and interpreter prep run in parallel — like Linear agents executing tasks.",
    demo: <NavigateDemo />,
  },
  {
    eyebrow: "04 · Medication equivalents found",
    title: "Your prescription. Their brand names.",
    description:
      "Active ingredient graph maps Metformin, Loperamide, and 30+ molecules to local equivalents across 20 countries.",
    demo: <NavigateDemo />,
    reverse: true,
  },
  {
    eyebrow: "05 · Provider located",
    title: "Care you can walk to.",
    description:
      "Geo-ranked pharmacies and clinics. Severity-matched facility type. Directions and open status ready.",
    demo: <LocateDemo />,
  },
  {
    eyebrow: "06 · Interpreter activated",
    title: "Break the language barrier at the counter.",
    description:
      "Medical-grade dual-language card. Voice interpreter with patient context always visible to the provider.",
    demo: <TranslateDemo />,
    reverse: true,
  },
  {
    eyebrow: "07 · Outcome recorded",
    title: "Every session strengthens your health memory.",
    description:
      "Outcomes feed vault, passport, and travel timeline — compounding intelligence for your next journey.",
    demo: <ResolveDemo />,
  },
];

export default function HowItWorksPage() {
  const locale = useLocale();

  return (
    <SmoothScrollProvider>
      <section className="border-b px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32" style={{ borderColor: "var(--hairline)" }}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mk-label">Core engine</p>
          <h1 className="mk-display-xl mt-6 text-[2.5rem] sm:text-[3.5rem]">
            Seven stages. One operating system.
          </h1>
          <p className="mk-subhead mx-auto mt-6 max-w-xl">
            CareCompass follows the same narrative rhythm as the product — story, preview, story, preview —
            until the traveler reaches care with confidence.
          </p>
        </div>
      </section>

      {STEPS.map((step) => (
        <NarrativeSection
          key={step.eyebrow}
          eyebrow={step.eyebrow}
          title={step.title}
          description={step.description}
          reverse={step.reverse}
        >
          {step.demo}
        </NarrativeSection>
      ))}

      <MarketingFooter locale={locale} />
    </SmoothScrollProvider>
  );
}
