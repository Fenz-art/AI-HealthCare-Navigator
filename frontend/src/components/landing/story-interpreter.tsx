"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Languages } from "lucide-react";
import { StoryScene } from "@/components/landing/story-scene";

gsap.registerPlugin(ScrollTrigger);

export function StoryInterpreter() {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardRef.current) return;
      const panels = cardRef.current.querySelectorAll(".lang-panel");
      gsap.from(panels, {
        x: (i) => (i === 0 ? -20 : 20),
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 78%",
        },
      });
    },
    { scope: cardRef }
  );

  return (
    <StoryScene id="story-interpreter">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div ref={cardRef} className="card-elevated grid gap-3 rounded-3xl p-4 sm:grid-cols-2">
          <div className="lang-panel surface-card p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              English
            </p>
            <p className="text-sm leading-relaxed">
              I have had diarrhea and mild fever for two days. I am allergic to
              penicillin. I need over-the-counter relief.
            </p>
          </div>
          <div className="lang-panel rounded-2xl border-2 border-[var(--compass-teal)]/30 bg-accent/50 p-5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--compass-teal)]">
              <Languages className="size-3.5" />
              Japanese
            </p>
            <p className="text-sm leading-relaxed">
              2日間、下痢と軽い発熱があります。ペニシリンアレルギーがあります。市販薬が必要です。
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--compass-teal)]">
            Interpreter card
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Show a provider exactly what you need.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Medical context translated to the local language — side by side, fullscreen
            ready, so you don&apos;t have to improvise at the counter.
          </p>
        </div>
      </div>
    </StoryScene>
  );
}
