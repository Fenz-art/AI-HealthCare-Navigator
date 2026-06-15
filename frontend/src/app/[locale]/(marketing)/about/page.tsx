"use client";

import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { MissionSection } from "@/components/marketing/mission-section";
import { HealthGraph } from "@/components/product/health-graph";
import { DemoCard } from "@/components/story/demo-card";
import { MarketingFooter } from "@/components/story/marketing-footer";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function AboutPage() {
  const locale = useLocale();

  return (
    <SmoothScrollProvider>
      <section className="border-b px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-32" style={{ borderColor: "var(--hairline)" }}>
        <div className="mx-auto max-w-4xl">
          <p className="mk-label">Mission</p>
          <h1 className="mk-display-xl mt-6 max-w-3xl text-[2.5rem] sm:text-[3.75rem]">
            Navigation, not diagnosis.
          </h1>
          <p className="mk-subhead mt-8 max-w-2xl text-lg">
            CareCompass exists because getting sick abroad is rarely about the illness — it is about
            not knowing where to turn, what to ask for, or how to explain it.
          </p>
        </div>
      </section>

      <MissionSection
        eyebrow="Why we exist"
        title="Travelers deserve an operating system for care."
        lines={[
          "We are not telemedicine. We do not sell insurance. We are not AI doctors.",
          "We help you understand your immediate next step — rest, pharmacy, clinic, or hospital.",
        ]}
      />

      <MissionSection
        eyebrow="The problem"
        title="Healthcare navigation fails when context disappears."
        lines={[
          "Language barriers. Unknown brands. Unfamiliar systems. No shared medical memory.",
          "Every traveler starts from zero — even when their health history could guide the path.",
        ]}
      />

      <MissionSection
        eyebrow="Fragmentation"
        title="Global healthcare was never designed for movement."
        lines={[
          "Medications have different names. Providers use different systems. Records stay locked in silos.",
          "CareCompass connects these fragments into one navigable graph.",
        ]}
      >
        <DemoCard eyebrow="Medication equivalency graph" title="30+ active ingredients · 20 countries" subtitle="Compounds with every session">
          <HealthGraph />
        </DemoCard>
      </MissionSection>

      <MissionSection
        eyebrow="Infrastructure"
        title="Interpreter infrastructure built for medical context."
        lines={[
          "Not tourist phrasebooks. Dual-language cards with symptoms, allergies, and medications pre-loaded.",
          "Voice interpretation with patient context always visible to the provider.",
        ]}
      />

      <MissionSection
        eyebrow="Future"
        title="A healthcare memory network for every journey."
        lines={[
          "Every session feeds a global graph — symptoms, medications, providers, language, outcomes.",
          "The moat compounds. Travel gets safer with every traveler we guide.",
        ]}
      />

      <section className="border-t py-20 sm:py-28" style={{ borderColor: "var(--hairline)" }}>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="mk-headline text-[2rem] sm:text-[2.5rem]">Join the operating system.</h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={`/${locale}/signup`} className="mk-btn-inverse px-5">
              Get started
            </Link>
            <Link href={`/${locale}/how-it-works`} className="mk-btn-outline px-5">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter locale={locale} />
    </SmoothScrollProvider>
  );
}
