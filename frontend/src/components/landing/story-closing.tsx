"use client";

import Link from "next/link";
import { useRef } from "react";
import { useParams } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { StoryScene } from "@/components/landing/story-scene";

gsap.registerPlugin(ScrollTrigger);

const COUNTRIES = [
  { city: "Tokyo", label: "Pharmacy navigation" },
  { city: "Mumbai", label: "Local brand lookup" },
  { city: "London", label: "Clinic routing" },
  { city: "Mexico City", label: "Emergency guidance" },
  { city: "Bangkok", label: "Self-care support" },
  { city: "Paris", label: "Interpreter cards" },
];

export function StoryClosing() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { locale } = useParams() as { locale: string };

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const cells = gridRef.current.querySelectorAll(".country-cell");
      gsap.from(cells, {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: gridRef }
  );

  return (
    <>
      <StoryScene id="story-coverage" className="bg-muted/30">
        <div className="text-center">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--lavender-hover)" }}
          >
            Global coverage
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Built for travelers, everywhere.
          </h2>
        </div>
        <div
          ref={gridRef}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {COUNTRIES.map((item) => (
            <div
              key={item.city}
              className="country-cell rounded-md p-5 lifted-panel"
              style={{ background: "var(--surface-1)" }}
            >
              <p className="font-semibold" style={{ color: "var(--ink)" }}>
                {item.city}
              </p>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--ink-subtle)" }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </StoryScene>

      <StoryScene id="story-closing" dark className="pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Ready when you need it.
          </h2>
          <p className="mt-4 text-lg text-white/75">
            Navigation, not diagnosis. One calm place when everything feels
            uncertain.
          </p>
          <Link
            href={`/${locale}/app/session/new`}
            className="mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors duration-150"
            style={{
              background: "var(--lavender)",
              color: "var(--inverse-ink)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background =
                "var(--lavender-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background =
                "var(--lavender)")
            }
          >
            Start session
            <ArrowRight className="ml-2 size-4" />
          </Link>
          <p className="mt-6 text-xs text-white/50">
            CareCompass provides healthcare navigation guidance and is not a
            medical diagnosis service.
          </p>
        </div>
      </StoryScene>
    </>
  );
}
