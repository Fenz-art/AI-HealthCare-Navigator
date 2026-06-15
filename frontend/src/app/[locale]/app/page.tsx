"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { PatientDashboard } from "@/components/dashboards/patient-dashboard";
import { MedicalAssistantDashboard } from "@/components/dashboards/medical-assistant-dashboard";
import { PharmacistDashboard } from "@/components/dashboards/pharmacist-dashboard";
import { DoctorDashboard } from "@/components/dashboards/doctor-dashboard";
import type { UserRole } from "@/stores/onboarding-store";

export default function AppHomePage() {
  const { locale } = useParams() as { locale: string };
  const router = useRouter();
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
          if (!user.onboardingComplete) {
            router.push(`/${locale}/app/onboarding`);
            return;
          }
        }
      } catch {
        // If API fails, let them through
      }
      setChecking(false);
    }

    checkOnboarding();
  }, [session, status, locale, router]);

  if (checking || status === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  const role = session?.user?.role as UserRole | undefined;

  switch (role) {
    case "MEDICAL_ASSISTANT":
    case "CLINIC_STAFF":
    case "HOSPITAL_STAFF":
      return <MedicalAssistantDashboard />;
    case "PHARMACIST":
      return <PharmacistDashboard />;
    case "DOCTOR":
      return <DoctorDashboard />;
    case "PATIENT":
    default:
      return <PatientDashboard />;
  }
}
