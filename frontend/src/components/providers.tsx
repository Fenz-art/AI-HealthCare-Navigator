"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // next-auth v5 beta derives the session URL from the current page path
  // in the browser, which causes it to prefix the locale (/en/api/auth/session).
  // Passing an absolute basePath anchors the fetch to the correct origin.
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  return (
    <SessionProvider basePath={`${baseUrl}/api/auth`}>
      {children}
    </SessionProvider>
  );
}
