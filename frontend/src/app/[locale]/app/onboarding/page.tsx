"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { OnboardingEngine } from "@/components/onboarding/onboarding-engine";

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const { data: session, status } = useSession();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push(`/${locale}/login`);
      return;
    }

    async function checkOnboarding() {
      try {
        const res = await fetch("/api/users/profile");
        if (res.ok) {
          const user = await res.json();
          if (user.onboardingComplete) {
            router.push(`/${locale}/app`);
            return;
          }
        }
      } catch {
        // If API fails, let them through onboarding
      }
      setChecking(false);
    }

    checkOnboarding();
  }, [session, status, locale, router]);

  if (checking || status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "var(--canvas)" }}>
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  return <OnboardingEngine />;
}
