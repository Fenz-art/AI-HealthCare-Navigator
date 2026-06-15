"use client";

import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { ProviderAgent } from "@/components/provider/provider-agent";

export default function ProviderAgentPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  const role = session?.user?.role as "DOCTOR" | "PHARMACIST" | "MEDICAL_ASSISTANT" | undefined;
  return <ProviderAgent role={role} />;
}
