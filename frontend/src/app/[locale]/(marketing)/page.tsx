"use client";

import dynamic from "next/dynamic";

// LandingPage uses Lenis smooth scroll, GSAP ScrollTrigger, and framer-motion
// animations that depend on browser APIs — disable SSR to prevent hydration mismatches.
const LandingPage = dynamic(
  () => import("@/components/landing/landing-page").then((m) => ({ default: m.LandingPage })),
  { ssr: false }
);

export default function Page() {
  return <LandingPage />;
}
