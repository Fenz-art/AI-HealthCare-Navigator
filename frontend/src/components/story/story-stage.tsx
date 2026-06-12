"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type StoryStageProps = {
  stage: string;
  label: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  pin?: boolean;
};

export function StoryStage({
  stage,
  label,
  title,
  description,
  children,
  className,
  pin = false,
}: StoryStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !copyRef.current || !demoRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(copyRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        demoRef.current,
        { y: 56, opacity: 0, duration: 0.9, ease: "power3.out" },
        "-=0.5"
      );

      if (pin) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=80%",
          pin: demoRef.current,
          pinSpacing: true,
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={cn("border-t mk-hairline py-20 sm:py-28", className)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div ref={copyRef} className="mb-10 max-w-2xl lg:mb-14">
          <p className="mk-label">
            {stage} · {label}
          </p>
          <h2 className="mk-headline mt-4">{title}</h2>
          <p className="mk-subhead mt-5">{description}</p>
        </div>
        <div ref={demoRef}>{children}</div>
      </div>
    </section>
  );
}
