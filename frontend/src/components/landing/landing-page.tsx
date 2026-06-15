"use client";

import { useLocale } from "next-intl";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { MarketingHero } from "@/components/story/marketing-hero";
import { TrustMarquee } from "@/components/story/trust-marquee";
import { ChaosNarrative } from "@/components/story/chaos-narrative";
import { StoryStage } from "@/components/story/story-stage";
import {
  DetectDemo,
  LocateDemo,
  NavigateDemo,
  ResolveDemo,
  TranslateDemo,
} from "@/components/story/pipeline-demos";
import { PlatformsMatrix } from "@/components/story/platforms-matrix";
import { HealthGraph } from "@/components/product/health-graph";
import { DemoCard } from "@/components/story/demo-card";
import { FaqSection } from "@/components/story/faq-section";
import { MarketingFooter } from "@/components/story/marketing-footer";
import { UseCaseJourney } from "@/components/marketing/use-case-journey";
import Link from "next/link";

const SCENARIOS = [
  {
    city: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    title: "Food poisoning in Tokyo",
    subtitle: "Severity routes to pharmacy before panic sets in.",
    outcome: "Recovered · 6h",
    steps: [
      { phase: "Detect", title: "Symptoms logged", detail: "Pharmacy route selected." },
      { phase: "Navigate", title: "Imodium HP mapped", detail: "Local brand from loperamide." },
      { phase: "Locate", title: "Matsukiyo · 0.4 km", detail: "Walking directions ready." },
      { phase: "Resolve", title: "Outcome saved", detail: "Passport updated." },
    ],
  },
  {
    city: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    title: "Lost prescription in Bangkok",
    subtitle: "Blood pressure medication left at home.",
    outcome: "Refilled · same day",
    steps: [
      { phase: "Vault", title: "Prescription retrieved", detail: "Lisinopril 10mg on file." },
      { phase: "Navigate", title: "Thai equivalent found", detail: "Same active ingredient." },
      { phase: "Translate", title: "Thai card ready", detail: "Dosage in local script." },
      { phase: "Resolve", title: "Timeline updated", detail: "Medication history saved." },
    ],
  },
];

export function LandingPage() {
  const locale = useLocale();

  return (
    <SmoothScrollProvider>
      <MarketingHero />
      <TrustMarquee />

      <section className="border-t py-20 sm:py-28" style={{ borderColor: "var(--hairline)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mk-label">A new species of healthcare tool</p>
          <h2 className="mk-headline mt-4 max-w-2xl">
            Purpose-built for navigation — not diagnosis.
          </h2>
          <p className="mk-subhead mt-5 max-w-xl">
            Every session follows the same calm sequence — from symptom to outcome. One healthcare
            navigation OS for global travelers.
          </p>
        </div>
      </section>

      <ChaosNarrative />

      <StoryStage
        stage="01"
        label="DETECT"
        title="Severity assessed before you spiral."
        description="Describe symptoms once. CareCompass routes to self-care, pharmacy, clinic, or hospital — never diagnosing, always guiding."
      >
        <DetectDemo />
      </StoryStage>

      <StoryStage
        stage="02"
        label="NAVIGATE"
        title="Your meds. Their brands. Mapped."
        description="Active ingredient graph across 20 countries. Loperamide becomes Imodium HP in Tokyo. Instantly."
      >
        <NavigateDemo />
      </StoryStage>

      <StoryStage
        stage="03"
        label="LOCATE"
        title="Care you can walk to."
        description="Geo-ranked pharmacies and clinics. Severity-matched facility type. Directions ready."
        pin
      >
        <LocateDemo />
      </StoryStage>

      <StoryStage
        stage="04"
        label="TRANSLATE"
        title="Break the language barrier at the counter."
        description="Medical-grade interpreter with dual display. You approve every word before showing the provider."
      >
        <TranslateDemo />
      </StoryStage>

      <StoryStage
        stage="05"
        label="RESOLVE"
        title="Track what happened. Remember for next trip."
        description="Outcomes feed your health memory — vault, passport, and travel timeline grow with every session."
      >
        <ResolveDemo />
      </StoryStage>

      <PlatformsMatrix />

      <StoryStage
        stage="Moat"
        label="GRAPH"
        title="Every session strengthens the network."
        description="Symptoms, medication, providers, language, and outcomes — connected into a global healthcare navigation graph."
      >
        <DemoCard
          eyebrow="Global health graph"
          title="The data moat compounds with every traveler."
          subtitle="20 countries · 30 active ingredients · growing provider network"
        >
          <HealthGraph />
        </DemoCard>
      </StoryStage>

      <section className="border-t py-20 sm:py-28" style={{ borderColor: "var(--hairline)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="mk-label">Real scenarios</p>
              <h2 className="mk-headline mt-4">Built for how travelers actually get sick.</h2>
            </div>
            <Link href={`/${locale}/use-cases`} className="mk-btn-outline hidden sm:inline-flex">
              All use cases
            </Link>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {SCENARIOS.map((s) => (
              <UseCaseJourney key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
      <MarketingFooter locale={locale} />
    </SmoothScrollProvider>
  );
}
