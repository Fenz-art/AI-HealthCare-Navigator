"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type NarrativeSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
};

export function NarrativeSection({
  eyebrow,
  title,
  description,
  children,
  reverse = false,
  className,
}: NarrativeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !copyRef.current || !previewRef.current) return;

      gsap.from(copyRef.current, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(previewRef.current, {
        y: 48,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={cn("border-t py-20 sm:py-28", className)}
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
            reverse && "lg:[&>*:first-child]:order-2"
          )}
        >
          <div ref={copyRef}>
            <p className="mk-label">{eyebrow}</p>
            <h2 className="mk-headline mt-4 text-[2rem] sm:text-[2.75rem]" style={{ letterSpacing: "-1px" }}>
              {title}
            </h2>
            <p className="mk-subhead mt-5 max-w-md">{description}</p>
          </div>
          <div ref={previewRef}>{children}</div>
        </div>
      </div>
    </section>
  );
}
