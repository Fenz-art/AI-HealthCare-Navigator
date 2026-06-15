"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Stethoscope,
  User,
  Languages,
  Volume2,
  ArrowRightLeft,
  Clock,
  MessageCircle,
  BrainCircuit,
  Pill,
  AlertTriangle,
  Activity,
  Loader2,
  Sparkles,
  X,
  Play,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TranscriptEntry = {
  id: string;
  role: "patient" | "provider" | "system";
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: string;
};

type MedicalContext = {
  allergies: string[];
  medications: string[];
  conditions: string[];
  vaccinations: string[];
};

export default function LiveInterpreterPage() {
  const { locale } = useParams() as { locale: string };

  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speaker, setSpeaker] = useState<"patient" | "provider">("patient");
  const [transcriptEntries, setTranscriptEntries] = useState<TranscriptEntry[]>([]);
  const [interpreterSessionId, setInterpreterSessionId] = useState<string | null>(null);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState("Vietnamese");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [contextSources, setContextSources] = useState<string[]>([]);
  const [contextOpen, setContextOpen] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom on new entries
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptEntries]);

  // Elapsed timer
  useEffect(() => {
    if (sessionRunning) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [sessionRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startSession = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/interpreter/process-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64: "",
          direction: "patientToProvider",
          userId: "placeholder",
          startNewSession: true,
          sourceLanguage,
          targetLanguage,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setInterpreterSessionId(data.interpreterSessionId);
      setSessionRunning(true);
      setElapsed(0);
      setTranscriptEntries([]);
    } catch (err) {
      setError("Failed to start interpreter session.");
    }
  }, [sourceLanguage, targetLanguage]);

  const endSession = useCallback(async () => {
    if (!interpreterSessionId) return;
    try {
      await fetch(`/api/interpreter-sessions/${interpreterSessionId}/end`, {
        method: "POST",
      });
    } catch (e) {
      console.warn("Failed to end session:", e);
    }
    setSessionRunning(false);
    setInterpreterSessionId(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [interpreterSessionId]);

  const startRecording = async () => {
    setError("");
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsActive(false);
        setIsProcessing(true);

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);

        reader.onloadend = async () => {
          try {
            const base64Audio = (reader.result as string).split(",")[1];
            if (!base64Audio || base64Audio.length < 100) {
              setIsProcessing(false);
              return;
            }

            const direction = speaker === "patient" ? "patientToProvider" : "providerToPatient";

            const res = await fetch("/api/interpreter/process-audio", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                audioBase64: base64Audio,
                direction,
                interpreterSessionId,
                userId: "placeholder",
                sourceLanguage,
                targetLanguage,
              }),
            });

            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data = await res.json();
            if (data.interpreterSessionId && !interpreterSessionId) {
              setInterpreterSessionId(data.interpreterSessionId);
            }
            if (data.contextSources) {
              setContextSources(data.contextSources);
            }

            const entry: TranscriptEntry = {
              id: crypto.randomUUID(),
              role: speaker,
              originalText: data.transcript,
              translatedText: data.translatedText,
              sourceLanguage: data.sourceLanguage || sourceLanguage,
              targetLanguage: data.targetLanguage || targetLanguage,
              timestamp: new Date().toISOString(),
            };
            setTranscriptEntries((prev) => [...prev, entry]);

            if (data.audioBase64) {
              try {
                const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
                audio.play().catch((e) => console.warn("Could not play audio:", e));
              } catch (e) {
                console.warn("Audio playback failed:", e);
              }
            }
          } catch (err) {
            console.error("Processing error:", err);
            setError("Failed to process audio.");
          } finally {
            setIsProcessing(false);
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((t) => t.stop());
            }
          }
        };
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsActive(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isActive) {
      mediaRecorderRef.current.stop();
    }
  };

  const patientEntries = transcriptEntries.filter((e) => e.role === "patient");
  const providerEntries = transcriptEntries.filter((e) => e.role === "provider");

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
            Sprint 7
          </p>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>
            Live Interpreter
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
            Continuous bidirectional interpretation with full medical context.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {contextSources.length > 0 && (
            <button
              type="button"
              onClick={() => setContextOpen(!contextOpen)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors"
              style={{
                background: contextOpen ? "var(--lavender-muted)" : "var(--surface-3)",
                color: "var(--lavender)",
                border: "1px solid var(--hairline)",
              }}
            >
              <BrainCircuit className="size-3" />
              Context ({contextSources.length})
            </button>
          )}
          <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium" style={{
            background: "var(--surface-3)", color: "var(--ink-muted)", border: "1px solid var(--hairline)",
          }}>
            <Languages className="size-3" />
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="bg-transparent outline-none"
              style={{ color: "var(--ink)" }}
            >
              <option value="Vietnamese">Vietnamese</option>
              <option value="Spanish">Spanish</option>
              <option value="Portuguese">Portuguese</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Japanese">Japanese</option>
              <option value="Hindi">Hindi</option>
              <option value="Arabic">Arabic</option>
            </select>
            <ArrowRightLeft className="size-3" style={{ color: "var(--ink-tertiary)" }} />
            <span style={{ color: "var(--lavender)" }}>{targetLanguage}</span>
          </div>
        </div>
      </div>

      {/* Context Panel (expandable) */}
      <AnimatePresence>
        {contextOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
          >
            <div className="grid grid-cols-2 gap-4 p-4">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--ink-tertiary)" }}>
                  <AlertTriangle className="inline size-3 mr-1" />
                  Known Allergies
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Penicillin", "Sulfa", "Latex"].map((a) => (
                    <span key={a} className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                      style={{ background: "rgba(255,77,79,0.08)", color: "var(--cc-emergency)", border: "1px solid rgba(255,77,79,0.15)" }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--ink-tertiary)" }}>
                  <Pill className="inline size-3 mr-1" />
                  Known Medications
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg"].map((m) => (
                    <span key={m} className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                      style={{ background: "rgba(94,106,210,0.08)", color: "var(--lavender)", border: "1px solid rgba(94,106,210,0.15)" }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--ink-tertiary)" }}>
                  <Activity className="inline size-3 mr-1" />
                  Known Conditions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Type 2 Diabetes", "Hypertension", "Asthma"].map((c) => (
                    <span key={c} className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                      style={{ background: "rgba(255,193,7,0.08)", color: "#FFC107", border: "1px solid rgba(255,193,7,0.15)" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--ink-tertiary)" }}>
                  <Sparkles className="inline size-3 mr-1" />
                  Context Sources
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {contextSources.map((s) => (
                    <span key={s} className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                      style={{ background: "rgba(94,106,210,0.08)", color: "var(--lavender)", border: "1px solid rgba(94,106,210,0.15)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main workspace */}
      <div
        className="flex flex-1 overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
      >
        {/* Patient Transcript Panel */}
        <div className="flex w-72 flex-col" style={{ borderRight: "1px solid var(--hairline)" }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
            <User className="size-3.5" style={{ color: "var(--lavender)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
              Patient
            </p>
            <span className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-mono" style={{ background: "var(--surface-3)", color: "var(--ink-muted)" }}>
              {sourceLanguage}
            </span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3" ref={scrollRef}>
            {patientEntries.length === 0 && (
              <p className="text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
                Patient speech will appear here...
              </p>
            )}
            {patientEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg p-3 text-[13px] leading-relaxed"
                style={{ background: "rgba(94,106,210,0.06)", border: "1px solid rgba(94,106,210,0.1)" }}
              >
                {entry.originalText}
              </div>
            ))}
            {isProcessing && speaker === "patient" && (
              <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
                <Loader2 className="size-3 animate-spin" /> Processing...
              </div>
            )}
          </div>
        </div>

        {/* Translated Transcript Panel (center) */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
            <Languages className="size-3.5" style={{ color: "var(--lavender-hover)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
              Translation
            </p>
            <span className="ml-auto flex items-center gap-2">
              {sessionRunning && (
                <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--semantic-green)" }}>
                  <span className="inline-block size-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              )}
              <span className="rounded px-1.5 py-0.5 text-[10px] font-mono" style={{ background: "var(--surface-3)", color: "var(--ink-muted)" }}>
                {sessionRunning ? formatTime(elapsed) : "—"}
              </span>
            </span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {transcriptEntries.length === 0 && (
              <p className="text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
                Translations will appear in sequence...
              </p>
            )}
            {transcriptEntries.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{ background: entry.role === "patient" ? "var(--lavender-muted)" : "rgba(255,193,7,0.15)" }}>
                  {entry.role === "patient" ? (
                    <User className="size-3" style={{ color: "var(--lavender)" }} />
                  ) : (
                    <Stethoscope className="size-3" style={{ color: "#FFC107" }} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: entry.role === "patient" ? "var(--lavender)" : "#FFC107" }}>
                      {entry.role === "patient" ? sourceLanguage : targetLanguage}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-relaxed" style={{ color: "var(--ink)" }}>
                    {entry.translatedText}
                  </p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
                <Loader2 className="size-3 animate-spin" /> Translating...
              </div>
            )}
          </div>
        </div>

        {/* Provider Transcript Panel */}
        <div className="flex w-72 flex-col" style={{ borderLeft: "1px solid var(--hairline)" }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
            <Stethoscope className="size-3.5" style={{ color: "#FFC107" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
              Provider
            </p>
            <span className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-mono" style={{ background: "var(--surface-3)", color: "var(--ink-muted)" }}>
              {targetLanguage}
            </span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {providerEntries.length === 0 && (
              <p className="text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
                Provider speech will appear here...
              </p>
            )}
            {providerEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg p-3 text-[13px] leading-relaxed"
                style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.12)" }}
              >
                {entry.originalText}
              </div>
            ))}
            {isProcessing && speaker === "provider" && (
              <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
                <Loader2 className="size-3 animate-spin" /> Processing...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div
        className="flex items-center justify-between rounded-2xl border px-5 py-3"
        style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
      >
        {/* Speaker toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded p-0.5" style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)" }}>
            {(["patient", "provider"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeaker(s)}
                className="flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium capitalize transition-colors"
                style={{
                  background: speaker === s ? "var(--surface-4)" : "transparent",
                  color: speaker === s ? "var(--ink)" : "var(--ink-tertiary)",
                }}
              >
                {s === "patient" ? <User className="size-3" /> : <Stethoscope className="size-3" />}
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* PTT Button */}
        <div className="flex items-center gap-4">
          {!sessionRunning ? (
            <button
              type="button"
              onClick={startSession}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all"
              style={{
                background: "var(--lavender)",
                color: "var(--inverse-ink)",
              }}
            >
              <Play className="size-4" />
              Start Session
            </button>
          ) : (
            <>
              <motion.button
                type="button"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                whileTap={{ scale: 0.95 }}
                disabled={isProcessing}
                className="flex h-14 w-14 items-center justify-center rounded-full transition-all"
                style={{
                  background: isActive ? "var(--lavender)" : "var(--surface-3)",
                  border: `1px solid ${isActive ? "var(--lavender)" : "var(--hairline-strong)"}`,
                  boxShadow: isActive ? "0 0 0 6px var(--lavender-muted)" : "none",
                  color: isActive ? "var(--inverse-ink)" : "var(--ink-subtle)",
                }}
              >
                {isProcessing ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : isActive ? (
                  <Mic className="size-5" />
                ) : (
                  <MicOff className="size-5" />
                )}
              </motion.button>
              <div className="text-center">
                <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                  {isActive ? `Recording ${speaker}...` : "Hold to speak"}
                </p>
              </div>
              <button
                type="button"
                onClick={endSession}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all"
                style={{
                  background: "rgba(255,77,79,0.1)",
                  color: "var(--cc-emergency)",
                  border: "1px solid rgba(255,77,79,0.2)",
                }}
              >
                <Square className="size-3" />
                End
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
          <span className="flex items-center gap-1">
            <MessageCircle className="size-3" />
            {transcriptEntries.length} exchanges
          </span>
          {sessionRunning && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatTime(elapsed)}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl p-3 text-[12px]" style={{
          background: "rgba(255,77,79,0.08)", border: "1px solid rgba(255,77,79,0.2)", color: "var(--cc-emergency)",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
