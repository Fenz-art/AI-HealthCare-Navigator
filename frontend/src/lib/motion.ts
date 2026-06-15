import type { Variants, Transition } from "framer-motion";

/** CareCompass motion system — Apple / Linear / Stripe pacing */
export const motion = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
} as const;

// ── Linear-style spring: fast, snappy, no bounce ──────────────────────────────
export const linearSpring: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

// ── OS page / component transitions (blur + depth shift) ──────────────────────
export const osVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.98,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: linearSpring,
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// ── Stagger container (for lists: medications, vault items, etc.) ──────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03, // Lightning-fast stagger
      delayChildren: 0.08,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: linearSpring },
};
