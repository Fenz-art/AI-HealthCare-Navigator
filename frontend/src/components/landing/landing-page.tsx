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

const SCENARIOS = [
  { city: "Tokyo", issue: "Food poisoning", result: "Pharmacy · Recovered in 6h" },
  { city: "Bangkok", issue: "Heat exhaustion", result: "Clinic · IV fluids" },
  { city: "São Paulo", issue: "Medication refill", result: "Pharmacy · Resolved" },
  { city: "Berlin", issue: "Lost prescription", result: "Clinic · New script" },
];

export function LandingPage() {
  const locale = useLocale();

  return (
    <SmoothScrollProvider>
      <MarketingHero />
      <TrustMarquee />
      <ChaosNarrative />

      <section className="border-t mk-hairline py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mk-label">The pipeline</p>
          <h2 className="mk-headline mt-4">Five stages. One agent. Zero guesswork.</h2>
          <p className="mk-subhead mt-5 max-w-2xl">
            Every session follows the same calm sequence — from symptom to outcome. No
            spreadsheets. No six apps. One healthcare navigation OS.
          </p>
        </div>
      </section>

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
        className="bg-[var(--mk-surface)]"
      >
        <DemoCard
          eyebrow="Global health graph"
          title="The data moat compounds with every traveler."
          subtitle="20 countries · 30 active ingredients · growing provider network"
        >
          <HealthGraph />
        </DemoCard>
      </StoryStage>

      <section className="border-t mk-hairline py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mk-label">Real scenarios</p>
          <h2 className="mk-headline mt-4">Built for how travelers actually get sick.</h2>
          <div className="mt-12 grid gap-px border bg-[var(--mk-border)] sm:grid-cols-2 mk-hairline">
            {SCENARIOS.map((s) => (
              <div key={s.city} className="bg-[var(--mk-surface)] p-8">
                <p className="font-display text-xl font-bold">{s.city}</p>
                <p className="mt-2 text-sm text-[var(--mk-text-secondary)]">{s.issue}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--mk-accent)]">
                  {s.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
      <MarketingFooter locale={locale} />
    </SmoothScrollProvider>
  );
}
