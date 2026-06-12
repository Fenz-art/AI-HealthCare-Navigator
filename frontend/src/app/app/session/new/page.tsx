"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Sparkles } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { COMMON_SYMPTOMS, WORKFLOW_STAGES } from "@/lib/constants";
import { useSessionStore } from "@/stores/sessionStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function NewSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [workflowStage, setWorkflowStage] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [medInput, setMedInput] = useState("");

  const {
    location,
    countryCode,
    lat,
    lng,
    symptoms,
    allergies,
    currentMeds,
    duration,
    setLocation,
    setCoordinates,
    toggleSymptom,
    toggleAllergy,
    addCurrentMed,
    removeCurrentMed,
    setDuration,
    setSessionId,
  } = useSessionStore();

  async function detectLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not available in this browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates(position.coords.latitude, position.coords.longitude);
        if (!location) {
          setLocation("Current location", countryCode);
        }
        setLoading(false);
      },
      () => {
        setError("Unable to detect location. Enter it manually.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleAnalyze() {
    if (symptoms.length === 0) {
      setError("Select at least one symptom.");
      return;
    }

    if (lat == null || lng == null) {
      setError("Location is required. Detect or confirm your coordinates.");
      return;
    }

    setError(null);
    setLoading(true);
    setWorkflowStage(0);

    try {
      const session = await api.createSession({
        symptoms,
        allergies,
        currentMeds,
        duration: duration || undefined,
        location: location || "Current location",
        countryCode,
        lat,
        lng,
      });

      setSessionId(session.id);

      for (let i = 0; i < WORKFLOW_STAGES.length; i++) {
        setWorkflowStage(i);
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      await api.runWorkflow({
        sessionId: session.id,
        lat,
        lng,
        countryCode,
      });

      router.push(`/app/session/${session.id}`);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
      setWorkflowStage(-1);
    } finally {
      setLoading(false);
    }
  }

  if (workflowStage >= 0) {
    const progress = ((workflowStage + 1) / WORKFLOW_STAGES.length) * 100;

    return (
      <div className="flex flex-1 flex-col justify-center py-8">
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="px-0 text-center">
            <CardTitle className="text-2xl">Analyzing your situation</CardTitle>
            <CardDescription>
              Building your personalized navigation plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-0">
            <Progress value={progress} className="h-2" />
            <ul className="space-y-3">
              {WORKFLOW_STAGES.map((stage, index) => (
                <li
                  key={stage}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                    index <= workflowStage
                      ? "border-[var(--compass-teal)]/30 bg-accent text-foreground"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {index < workflowStage ? (
                    <Sparkles className="size-4 text-[var(--compass-teal)]" />
                  ) : index === workflowStage ? (
                    <Loader2 className="size-4 animate-spin text-[var(--compass-teal)]" />
                  ) : (
                    <span className="size-4 rounded-full border border-border" />
                  )}
                  {stage}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--compass-teal)]">
          Step {step + 1} of 4
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Start a care session</h1>
        <p className="mt-2 text-muted-foreground">
          Tell us where you are and how you feel. We will guide your next step.
        </p>
      </div>

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="size-5 text-[var(--compass-teal)]" />
              Location
            </CardTitle>
            <CardDescription>
              We use your location to find nearby pharmacies and clinics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Where are you?</Label>
              <Input
                id="location"
                placeholder="e.g. Tokyo, Japan"
                value={location}
                onChange={(e) => setLocation(e.target.value, countryCode)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country code</Label>
              <Input
                id="country"
                placeholder="JP"
                value={countryCode}
                onChange={(e) =>
                  setLocation(location, e.target.value.toUpperCase())
                }
                maxLength={2}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={detectLocation}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MapPin className="size-4" />
              )}
              Detect my location
            </Button>
            {lat != null && lng != null ? (
              <p className="text-xs text-muted-foreground">
                Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
              </p>
            ) : null}
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Symptoms</CardTitle>
            <CardDescription>Tap everything that applies right now.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((symptom) => {
                const active = symptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional information</CardTitle>
            <CardDescription>Allergies, medications, and duration help us guide you safely.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>How long have you felt this way?</Label>
              <Input
                placeholder="e.g. 2 days"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Allergies</Label>
              <div className="flex flex-wrap gap-2">
                {["Penicillin", "Peanuts", "Latex", "None known"].map((allergy) => (
                  <Badge
                    key={allergy}
                    variant={allergies.includes(allergy) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1.5"
                    onClick={() => toggleAllergy(allergy)}
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Current medications</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add medication"
                  value={medInput}
                  onChange={(e) => setMedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && medInput.trim()) {
                      addCurrentMed(medInput.trim());
                      setMedInput("");
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (medInput.trim()) {
                      addCurrentMed(medInput.trim());
                      setMedInput("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentMeds.map((med) => (
                  <Badge
                    key={med}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeCurrentMed(med)}
                  >
                    {med} ×
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ready to analyze</CardTitle>
            <CardDescription>
              We will assess severity, find local options, and prepare translation support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Location:</span>{" "}
              {location || "Not set"}
            </p>
            <p>
              <span className="font-medium">Symptoms:</span>{" "}
              {symptoms.join(", ") || "None selected"}
            </p>
            <p>
              <span className="font-medium">Allergies:</span>{" "}
              {allergies.join(", ") || "None"}
            </p>
            <Textarea
              readOnly
              className="min-h-24 resize-none bg-muted/40"
              value="CareCompass provides navigation guidance only. It does not diagnose or prescribe. If you are in immediate danger, call local emergency services."
            />
          </CardContent>
        </Card>
      )}

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setStep((value) => value - 1)}
            disabled={loading}
          >
            Back
          </Button>
        ) : null}
        {step < 3 ? (
          <Button
            type="button"
            className="flex-1 bg-[var(--compass-teal)] text-white hover:bg-[color-mix(in_srgb,var(--compass-teal),black_8%)]"
            onClick={() => setStep((value) => value + 1)}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1 bg-[var(--compass-teal)] text-white hover:bg-[color-mix(in_srgb,var(--compass-teal),black_8%)]"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Analyze my situation
          </Button>
        )}
      </div>
    </div>
  );
}
