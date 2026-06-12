"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  { id: "traveler", label: "Traveler", x: 50, y: 50 },
  { id: "symptoms", label: "Symptoms", x: 22, y: 28 },
  { id: "medication", label: "Medication", x: 78, y: 28 },
  { id: "provider", label: "Provider", x: 22, y: 72 },
  { id: "language", label: "Language", x: 78, y: 72 },
  { id: "outcome", label: "Outcome", x: 50, y: 88 },
];

const EDGES: [string, string][] = [
  ["traveler", "symptoms"],
  ["traveler", "medication"],
  ["symptoms", "provider"],
  ["medication", "provider"],
  ["provider", "language"],
  ["language", "outcome"],
  ["traveler", "outcome"],
];

export function HealthGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!svgRef.current) return;
      const lines = svgRef.current.querySelectorAll(".graph-edge");
      const nodes = svgRef.current.querySelectorAll(".graph-node");

      gsap.from(lines, {
        strokeDashoffset: 200,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
      });

      gsap.from(nodes, {
        scale: 0,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.2,
        scrollTrigger: { trigger: svgRef.current, start: "top 75%" },
      });
    },
    { scope: svgRef }
  );

  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl p-4 sm:p-6">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="h-full w-full"
        aria-label="Global healthcare navigation graph"
      >
        {EDGES.map(([a, b]) => {
          const na = nodeMap[a];
          const nb = nodeMap[b];
          return (
            <line
              key={`${a}-${b}`}
              className="graph-edge"
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="rgba(196,92,38,0.35)"
              strokeWidth="0.4"
              strokeDasharray="4 2"
            />
          );
        })}
        {NODES.map((node) => (
          <g key={node.id} className="graph-node" transform={`translate(${node.x} ${node.y})`}>
            <circle r="5" fill="var(--mk-surface, var(--cc-elevated))" stroke="rgba(196,92,38,0.5)" strokeWidth="0.5" />
            <text
              y="9"
              textAnchor="middle"
              fill="var(--mk-text-secondary, var(--cc-text-secondary))"
              fontSize="3.2"
              fontFamily="var(--font-sans)"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
