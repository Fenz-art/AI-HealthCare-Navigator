import { StoryCard } from "@/components/product/story-card";

const CASES = [
  {
    title: "Food poisoning in Tokyo",
    body: "Severity routes to pharmacy. Local brands mapped. Interpreter ready in Japanese.",
  },
  {
    title: "Cold in Bangkok",
    body: "Self-care mode — calm guidance without unnecessary clinic visits.",
  },
  {
    title: "Medication refill in Brazil",
    body: "Active ingredient lookup finds local equivalents at nearby pharmacies.",
  },
  {
    title: "Lost prescription in Germany",
    body: "Health vault documents translated for the clinic visit.",
  },
  {
    title: "Language barrier in Japan",
    body: "Push-to-talk interpreter with medical context always visible.",
  },
];

export default function UseCasesPage() {
  return (
    <StoryCard label="Use cases" title="How travelers use CareCompass">
      <div className="grid gap-4 sm:grid-cols-2">
        {CASES.map((c) => (
          <article key={c.title} className="cc-panel">
            <h3 className="font-display font-bold">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--cc-text-secondary)]">
              {c.body}
            </p>
          </article>
        ))}
      </div>
    </StoryCard>
  );
}
