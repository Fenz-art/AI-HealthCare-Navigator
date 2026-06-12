"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StoryScene } from "@/components/landing/story-scene";
import { COMMON_SYMPTOMS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export function StorySymptoms() {
  const chipsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!chipsRef.current) return;
      const chips = chipsRef.current.querySelectorAll(".symptom-chip");
      gsap.from(chips, {
        scale: 0.8,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: chipsRef.current,
          start: "top 78%",
        },
      });
    },
    { scope: chipsRef }
  );

  return (
    <StoryScene id="story-symptoms" className="bg-muted/30">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="card-elevated aspect-[4/3] overflow-hidden rounded-3xl bg-[color-mix(in_srgb,var(--compass-ocean)_6%,white)] p-8">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step 1
              </p>
              <p className="mt-2 text-2xl font-bold">Share how you feel</p>
            </div>
            <div
              ref={chipsRef}
              className="flex flex-wrap gap-2"
            >
              {COMMON_SYMPTOMS.slice(0, 6).map((symptom) => (
                <span
                  key={symptom}
                  className="symptom-chip rounded-full bg-card px-4 py-2 text-sm font-medium shadow-sm"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--compass-teal)]">
            Onboarding, not a medical form
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Tell us where you are and what&apos;s wrong.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Location, symptoms, allergies, and medications — enough context to
            guide you, without the anxiety of a clinical intake.
          </p>
        </div>
      </div>
    </StoryScene>
  );
}
