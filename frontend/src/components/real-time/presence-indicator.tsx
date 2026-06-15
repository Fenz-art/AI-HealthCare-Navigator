"use client";

import { useEffect, useState } from "react";
import { usePresenceStore } from "@/stores/presence-store";
import type { PresenceStatus } from "@/lib/types";

export function PresenceIndicator({
  userId,
  showLabel = false,
  showPage = false,
  size = "sm",
}: {
  userId: string;
  showLabel?: boolean;
  showPage?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const presences = usePresenceStore((s) => s.presences);
  const fetchPresence = usePresenceStore((s) => s.fetchPresence);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPresence(userId);
    const interval = setInterval(() => fetchPresence(userId), 30000);
    return () => clearInterval(interval);
  }, [userId, fetchPresence]);

  if (!mounted) return null;

  const presence = presences.get(userId);
  const status = presence?.status ?? "OFFLINE";
  const dotSize = size === "sm" ? "h-2 w-2" : size === "md" ? "h-2.5 w-2.5" : "h-3 w-3";

  const colorMap: Record<PresenceStatus, string> = {
    ONLINE: "var(--semantic-success)",
    AWAY: "var(--semantic-warning, #f59e0b)",
    OFFLINE: "var(--ink-tertiary)",
  };

  const labelMap: Record<PresenceStatus, string> = {
    ONLINE: "Online",
    AWAY: "Away",
    OFFLINE: "Offline",
  };

  const lastSeen = presence?.lastSeenAt
    ? timeAgo(presence.lastSeenAt)
    : null;

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`relative inline-flex ${dotSize} shrink-0 rounded-full`}
        style={{ background: colorMap[status] }}
      >
        {status === "ONLINE" && (
          <span
            className="absolute inset-0 animate-ping rounded-full opacity-75"
            style={{ background: colorMap[status] }}
          />
        )}
      </span>
      {showLabel && (
        <span className="text-[11px]" style={{ color: colorMap[status] }}>
          {labelMap[status]}
          {status === "OFFLINE" && lastSeen && ` · ${lastSeen}`}
          {status === "AWAY" && lastSeen && ` · ${lastSeen}`}
        </span>
      )}
      {showPage && presence?.currentPage && (
        <span className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
          · {presence.currentPage}
        </span>
      )}
    </div>
  );
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
