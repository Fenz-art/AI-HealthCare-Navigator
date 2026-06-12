"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Languages, MapPin, Pill } from "lucide-react";
import { StoryCard } from "./story-card";

gsap.registerPlugin(ScrollTrigger);

const ENGINES = [
  {
    icon: Pill,
    title: "Medication intelligence",
    description: "Active ingredients mapped to local brands across 20+ countries.",
    color: "var(--cc-pharmacy)",
    animation: ["Tylenol", "→", "Crocin", "→", "Bufferin Luna"],
  },
  {
    icon: MapPin,
    title: "Provider discovery",
    description: "Pharmacies, clinics, and hospitals ranked for your severity level.",
    color: "var(--cc-clinic)",
    animation: ["You", "→", "0.4 km", "→", "Pharmacy"],
  },
  {
    icon: Languages,
    title: "Medical interpreter",
    description: "Context-aware translation providers can read in seconds.",
    color: "var(--cc-hospital)",
    animation: ["English", "↔", "日本語", "↔", "Provider"],
  },
];

export function NavigationEngine() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll(".engine-card");
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 78%" },
      });

      cards.forEach((card) => {
        const ticker = card.querySelector(".engine-ticker");
        if (!ticker) return;
        gsap.to(ticker, {
          x: -8,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: gridRef }
  );

  return (
    <StoryCard
      label="The engine"
      title="Healthcare navigation, not diagnosis"
      description="Three systems working together to answer one question: what should I do next?"
    >
      <div ref={gridRef} className="grid gap-4 lg:grid-cols-3">
        {ENGINES.map((engine) => {
          const Icon = engine.icon;
          return (
            <article
              key={engine.title}
              className="engine-card cc-panel group overflow-hidden transition-colors duration-250 hover:border-[rgba(59,130,246,0.2)]"
            >
              <div
                className="mb-4 flex size-10 items-center justify-center rounded-xl"
                style={{ background: `color-mix(in srgb, ${engine.color} 15%, transparent)` }}
              >
                <Icon className="size-5" style={{ color: engine.color }} />
              </div>
              <h3 className="font-display text-lg font-bold">{engine.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--cc-text-secondary)]">
                {engine.description}
              </p>
              <div className="mt-6 overflow-hidden rounded-lg bg-[var(--cc-bg)] p-3">
                <div className="engine-ticker flex gap-3 text-xs font-medium text-[var(--cc-text-secondary)]">
                  {engine.animation.map((item, i) => (
                    <span
                      key={i}
                      className={item === "→" || item === "↔" ? "text-[var(--cc-pharmacy)]" : ""}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </StoryCard>
  );
}
