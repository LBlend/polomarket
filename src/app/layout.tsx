import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import UmamiAnalytics from "@/components/UmamiAnalytics";
import { getAnalyticsConfig } from "@/lib/analyticsConfig";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Team Polomarket — Mongol Rally 2026",
  description: "Follow Team Polomarket on the Mongol Rally 2026 — from Oslo to Ulaanbaatar in Tjukk Tuk. Live GPS tracking, rimcoin betting and more.",
  openGraph: {
    title: "Team Polomarket — Mongol Rally 2026",
    description: "Live tracking, rimcoin betting, all for charity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const analyticsConfig = getAnalyticsConfig();

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <div className="fixed top-0 inset-x-0 z-[60] w-full bg-amber-950/80 backdrop-blur-sm border-b border-amber-800/50 text-amber-300 text-xs text-center py-1.5 px-4 tracking-wide">
            🚧 This site is under development — things may be broken or change without notice.
          </div>
          <div className="h-7" />
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-rally-border bg-rally-dark py-10 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-600">
              <span className="font-display tracking-widest text-gold-700">TEAM POLOMARKET</span>
              <span>Mongol Rally 2026 — Oslo → Ulaanbaatar</span>
              <span>All proceeds to charity</span>
            </div>
          </footer>
        </Providers>
        {analyticsConfig?.enabled && (
          <UmamiAnalytics
            websiteId={analyticsConfig.websiteId}
            src={analyticsConfig.src}
            domains={analyticsConfig.domains}
          />
        )}
      </body>
    </html>
  );
}
