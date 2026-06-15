"use client";

/**
 * Atmospheric SVG network overlay for the hero section.
 * Visualises the Global Healthcare Navigation Graph — travelers, sessions,
 * medications, and providers as glowing nodes connected by hairline edges.
 *
 * Pure CSS/SVG — no Three.js weight.
 */
export function HealthGraphVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-35 select-none">
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        aria-hidden="true"
      >
        <defs>
          {/* Soft node glow */}
          <filter id="hgv-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Subtler edge glow */}
          <filter id="hgv-edge-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Graph Edges ── */}
        <g filter="url(#hgv-edge-glow)" opacity="0.5">
          {/* Traveler → Session core */}
          <line x1="18%" y1="28%" x2="50%" y2="52%" stroke="#2A3445" strokeWidth="1" />
          {/* Session core → Provider */}
          <line x1="50%" y1="52%" x2="78%" y2="38%" stroke="#2A3445" strokeWidth="1" />
          {/* Session core → Medication */}
          <line x1="50%" y1="52%" x2="38%" y2="78%" stroke="#2A3445" strokeWidth="1" />
          {/* Provider → Hospital node */}
          <line x1="78%" y1="38%" x2="68%" y2="68%" stroke="#2A3445" strokeWidth="0.8" />
          {/* Second traveler */}
          <line x1="72%" y1="18%" x2="50%" y2="52%" stroke="#2A3445" strokeWidth="0.8" />
          {/* Third traveler */}
          <line x1="28%" y1="62%" x2="50%" y2="52%" stroke="#2A3445" strokeWidth="0.8" />
        </g>

        {/* ── Graph Nodes ── */}

        {/* Traveler 1 */}
        <circle cx="18%" cy="28%" r="5" fill="#3F3F46" filter="url(#hgv-glow)" />

        {/* Traveler 2 */}
        <circle cx="72%" cy="18%" r="4" fill="#3F3F46" filter="url(#hgv-glow)" />

        {/* Traveler 3 */}
        <circle cx="28%" cy="62%" r="3.5" fill="#3F3F46" filter="url(#hgv-glow)" />

        {/* Session Core — accent teal, pulsing */}
        <circle
          cx="50%"
          cy="52%"
          r="7"
          fill="#0D9488"
          filter="url(#hgv-glow)"
          className="animate-pulse"
        />

        {/* Provider — blue */}
        <circle cx="78%" cy="38%" r="5" fill="#2563EB" filter="url(#hgv-glow)" />

        {/* Hospital node — muted red */}
        <circle cx="68%" cy="68%" r="4" fill="#7F1D1D" filter="url(#hgv-glow)" />

        {/* Medication — amber */}
        <circle cx="38%" cy="78%" r="4" fill="#D97706" filter="url(#hgv-glow)" />
      </svg>
    </div>
  );
}
