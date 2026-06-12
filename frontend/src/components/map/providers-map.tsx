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
        style: "https://demotiles.maplibre.org/style.json",
        center: [lng, lat],
        zoom: 13,
        attributionControl: { compact: true },
      });

      mapRef.current = map;

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

      new maplibregl.Marker({ color: "#0b4d61" })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup({ offset: 24 }).setText("You are here"))
        .addTo(map);

      const bounds = new maplibregl.LngLatBounds([lng, lat], [lng, lat]);

      providers.forEach((provider) => {
        const color = PROVIDER_TYPE_COLORS[provider.type] ?? "#0faf8f";

        new maplibregl.Marker({ color })
          .setLngLat([provider.lng, provider.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 24 }).setHTML(
              `<strong>${provider.name}</strong><br/><span style="font-size:12px;color:#5c7279">${provider.address}</span>`
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
