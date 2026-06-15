"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StoryScene } from "@/components/landing/story-scene";
import { SEVERITY_LABELS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const LEVELS = ["SELF_CARE", "PHARMACY", "CLINIC", "HOSPITAL", "EMERGENCY"] as const;

export function StorySeverity() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current) return;
      const items = trackRef.current.querySelectorAll(".severity-step");
      gsap.from(items, {
        x: -24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: trackRef }
  );

  return (
    <StoryScene id="story-severity" dark>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--lavender-hover)" }}>
            The routing engine
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            One clear next step — never a diagnosis.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            Our severity engine maps your symptoms to self-care, pharmacy, clinic,
            hospital, or emergency. You get direction, not a label.
          </p>
        </div>
        <div
          ref={trackRef}
          className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
        >
          {LEVELS.map((level, index) => (
            <div
              key={level}
              className="severity-step flex items-center gap-4 rounded-xl bg-white/10 px-4 py-3"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
                {index + 1}
              </span>
              <span className="font-medium text-white">
                {SEVERITY_LABELS[level]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </StoryScene>
  );
}
