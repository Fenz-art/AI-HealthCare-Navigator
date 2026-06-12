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
    <section className="border-y mk-hairline py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-sm text-[var(--mk-text-tertiary)]">
          Where CareCompass travelers have found care.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {COUNTRIES.map((country) => (
            <span
              key={country}
              className="font-display text-sm font-medium tracking-tight text-[var(--mk-text-tertiary)] transition-colors duration-200 hover:text-[var(--mk-text-secondary)]"
            >
              {country}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
