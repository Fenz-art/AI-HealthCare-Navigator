"use client";

import { useEffect, useRef } from "react";
import type { ProviderRecommendation } from "@/lib/types";
import { PROVIDER_TYPE_COLORS } from "@/lib/constants";
import "maplibre-gl/dist/maplibre-gl.css";

type ProvidersMapProps = {
  lat: number;
  lng: number;
  providers: ProviderRecommendation[];
  className?: string;
};

export function ProvidersMap({ lat, lng, providers, className }: ProvidersMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    async function initMap() {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        // CartoDB DarkMatter — deep, minimal, matches the OS dark environment
        style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        center: [lng, lat],
        zoom: 13,
        attributionControl: { compact: true },
      });

      mapRef.current = map;

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");

      // User location marker — accent teal pulse
      new maplibregl.Marker({ color: "#0D9488", scale: 1.2 })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup({ offset: 24 }).setText("You are here"))
        .addTo(map);

      const bounds = new maplibregl.LngLatBounds([lng, lat], [lng, lat]);

      providers.forEach((provider) => {
        const color = PROVIDER_TYPE_COLORS[provider.type] ?? "#2DD4BF";

        // Custom glass-morphism provider marker
        const el = document.createElement("div");
        el.style.cssText = `
          width: 26px;
          height: 26px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          backdrop-filter: blur(4px);
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 0 4px ${color}22;
        `;
        el.addEventListener("mouseenter", () => {
          el.style.background = `${color}33`;
          el.style.borderColor = color;
          el.style.transform = "scale(1.25)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.background = "rgba(255, 255, 255, 0.08)";
          el.style.borderColor = "rgba(255, 255, 255, 0.25)";
          el.style.transform = "scale(1)";
        });

        new maplibregl.Marker({ element: el })
          .setLngLat([provider.lng, provider.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 24 }).setHTML(
              `<strong>${provider.name}</strong><br/><span style="font-size:12px;color:#8896AB">${provider.address}</span>`
            )
          )
          .addTo(map);

        bounds.extend([provider.lng, provider.lat]);
      });

      if (providers.length > 0) {
        map.fitBounds(bounds, { padding: 48, maxZoom: 15 });
      }
    }

    initMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, providers]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label="Map showing nearby care providers"
    />
  );
}
