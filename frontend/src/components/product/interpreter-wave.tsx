"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

type InterpreterWaveProps = {
  active?: boolean;
};

const BAR_COUNT = 32;

export function InterpreterWave({ active = false }: InterpreterWaveProps) {
  const heightsRef = useRef<number[]>(Array(BAR_COUNT).fill(0.12));

  useEffect(() => {
    if (!active) {
      heightsRef.current = Array(BAR_COUNT).fill(0.12);
      return;
    }
    const id = setInterval(() => {
      heightsRef.current = Array.from(
        { length: BAR_COUNT },
        (_, i) => 0.1 + Math.abs(Math.sin(Date.now() * 0.008 + i * 0.4)) * 0.75 + Math.random() * 0.15
      );
    }, 80);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="relative flex h-16 items-end justify-center gap-[3px]" aria-hidden>
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[var(--lavender)]/30 to-transparent"
        style={{ opacity: active ? 1 : 0.3 }}
      />
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <WaveBar key={i} index={i} active={active} />
      ))}
    </div>
  );
}

function WaveBar({ index, active }: { index: number; active: boolean }) {
  const spring = useSpring(active ? 0.15 + Math.sin(index * 0.5) * 0.35 : 0.1, {
    stiffness: 300,
    damping: 20,
  });

  useEffect(() => {
    if (!active) {
      spring.set(0.1);
      return;
    }
    const id = setInterval(() => {
      spring.set(0.12 + Math.abs(Math.sin(Date.now() * 0.006 + index * 0.35)) * 0.8);
    }, 90);
    return () => clearInterval(id);
  }, [active, index, spring]);

  const height = useTransform(spring, (v) => `${v * 100}%`);

  return (
    <motion.div
      className="w-[3px] rounded-full"
      style={{
        height,
        background: active
          ? `linear-gradient(to top, rgba(94,106,210,0.5), rgba(130,143,255,0.95))`
          : "rgba(94,106,210,0.2)",
      }}
    />
  );
}
