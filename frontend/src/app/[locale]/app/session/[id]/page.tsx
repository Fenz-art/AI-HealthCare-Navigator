"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { CommandCenterLayout } from "@/components/product/command-center-layout";
import type { TravelHealthSession } from "@/lib/types";

export default function SessionCommandCenterPage() {
  const params = useParams<{ id: string; locale: string }>();
  const [session, setSession] = useState<TravelHealthSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const data = await api.getSession(params.id);
        setSession(data);
      } catch (err) {
        setError(
          err instanceof ApiClientError ? err.message : "Unable to load session."
        );
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div
        className="lifted-panel mx-auto max-w-sm rounded-md p-6 text-center"
        style={{ background: "var(--surface-1)" }}
      >
        <p className="text-[15px] font-semibold" style={{ color: "var(--ink)" }}>Session unavailable</p>
        <p className="mt-1.5 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
          {error ?? "Session not found."}
        </p>
      </div>
    );
  }

  return <CommandCenterLayout session={session} locale={params.locale} />;
}
