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
  metadataBase: new URL("https://teampolomarket.com"),
  title: "Team Polomarket | Mongol Rally 2026",
  description: "Follow 4 fat dudes driving from Oslo to Oskemen in the Mongol Rally 2026 in their Tjukk Tuk. Live tracking and betting on events, all for charity.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Team Polomarket | Mongol Rally 2026",
    description: "Follow 4 fat dudes driving from Oslo to Oskemen in the Mongol Rally 2026 in their Tjukk Tuk. Live tracking and betting on events, all for charity.",
    type: "website",
    images: [{ url: "/og-image.png", width: 144, height: 144 }],
  },
  twitter: {
    card: "summary",
    images: ["/og-image.png"],
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
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-rally-border bg-rally-dark py-10 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-600">
              <span className="font-display tracking-widest text-gold-700">TEAM POLOMARKET</span>
              <span>Mongol Rally 2026 | Oslo → <s>Ulaanbaatar</s> Oskemen</span>
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
