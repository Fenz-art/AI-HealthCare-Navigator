import Link from "next/link";
import { Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const emergencyNumbers = [
  { region: "United States", number: "911" },
  { region: "United Kingdom", number: "999" },
  { region: "European Union", number: "112" },
  { region: "Japan", number: "119" },
  { region: "India", number: "112" },
  { region: "Australia", number: "000" },
];

export default function EmergencyPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[var(--compass-emergency)] p-6 text-white">
        <h1 className="text-3xl font-semibold">Emergency</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/90">
          If you are in immediate danger, call local emergency services now.
          CareCompass is navigation support — not a substitute for emergency care.
        </p>
        <a
          href="tel:112"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-6 h-12 w-full bg-white text-[var(--compass-emergency)] hover:bg-white/90"
          )}
        >
          <Phone className="size-4" />
          Call emergency services
        </a>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Local emergency numbers</CardTitle>
          <CardDescription>Common numbers for travelers abroad.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyNumbers.map((item) => (
            <div
              key={item.region}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
            >
              <span className="text-sm font-medium">{item.region}</span>
              <span className="text-lg font-semibold text-[var(--compass-emergency)]">
                {item.number}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Link
        href="/app/session/new"
        className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
      >
        Start a non-emergency session
      </Link>
    </div>
  );
}
