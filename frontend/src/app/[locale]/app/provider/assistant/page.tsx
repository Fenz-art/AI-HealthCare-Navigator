"use client";

import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { MedicalAssistantDashboard } from "@/components/dashboards/medical-assistant-dashboard";

export default function AssistantWorkspacePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  return <MedicalAssistantDashboard />;
}
