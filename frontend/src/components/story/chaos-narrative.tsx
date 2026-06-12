"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Globe,
  Languages,
  MapPin,
  MessageCircle,
  Pill,
  Search,
  Sparkles,
} from "lucide-react";
import { DemoCard } from "./demo-card";

gsap.registerPlugin(ScrollTrigger);

const CHAOS_TOOLS = [
  { icon: Search, label: "Google symptoms", x: "8%", y: "12%" },
  { icon: Languages, label: "Translate app", x: "72%", y: "8%" },
  { icon: MapPin, label: "Find pharmacy", x: "78%", y: "42%" },
  { icon: MessageCircle, label: "Ask ChatGPT", x: "6%", y: "55%" },
  { icon: Pill, label: "Drug lookup", x: "42%", y: "6%" },
  { icon: Globe, label: "Embassy site", x: "55%", y: "68%" },
];

const RESOLUTION = [
  { icon: MapPin, label: "Care located", detail: "Matsumoto Kiyoshi · 0.4 km" },
  { icon: Pill, label: "Meds mapped", detail: "Imodium HP · Oresol" },
  { icon: Languages, label: "Interpreter ready", detail: "Japanese · provider mode" },
  { icon: Sparkles, label: "One next step", detail: "Walk to pharmacy · show screen" },
];

export function ChaosNarrative() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chaosRef = useRef<HTMLDivElement>(null);
  const calmRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !chaosRef.current || !calmRef.current) return;

      const tools = chaosRef.current.querySelectorAll(".chaos-tool");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.6,
        },
      });

      tools.forEach((tool, i) => {
        tl.fromTo(
          tool,
          { opacity: 0, scale: 0.6, rotation: -8 + i * 3 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.4 },
          i * 0.15
        );
      });

      tl.to(tools, {
        opacity: 0,
        scale: 0.85,
        y: -20,
        stagger: 0.05,
        duration: 0.5,
      });

      tl.fromTo(
        calmRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.2"
      );

      const rows = calmRef.current.querySelectorAll(".calm-row");
      tl.fromTo(
        rows,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, stagger: 0.12, duration: 0.4 },
        "-=0.3"
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[var(--mk-bg)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-24 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="mk-label">The problem</p>
          <h2 className="mk-headline mt-4">
            Sick abroad. Six apps. Zero clarity.
          </h2>
          <p className="mk-subhead mt-5">
            Food poisoning in Tokyo. You search, translate, map, and guess — while symptoms
            escalate and language barriers multiply.
          </p>
        </div>

        <div className="relative">
          <div
            ref={chaosRef}
            className="mk-demo-card relative min-h-[340px] sm:min-h-[400px]"
          >
            <div className="mk-demo-header">
              <p className="mk-mono">Shibuya, Tokyo · 2:14 AM</p>
              <h3 className="font-display mt-2 text-xl font-bold sm:text-2xl">
                Everything fragments at once.
              </h3>
            </div>
            <div className="relative min-h-[240px] p-6 sm:min-h-[280px]">
              {CHAOS_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.label}
                    className="chaos-tool absolute flex items-center gap-2 rounded-full border bg-[var(--mk-surface)] px-3 py-2 shadow-sm mk-hairline"
                    style={{ left: tool.x, top: tool.y }}
                  >
                    <Icon className="size-3.5 text-[var(--mk-text-secondary)]" />
                    <span className="text-xs font-medium text-[var(--mk-text)]">
                      {tool.label}
                    </span>
                  </div>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-display text-center text-2xl font-bold text-[var(--mk-text-secondary)]/40 sm:text-3xl">
                  ???
                </p>
              </div>
            </div>
          </div>

          <div ref={calmRef} className="absolute inset-0 opacity-0">
            <DemoCard
              eyebrow="CareCompass · Session active"
              title="One agent. One path. Calm."
              subtitle="Severity assessed · Pharmacy route · Interpreter armed"
            >
              <div className="space-y-3">
                {RESOLUTION.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="calm-row flex items-center gap-4 rounded-xl border px-4 py-3 mk-hairline"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--mk-accent-muted)]">
                        <Icon className="size-4 text-[var(--mk-accent)]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--mk-text)]">
                          {item.label}
                        </p>
                        <p className="text-xs text-[var(--mk-text-secondary)]">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DemoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
