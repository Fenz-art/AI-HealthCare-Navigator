"use client";

import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { PharmacistDashboard } from "@/components/dashboards/pharmacist-dashboard";

export default function PharmacistWorkspacePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  return <PharmacistDashboard />;
}
