"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Pill, Languages, Navigation } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    icon: MapPin,
    title: "Lost in Tokyo",
    body: "Food poisoning. No language. No idea where to go.",
    color: "var(--cc-emergency)",
  },
  {
    icon: Pill,
    title: "Medication appears",
    body: "Imodium HP · Oresol — local equivalents, instantly.",
    color: "var(--cc-pharmacy)",
  },
  {
    icon: MapPin,
    title: "Care on a map",
    body: "Matsumoto Kiyoshi, 0.4 km away. Directions ready.",
    color: "var(--cc-clinic)",
  },
  {
    icon: Languages,
    title: "Translation ready",
    body: "Show the pharmacist exactly what you need — in Japanese.",
    color: "var(--cc-hospital)",
  },
  {
    icon: Navigation,
    title: "Navigation resolved",
    body: "One clear next step. Calm. Guided. Done.",
    color: "var(--cc-success)",
  },
];

export function StoryTokyo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const phasesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !cardRef.current || !phasesRef.current) return;

      const phases = phasesRef.current.querySelectorAll(".tokyo-phase");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.8,
        },
      });

      phases.forEach((phase, i) => {
        if (i === 0) return;
        tl.fromTo(
          phases[i - 1],
          { opacity: 1, y: 0 },
          { opacity: 0, y: -24, duration: 0.5 },
          i
        ).fromTo(phase, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, i);
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative bg-[var(--cc-bg)]">
      <div className="flex min-h-screen items-center justify-center px-4 py-24 sm:px-6">
        <div
          ref={cardRef}
          className="cc-glow cc-elevated relative w-full max-w-2xl overflow-hidden rounded-3xl p-8 sm:p-12"
        >
          <p className="text-sm font-medium text-[var(--cc-pharmacy)]">Problem story</p>
          <div ref={phasesRef} className="relative mt-8 min-h-[200px]">
            {PHASES.map((phase, i) => {
              const Icon = phase.icon;
              return (
                <div
                  key={phase.title}
                  className="tokyo-phase absolute inset-0 flex flex-col justify-center"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <div
                    className="mb-6 flex size-14 items-center justify-center rounded-2xl"
                    style={{
                      background: `color-mix(in srgb, ${phase.color} 12%, transparent)`,
                    }}
                  >
                    <Icon className="size-7" style={{ color: phase.color }} />
                  </div>
                  <h3 className="font-display text-2xl font-bold sm:text-3xl">{phase.title}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-[var(--cc-text-secondary)]">
                    {phase.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
