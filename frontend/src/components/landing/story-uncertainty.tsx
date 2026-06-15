"use client";

import { StoryScene } from "@/components/landing/story-scene";

export function StoryUncertainty() {
  return (
    <StoryScene id="story-uncertainty">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium" style={{ color: "var(--lavender-hover)" }}>
          The moment
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Finding care isn&apos;t hard. Explaining symptoms is.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          You&apos;re in an unfamiliar city, unsure what medicine is called, and
          every minute of confusion makes a small problem feel bigger.
        </p>
      </div>
    </StoryScene>
  );
}
