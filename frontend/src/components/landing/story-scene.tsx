"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type StorySceneProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
  pin?: boolean;
};

export function StoryScene({
  children,
  className,
  id,
  dark = false,
  pin = false,
}: StorySceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !contentRef.current) return;

      gsap.from(contentRef.current, {
        y: 56,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          end: pin ? "+=40%" : undefined,
          pin: pin || undefined,
          scrub: pin ? 0.6 : undefined,
          toggleActions: pin ? undefined : "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "relative overflow-hidden py-20 sm:py-28",
        dark ? "text-white" : "bg-background",
        className
      )}
      style={dark ? { background: "var(--surface-1)" } : undefined}
    >
      <div ref={contentRef} className="mx-auto max-w-6xl px-4 sm:px-6">
        {children}
      </div>
    </section>
  );
}
