import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CareCompass — Healthcare navigation for travelers",
    template: "%s · CareCompass",
  },
  description:
    "Find medication, find care, break language barriers — anywhere. Navigation, not diagnosis.",
  applicationName: "CareCompass",
};

export const viewport: Viewport = {
  themeColor: "#010102",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistMono.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full bg-[var(--canvas)] text-[var(--ink)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
