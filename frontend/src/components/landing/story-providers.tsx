"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";
import { StoryScene } from "@/components/landing/story-scene";

gsap.registerPlugin(ScrollTrigger);

const PROVIDERS = [
  { name: "Matsumoto Kiyoshi", type: "Pharmacy", distance: "0.4 km" },
  { name: "Shibuya Central Clinic", type: "Clinic", distance: "1.2 km" },
];

export function StoryProviders() {
  const mapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!mapRef.current) return;
      gsap.from(mapRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: mapRef }
  );

  return (
    <StoryScene id="story-providers" className="bg-muted/30">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--lavender-hover)" }}
          >
            Nearby care
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            See pharmacies and clinics on a map.
          </h2>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--ink-subtle)" }}
          >
            Ranked for your situation, with directions one tap away — like a
            ride request card, but for healthcare.
          </p>
        </div>
        <div
          ref={mapRef}
          className="overflow-hidden rounded-xl lifted-panel"
          style={{ background: "var(--surface-1)" }}
        >
          {/* Mini map mockup */}
          <div
            className="relative h-44"
            style={{
              background: "var(--surface-3)",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            {/* User dot */}
            <div
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full animate-provider-pulse"
              style={{ background: "var(--lavender)" }}
            />
            {/* Provider dots */}
            <div
              className="absolute left-[30%] top-[35%] h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--lavender-hover)" }}
            />
            <div
              className="absolute right-[28%] top-[55%] h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--lavender-hover)" }}
            />
          </div>
          <div
            className="divide-y p-2"
            style={{ borderColor: "var(--hairline)" }}
          >
            {PROVIDERS.map((provider) => (
              <div
                key={provider.name}
                className="flex items-center justify-between gap-3 px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <MapPin
                    className="size-4"
                    style={{ color: "var(--lavender-hover)" }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--ink)" }}
                    >
                      {provider.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--ink-tertiary)" }}
                    >
                      {provider.type}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--ink-subtle)" }}
                >
                  {provider.distance}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StoryScene>
  );
}
