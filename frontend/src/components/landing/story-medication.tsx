"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { StoryScene } from "@/components/landing/story-scene";

gsap.registerPlugin(ScrollTrigger);

const MAPPINGS = [
  { from: "Tylenol", country: "United States", to: "Paracetamol" },
  { from: "Crocin", country: "India", to: "Paracetamol" },
  { from: "Bufferin Luna", country: "Japan", to: "Aspirin" },
];

export function StoryMedication() {
  const rowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rowRef.current) return;
      const cards = rowRef.current.querySelectorAll(".med-card");
      gsap.from(cards, {
        y: 32,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top 78%",
        },
      });
    },
    { scope: rowRef }
  );

  return (
    <StoryScene id="story-medication">
      <div className="text-center">
        <p className="text-sm font-medium text-[var(--compass-teal)]">
          Local medication
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Same ingredient. Local brand.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Tylenol in the US. Crocin in India. Bufferin Luna in Japan. We map
          active ingredients to what&apos;s actually on the shelf.
        </p>
      </div>
      <div ref={rowRef} className="mt-12 grid gap-4 sm:grid-cols-3">
        {MAPPINGS.map((item) => (
          <article
            key={item.from}
            className="med-card surface-card flex flex-col items-center p-6 text-center"
          >
            <p className="text-lg font-semibold">{item.from}</p>
            <p className="text-xs text-muted-foreground">{item.country}</p>
            <ArrowRight className="my-3 size-4 text-[var(--compass-teal)]" />
            <p className="text-sm font-medium text-[var(--compass-teal)]">
              {item.to}
            </p>
          </article>
        ))}
      </div>
    </StoryScene>
  );
}
