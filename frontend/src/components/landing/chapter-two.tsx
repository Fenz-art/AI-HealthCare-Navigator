"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-triggered "Diagnosis → Navigation" chapter.
 *
 * As the user scrolls into this section:
 * 1. "Diagnosis" fades and a red line draws through it
 * 2. "Navigation" fades in with teal accent colour
 *
 * Inspired by Linear's scroll-choreography landing sections.
 */
export function ChapterTwo() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // "Diagnosis" fades and dims as user scrolls
  const diagnosisOpacity = useTransform(scrollYProgress, [0.15, 0.4], [1, 0.25]);
  const diagnosisScale = useTransform(scrollYProgress, [0.15, 0.4], [1, 0.96]);

  // Strikethrough line draws across "Diagnosis"
  const lineWidth = useTransform(scrollYProgress, [0.15, 0.38], ["0%", "100%"]);

  // "Navigation" fades in
  const navigationOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const navigationScale = useTransform(scrollYProgress, [0.3, 0.55], [0.96, 1]);

  // Supporting paragraph
  const paraOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const paraY = useTransform(scrollYProgress, [0.4, 0.6], [16, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-24"
      style={{ background: "var(--cc-void)" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
        style={{ background: "rgba(13, 148, 136, 0.04)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        {/* ── "Diagnosis" with animated strikethrough ── */}
        <div className="relative inline-block">
          <motion.h2
            style={{ opacity: diagnosisOpacity, scale: diagnosisScale, color: "var(--cc-fg-muted)" }}
            className="text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl"
          >
            Diagnosis
          </motion.h2>
          {/* Animated red strike line */}
          <motion.span
            style={{ width: lineWidth, height: "3px", background: "rgba(239, 68, 68, 0.8)" }}
            className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full"
          />
        </div>

        {/* ── "Navigation" replacement ── */}
        <motion.h2
          style={{ opacity: navigationOpacity, scale: navigationScale, color: "var(--lavender-hover)" }}
          className="text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl"
        >
          Navigation
        </motion.h2>

        {/* ── Supporting copy ── */}
        <motion.p
          style={{ opacity: paraOpacity, y: paraY, color: "var(--cc-fg-muted)" }}
          className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed"
        >
          We don&apos;t tell you what you have.{" "}
          <span style={{ color: "var(--cc-fg-primary)" }}>
            We tell you what to do next.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
