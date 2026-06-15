"use client";

import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { DoctorDashboard } from "@/components/dashboards/doctor-dashboard";

export default function DoctorWorkspacePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  return <DoctorDashboard />;
}
