"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Maximize2 } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { InterpreterResponse } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function InterpreterPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<InterpreterResponse | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInterpreter() {
      try {
        const response = await api.getInterpreter(params.id);
        setData(response);
      } catch (err) {
        setError(
          err instanceof ApiClientError ? err.message : "Unable to load interpreter."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInterpreter();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[var(--compass-teal)]" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-destructive">{error ?? "Interpreter unavailable."}</p>;
  }

  return (
    <div
      className={cn(
        "space-y-4",
        fullscreen && "fixed inset-0 z-[60] overflow-auto bg-background p-4 pb-24"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/app/session/${params.id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFullscreen((value) => !value)}
        >
          <Maximize2 className="size-4" />
          {fullscreen ? "Exit fullscreen" : "Fullscreen"}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
      <Card className="card-elevated border-none">
        <CardHeader>
          <CardTitle className="text-xl">Show to pharmacist or provider</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <section className="surface-card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              English
            </p>
            <p className="text-base leading-relaxed whitespace-pre-line">
              {data.interpreterContextEnglish}
            </p>
          </section>
          <section className="rounded-2xl border-2 border-[var(--compass-teal)]/30 bg-accent/60 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--compass-teal)]">
              {data.targetLanguage}
            </p>
            <p className="text-base leading-relaxed whitespace-pre-line">
              {data.interpreterContextTranslated}
            </p>
          </section>
        </CardContent>
      </Card>
      </motion.div>

      <Button
        size="lg"
        className="h-14 w-full rounded-full text-base bg-[var(--compass-teal)] text-white hover:bg-[color-mix(in_srgb,var(--compass-teal),black_8%)]"
      >
        Show to pharmacist
      </Button>
    </div>
  );
}
