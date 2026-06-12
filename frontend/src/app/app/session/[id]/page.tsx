"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { CommandCenterLayout } from "@/components/product/command-center-layout";
import type { TravelHealthSession } from "@/lib/types";

export default function SessionCommandCenterPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<TravelHealthSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    router.replace(`/en/app/session/${params.id}`);
  }, [params.id, router]);

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
        <Loader2 className="size-8 animate-spin text-[var(--cc-pharmacy)]" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="cc-panel text-center">
        <p className="font-display text-lg font-bold">Redirecting…</p>
      </div>
    );
  }

  return <CommandCenterLayout session={session} locale="en" />;
}
