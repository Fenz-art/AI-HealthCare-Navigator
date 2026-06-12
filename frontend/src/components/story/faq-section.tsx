"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ = [
  {
    q: "How does CareCompass find care?",
    a: "We assess symptom severity with AI, then route you to the right facility type — self-care, pharmacy, clinic, or hospital. Provider discovery uses live geo data ranked by distance and severity match.",
  },
  {
    q: "Is this a diagnosis?",
    a: "No. CareCompass is healthcare navigation — we guide you to appropriate next steps, map medications to local brands, and help you communicate. We never diagnose or prescribe.",
  },
  {
    q: "How does the interpreter work?",
    a: "Your session context is translated into medical-grade language for local providers. Hold-to-talk mode with live waveform. Dual display: traveler view and provider view.",
  },
  {
    q: "What countries are supported?",
    a: "20+ countries seeded with medication mappings and provider discovery. Japan, US, UK, Germany, France, Brazil, India, Thailand, and more — expanding with every session.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Start a session without signing up. Create an account to unlock health vault, passport, and session history across trips.",
  },
];

export function FaqSection() {
  return (
    <section className="border-t mk-hairline py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm text-[var(--mk-text-tertiary)]">Frequently asked.</p>
        <h2 className="mk-headline mt-3">What travelers ask before they trust us.</h2>
        <p className="mt-4 text-sm text-[var(--mk-text-secondary)]">
          Questions?{" "}
          <a href="mailto:hello@carecompass.health" className="underline underline-offset-2">
            hello@carecompass.health
          </a>
        </p>

        <Accordion.Root
          type="single"
          collapsible
          defaultValue="item-0"
          className="mt-12"
        >
          {FAQ.map((item, i) => (
            <Accordion.Item
              key={item.q}
              value={`item-${i}`}
              className="border-t mk-hairline"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between py-5 text-left">
                  <span className="pr-8 text-base font-medium text-[var(--mk-text)] group-data-[state=open]:font-semibold">
                    {item.q}
                  </span>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border mk-hairline">
                    <Plus className="size-3.5 group-data-[state=open]:hidden" />
                    <Minus className="hidden size-3.5 group-data-[state=open]:block" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content
                className={cn(
                  "overflow-hidden text-sm leading-relaxed text-[var(--mk-text-secondary)]",
                  "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                )}
              >
                <p className="pb-5">{item.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
          <div className="border-t mk-hairline" />
        </Accordion.Root>
      </div>
    </section>
  );
}
