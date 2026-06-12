import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const FOOTER_LINKS = {
  Product: [
    { label: "How it works", href: "/how-it-works" },
    { label: "Features", href: "/features" },
    { label: "Use cases", href: "/use-cases" },
    { label: "Start session", href: "/app/session/new" },
  ],
  Platforms: [
    { label: "Web", href: "/app/session/new" },
    { label: "Interpreter", href: "/app/interpreter" },
    { label: "Health vault", href: "/app/vault" },
    { label: "Agent · ⌘K", href: "/app" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/about" },
    { label: "Changelog", href: "/about" },
  ],
  Legal: [
    { label: "Privacy", href: "/about" },
    { label: "Terms", href: "/about" },
    { label: "AI disclosure", href: "/about" },
  ],
};

type MarketingFooterProps = {
  locale: string;
};

export function MarketingFooter({ locale }: MarketingFooterProps) {
  return (
    <footer className="border-t mk-hairline">
      <section className="border-b mk-hairline px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-[var(--mk-text-secondary)]">
            Free session. No card. Upgrade when it sticks.
          </p>
          <h2 className="mk-headline mt-4">
            Get your next care decision off your plate tonight.
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={`/${locale}/app/session/new`} className="mk-btn-primary">
              Get started
            </Link>
            <Link href={`/${locale}/features`} className="mk-btn-outline">
              See features
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-[var(--mk-text-secondary)]">
              Healthcare navigation for travelers. Guidance, not diagnosis.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-semibold text-[var(--mk-text)]">{title}</p>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-sm text-[var(--mk-text-secondary)] transition-colors hover:text-[var(--mk-text)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row mk-hairline">
          <p className="text-xs text-[var(--mk-text-tertiary)]">
            © 2026 CareCompass. All rights reserved.
          </p>
          <a
            href="mailto:hello@carecompass.health"
            className="text-xs text-[var(--mk-text-tertiary)] hover:text-[var(--mk-text-secondary)]"
          >
            hello@carecompass.health
          </a>
        </div>
      </div>
    </footer>
  );
}
