"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useLocale } from "next-intl";
import { motion as motionTokens } from "@/lib/motion";

const ROUTES = [
  { x1: 0.22, y1: 0.38, x2: 0.78, y2: 0.35 },
  { x1: 0.28, y1: 0.55, x2: 0.65, y2: 0.42 },
  { x1: 0.15, y1: 0.45, x2: 0.52, y2: 0.58 },
  { x1: 0.72, y1: 0.48, x2: 0.38, y2: 0.32 },
];

const CITIES = [
  { x: 0.22, y: 0.38 },
  { x: 0.78, y: 0.35 },
  { x: 0.52, y: 0.58 },
  { x: 0.65, y: 0.42 },
  { x: 0.38, y: 0.32 },
];

export function WorldMapHero() {
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

      // Subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const y = (h / 12) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Flight paths
      ROUTES.forEach((route, i) => {
        const sx = route.x1 * w;
        const sy = route.y1 * h;
        const ex = route.x2 * w;
        const ey = route.y2 * h;
        const mx = (sx + ex) / 2;
        const my = Math.min(sy, ey) - 40 - i * 8;

        const t = ((frame * 0.003 + i * 0.2) % 1);
        const progress = (Math.sin(t * Math.PI * 2) + 1) / 2;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.strokeStyle = `rgba(59,130,246,${0.08 + progress * 0.12})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const px = sx + (ex - sx) * progress;
        const py = sy + (ey - sy) * progress + (my - (sy + ey) / 2) * Math.sin(progress * Math.PI) * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,197,253,${0.4 + progress * 0.5})`;
        ctx.fill();
      });

      // City nodes
      CITIES.forEach((city, i) => {
        const x = city.x * w;
        const y = city.y * h;
        const pulse = (Math.sin(frame * 0.02 + i) + 1) / 2;
        ctx.beginPath();
        ctx.arc(x, y, 3 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${0.15 + pulse * 0.1})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(247,248,250,0.7)";
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
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-80"
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(59,130,246,0.08), transparent 70%), linear-gradient(to bottom, transparent 40%, var(--cc-bg) 95%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-32 sm:px-6 sm:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.slow, ease: motionTokens.ease }}
          className="text-sm font-medium tracking-wide text-[var(--cc-text-secondary)]"
        >
          Healthcare navigation for global travelers
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.slow, delay: 0.1, ease: motionTokens.ease }}
          className="font-display mt-5 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Healthcare navigation
          <br />
          <span className="text-[var(--cc-text-secondary)]">for a world in motion.</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.slow, delay: 0.2, ease: motionTokens.ease }}
          className="mt-8 space-y-1 text-lg text-[var(--cc-text-secondary)] sm:text-xl"
        >
          <p>Find medication.</p>
          <p>Find care.</p>
          <p>Break language barriers.</p>
          <p className="font-medium text-[var(--cc-text)]">Anywhere.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.slow, delay: 0.35, ease: motionTokens.ease }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link href={`/${locale}/app/session/new`} className="btn-primary gap-2">
            Start session
            <ArrowRight className="size-4" />
          </Link>
          <Link href={`/${locale}/how-it-works`} className="btn-secondary gap-2">
            <Play className="size-4" />
            Watch demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
