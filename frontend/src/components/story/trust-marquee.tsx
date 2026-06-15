"use client";

const COUNTRIES = [
  "Japan",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Brazil",
  "India",
  "Thailand",
  "Australia",
  "UAE",
  "South Korea",
  "Mexico",
  "Spain",
  "Italy",
  "Sweden",
];

export function TrustMarquee() {
  return (
    <section className="border-y py-14" style={{ borderColor: "var(--hairline)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-sm" style={{ color: "var(--ink-tertiary)" }}>
          Where CareCompass travelers have found care.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {COUNTRIES.map((country) => (
            <span
              key={country}
              className="text-sm font-medium tracking-tight transition-colors duration-200"
              style={{ color: "var(--ink-subtle)" }}
            >
              {country}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
