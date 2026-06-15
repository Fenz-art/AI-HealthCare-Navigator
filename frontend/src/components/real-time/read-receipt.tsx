"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { MessageRead } from "@/lib/types";
import { Check, CheckCheck } from "lucide-react";

export function ReadReceipt({
  messageId,
  messageStatus,
  isMine,
}: {
  messageId: string;
  messageStatus?: string;
  isMine: boolean;
}) {
  const [receipts, setReceipts] = useState<MessageRead[]>([]);
  const [status, setStatus] = useState(messageStatus ?? "SENT");

  useEffect(() => {
    if (!isMine) return;
    async function load() {
      try {
        const data = await api.getMessageReadReceipts(messageId);
        setReceipts(data);
        if (data.length > 0) setStatus("SEEN");
      } catch {}
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [messageId, isMine]);

  if (!isMine) return null;

  if (receipts.length > 0) {
    const names = receipts.map((r) => r.user?.name ?? "User").join(", ");
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px]"
        style={{ color: "var(--semantic-success, #10b981)" }}
        title={`Seen by ${names}`}
      >
        <CheckCheck className="size-3" />
        <span>Seen</span>
      </span>
    );
  }

  if (status === "DELIVERED") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
        <CheckCheck className="size-3" />
        Delivered
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
      <Check className="size-3" />
      Sent
    </span>
  );
}
