"use client";

import { useEffect, useState } from "react";
import { usePresenceStore } from "@/stores/presence-store";
import { api } from "@/lib/api";

export function TypingIndicator({
  conversationId,
  currentUserId,
}: {
  conversationId: string;
  currentUserId: string;
}) {
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const conv = await api.getConversation(conversationId);
        const otherParticipants = conv.participants
          .filter((p) => p.userId !== currentUserId)
          .map((p) => p.userId);
        setTypingUserIds(otherParticipants);
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [conversationId, currentUserId]);

  if (typingUserIds.length === 0) return null;

  return <TypingBubble participantIds={typingUserIds} />;
}

function TypingBubble({ participantIds }: { participantIds: string[] }) {
  const presences = usePresenceStore((s) => s.presences);

  return (
    <div className="flex items-center gap-2 px-1 py-1">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: "var(--ink-tertiary)", animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: "var(--ink-tertiary)", animationDelay: "150ms" }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: "var(--ink-tertiary)", animationDelay: "300ms" }} />
      </div>
      <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
        {participantIds.length === 1
          ? `${
              presences.get(participantIds[0])?.user?.name ?? "Someone"
            } is typing...`
          : `${participantIds.length} people are typing...`}
      </span>
    </div>
  );
}
