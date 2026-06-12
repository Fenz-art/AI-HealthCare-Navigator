"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useLocale } from "next-intl";
import { motion as motionTokens } from "@/lib/motion";

const ROUTES = [
  { x1: 0.18, y1: 0.42, x2: 0.82, y2: 0.38 },
  { x1: 0.25, y1: 0.58, x2: 0.68, y2: 0.45 },
  { x1: 0.12, y1: 0.48, x2: 0.55, y2: 0.62 },
  { x1: 0.75, y1: 0.52, x2: 0.35, y2: 0.35 },
];

const CITIES = [
  { x: 0.18, y: 0.42, label: "Tokyo" },
  { x: 0.82, y: 0.38, label: "London" },
  { x: 0.55, y: 0.62, label: "São Paulo" },
  { x: 0.68, y: 0.45, label: "Dubai" },
  { x: 0.35, y: 0.35, label: "Berlin" },
];

export function MarketingHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const locale = useLocale();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0,0,0,0.04)";
      for (let i = 0; i < 16; i++) {
        const y = (h / 16) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ROUTES.forEach((route, i) => {
        const sx = route.x1 * w;
        const sy = route.y1 * h;
        const ex = route.x2 * w;
        const ey = route.y2 * h;
        const mx = (sx + ex) / 2;
        const my = Math.min(sy, ey) - 48 - i * 10;
        const t = ((frame * 0.0025 + i * 0.18) % 1);
        const progress = (Math.sin(t * Math.PI * 2) + 1) / 2;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.strokeStyle = `rgba(196,92,38,${0.06 + progress * 0.14})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const px = sx + (ex - sx) * progress;
        const py =
          sy +
          (ey - sy) * progress +
          (my - (sy + ey) / 2) * Math.sin(progress * Math.PI) * 0.45;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,92,38,${0.35 + progress * 0.45})`;
        ctx.fill();
      });

      CITIES.forEach((city, i) => {
        const x = city.x * w;
        const y = city.y * h;
        const pulse = (Math.sin(frame * 0.018 + i) + 1) / 2;
        ctx.beginPath();
        ctx.arc(x, y, 4 + pulse * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,92,38,${0.08 + pulse * 0.08})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(10,10,10,0.7)";
        ctx.fill();
      });

      frame++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(196,92,38,0.04), transparent 60%), linear-gradient(to bottom, transparent 50%, var(--mk-bg) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.slow, ease: motionTokens.ease }}
          className="text-sm font-medium tracking-wide text-[var(--mk-text-secondary)]"
        >
          Healthcare navigation for global travelers
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.slow, delay: 0.08, ease: motionTokens.ease }}
          className="font-display mt-6 max-w-4xl text-[2.75rem] font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[4.5rem]"
        >
          Be guided to care
          <br />
          <span className="text-[var(--mk-text-secondary)]">before you panic-search.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.slow, delay: 0.16, ease: motionTokens.ease }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--mk-text-secondary)] sm:text-xl"
        >
          One agent watches symptoms, maps local medication, locates care, and arms your
          interpreter — across 20+ countries. Hands off. Human in the loop.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.slow, delay: 0.28, ease: motionTokens.ease }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link href={`/${locale}/app/session/new`} className="mk-btn-primary gap-2">
            Start session
            <ArrowRight className="size-4" />
          </Link>
          <Link href={`/${locale}/how-it-works`} className="mk-btn-outline gap-2">
            <Play className="size-4" />
            See how it works
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-xs text-[var(--mk-text-tertiary)]"
        >
          Free to start — no card required · Navigation, not diagnosis
        </motion.p>
      </div>
    </section>
  );
}
