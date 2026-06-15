"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";

interface VoiceVisualizerProps {
  isListening: boolean;
  onCancel?: () => void;
}

/**
 * Atmospheric full-overlay listening state.
 * Shows when the interpreter is actively recording voice input.
 */
export function VoiceVisualizer({ isListening, onCancel }: VoiceVisualizerProps) {
  if (!isListening) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-50"
      style={{
        background: "rgba(12, 16, 22, 0.85)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onCancel}
    >
      {/* Atmospheric pulse rings */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid var(--lavender)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 rounded-full"
          style={{ border: "1px solid var(--lavender)" }}
        />
        {/* Core button */}
        <div
          className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "var(--lavender)" }}
        >
          <Mic className="h-5 w-5" style={{ color: "var(--inverse-ink)" }} />
        </div>
      </div>

      {/* Status text */}
      <div className="text-center">
        <p className="text-sm font-medium" style={{ color: "var(--cc-fg-primary)" }}>
          Listening...
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--cc-fg-muted)" }}>
          Translating with medical context
        </p>
      </div>

      {/* Waveform bars */}
      <div className="flex h-8 items-center gap-1">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [0.2, 1, 0.2] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.055,
              ease: "easeInOut",
            }}
            className="w-1 rounded-full origin-bottom"
            style={{ height: "100%", background: "var(--lavender)" }}
          />
        ))}
      </div>

      <p className="text-xs" style={{ color: "var(--cc-fg-muted)" }}>
        Tap anywhere to cancel
      </p>
    </div>
  );
}
