"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type MissionSectionProps = {
  eyebrow: string;
  title: string;
  lines: string[];
  children?: React.ReactNode;
};

export function MissionSection({ eyebrow, title, lines, children }: MissionSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.from(ref.current.querySelectorAll("[data-animate]"), {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="border-t py-20 sm:py-28"
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mk-label" data-animate>
              {eyebrow}
            </p>
            <h2
              className="mk-headline mt-4 text-[2rem] sm:text-[2.75rem]"
              style={{ letterSpacing: "-1px" }}
              data-animate
            >
              {title}
            </h2>
          </div>
          <div className="space-y-4">
            {lines.map((line) => (
              <p
                key={line}
                className="text-base leading-relaxed sm:text-lg"
                style={{ color: "var(--ink-muted)" }}
                data-animate
              >
                {line}
              </p>
            ))}
          </div>
        </div>
        {children ? <div className="mt-12" data-animate>{children}</div> : null}
      </div>
    </section>
  );
}
