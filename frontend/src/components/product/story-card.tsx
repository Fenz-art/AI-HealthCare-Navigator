"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type StoryCardProps = {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  label?: string;
  title?: string;
  description?: string;
};

export function StoryCard({
  children,
  className,
  dark,
  label,
  title,
  description,
}: StoryCardProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.from(ref.current, {
        y: 48,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className={cn(
        "py-24 sm:py-32",
        dark ? "bg-[var(--cc-surface)]" : "bg-[var(--cc-bg)]",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {(label || title) && (
          <div className="mb-12 max-w-2xl">
            {label ? (
              <p className="text-sm font-medium text-[var(--cc-pharmacy)]">{label}</p>
            ) : null}
            {title ? (
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-lg leading-relaxed text-[var(--cc-text-secondary)]">
                {description}
              </p>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
