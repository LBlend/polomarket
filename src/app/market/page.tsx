import type { Metadata } from "next";
import BettingMarket from "@/components/BettingMarket";

export const metadata: Metadata = {
  title: "Market — Polomarket Mongol Rally",
  description: "Bet on the outcome of Mongol Rally 2026 with rimcoins. All for charity.",
};

export default function MarketPage() {
  return (
    <div className="min-h-screen pt-16">
      <BettingMarket />
    </div>
  );
}
