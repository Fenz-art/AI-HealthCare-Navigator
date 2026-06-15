"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CITIES = [
  { name: "Tokyo",     x: 82, y: 38, delay: 0    },
  { name: "Mumbai",    x: 68, y: 48, delay: 0.15 },
  { name: "London",    x: 48, y: 32, delay: 0.3  },
  { name: "NYC",       x: 28, y: 36, delay: 0.45 },
  { name: "São Paulo", x: 34, y: 68, delay: 0.6  },
];

export function WorldMap() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!svgRef.current) return;

      gsap.from(svgRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 1.2,
        ease: "power2.out",
      });

      gsap.to(svgRef.current, {
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      const dots = svgRef.current.querySelectorAll(".map-dot");
      dots.forEach((dot, i) => {
        gsap.from(dot, {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          delay: 0.4 + i * 0.12,
          ease: "back.out(2)",
        });

        gsap.to(dot, {
          scale: 1.4,
          opacity: 0.4,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: CITIES[i]?.delay ?? 0,
        });
      });
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 70"
      /* surface-3 at low opacity for the land masses */
      style={{ color: "rgba(26,26,31,0.6)" }}
      aria-hidden
    >
      <ellipse cx="50" cy="35" rx="46" ry="30" fill="currentColor" opacity="0.35" />
      <path
        d="M12 32c8-6 18-8 28-6s20 2 30-1 18-4 22 2-8 10-18 12-26 8-34 4-14-4-22-7z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M18 48c6 4 14 6 22 4s18-6 26-2 10 8 4 12-16 4-24 0-18-6-28-14z"
        fill="currentColor"
        opacity="0.4"
      />
      {CITIES.map((city) => (
        <g key={city.name} transform={`translate(${city.x} ${city.y})`}>
          {/* Lavender city dots */}
          <circle className="map-dot" r="2.8" fill="#5e6ad2" opacity="0.9" />
          <circle r="5" fill="#5e6ad2" opacity="0.15" />
        </g>
      ))}
    </svg>
  );
}
