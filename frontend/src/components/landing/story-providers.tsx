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
          <p className="text-sm font-medium text-[var(--compass-teal)]">
            Nearby care
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            See pharmacies and clinics on a map.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Ranked for your situation, with directions one tap away — like a ride
            request card, but for healthcare.
          </p>
        </div>
        <div ref={mapRef} className="card-elevated overflow-hidden rounded-3xl">
          <div className="relative h-44 bg-[color-mix(in_srgb,var(--compass-ocean)_8%,white)]">
            <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--compass-ocean)] ring-4 ring-[var(--compass-ocean)]/20" />
            <div className="absolute left-[30%] top-[35%] size-2.5 rounded-full bg-[var(--compass-teal)]" />
            <div className="absolute right-[28%] top-[55%] size-2.5 rounded-full bg-[var(--compass-teal)]" />
          </div>
          <div className="divide-y divide-border p-2">
            {PROVIDERS.map((provider) => (
              <div
                key={provider.name}
                className="flex items-center justify-between gap-3 px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-[var(--compass-teal)]" />
                  <div>
                    <p className="text-sm font-medium">{provider.name}</p>
                    <p className="text-xs text-muted-foreground">{provider.type}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
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
