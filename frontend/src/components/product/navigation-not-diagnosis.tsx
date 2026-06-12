"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function NavigationNotDiagnosis() {
  const sectionRef = useRef<HTMLElement>(null);
  const diagnosisRef = useRef<HTMLSpanElement>(null);
  const navigationRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !diagnosisRef.current || !navigationRef.current) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
        },
      })
        .to(diagnosisRef.current, { opacity: 0, y: -20, duration: 1 })
        .to(navigationRef.current, { opacity: 1, y: 0, duration: 1 }, 0);
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[70vh] items-center justify-center bg-[var(--cc-surface)] px-4 py-24 sm:px-6"
    >
      <div className="relative text-center">
        <p className="font-display text-4xl font-bold tracking-tight text-[var(--cc-text-secondary)] sm:text-6xl lg:text-8xl">
          <span ref={diagnosisRef} className="inline-block opacity-100">
            Diagnosis
          </span>
        </p>
        <p className="font-display mt-2 text-4xl font-bold tracking-tight sm:text-6xl lg:text-8xl">
          <span
            ref={navigationRef}
            className="inline-block opacity-30"
            style={{ transform: "translateY(20px)" }}
          >
            Navigation
          </span>
        </p>
        <p className="mx-auto mt-10 max-w-md text-lg text-[var(--cc-text-secondary)]">
          We help you find the next step — not identify diseases.
        </p>
      </div>
    </section>
  );
}
