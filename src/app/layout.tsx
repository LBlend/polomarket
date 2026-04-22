import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Polomarket — Mongol Rally 2026",
  description: "Follow team Polomarket on the Mongol Rally 2026 — from Oslo to Ulaanbaatar in Tjukk Tuk. Live GPS tracking, rimcoin betting and more.",
  openGraph: {
    title: "Polomarket — Mongol Rally 2026",
    description: "Live tracking, rimcoin betting, all for charity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              <span className="font-display tracking-widest text-gold-700">POLOMARKET</span>
              <span>Mongol Rally 2026 — Oslo → Ulaanbaatar</span>
              <span>All proceeds to charity</span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
