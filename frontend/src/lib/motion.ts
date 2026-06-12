/** CareCompass motion system — Apple / Linear / Stripe pacing */
export const motion = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
} as const;
