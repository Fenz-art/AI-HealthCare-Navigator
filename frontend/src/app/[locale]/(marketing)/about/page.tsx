import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="mk-label mb-3">Our Mission</p>
      <h1 className="mk-headline">Navigation, not diagnosis.</h1>
      <div className="mt-8 space-y-6 text-lg leading-relaxed text-[var(--mk-text-secondary)]">
        <p>
          CareCompass is a healthcare navigation operating system designed for global travelers.
          When you get sick in an unfamiliar place, the hardest part is rarely the illness itself — 
          it is not knowing where to turn, what to ask for, or how to explain it.
        </p>
        <p>
          We are not telemedicine. We do not sell insurance. We are not AI doctors.
          We help you understand your immediate next step: rest at your hotel, locate an OTC medication, 
          visit a local clinic, or get to a hospital.
        </p>
        <p>
          Every session feeds a global healthcare graph — mapping medication brand equivalents, provider distances, 
          and patient outcomes. We compound this data with every traveler we guide, building a trusted moat 
          of travel health memory that makes the world feel safer.
        </p>
      </div>
    </div>
  );
}
