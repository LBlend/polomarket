import type { Metadata } from "next";
import { Suspense } from "react";
import { ExternalLink, Users, TrendingUp } from "lucide-react";
import SpleisPolls from "@/components/SpleisPolls";

const SPLEIS_URL = "https://www.spleis.no/project/494404";
const GOAL_KR = 49999;

export const metadata: Metadata = {
  title: "Market | Team Polomarket Mongol Rally",
  description: "Follow the predictions and donate to vote on the outcome of Mongol Rally 2026.",
};

async function fetchStats() {
  try {
    const res = await fetch(
      "https://www.spleis.no/api/public/project/ids/collected-amount?projectIds=494404",
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json() as Promise<{ totalCollected: number; giverCount: number }>;
  } catch {
    return null;
  }
}

export default async function MarketPage() {
  const stats = await fetchStats();
  const raised = stats?.totalCollected ?? 0;
  const donors = stats?.giverCount ?? 0;
  const pct = Math.min((raised / GOAL_KR) * 100, 100);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-rally-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="pt-12 pb-10 text-center">
          <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            Betting for charity
          </p>
          <h1 className="text-6xl sm:text-8xl font-display tracking-widest text-white mb-4">
            THE MARKET
          </h1>
          <p className="text-neutral-400 max-w-lg mx-auto mb-8">
            Donate on Spleis to cast your vote. The more you put on an option, the stronger your bet.
          </p>
          <a
            href={SPLEIS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-full transition-colors"
          >
            Donate &amp; Vote on Spleis
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Fundraising progress */}
        <div className="bg-rally-card border border-rally-border rounded-2xl p-6 mb-10">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Users size={14} />
              {donors.toLocaleString("nb-NO")} donor{donors !== 1 ? "s" : ""}
            </span>
            <span className="text-white font-semibold tabular-nums">
              {raised.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} / {GOAL_KR.toLocaleString("nb-NO")} kr
            </span>
          </div>
          <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-500 rounded-full transition-all duration-700"
              style={{ width: `${pct > 0 ? Math.max(pct, 1) : 0}%` }}
            />
          </div>
          {raised === 0 && (
            <p className="text-xs text-neutral-600 mt-3 text-center">No donations yet — be the first!</p>
          )}
        </div>

        {/* Predictions */}
        <div>
          <h2 className="text-xl font-display tracking-wider text-white mb-5 flex items-center gap-2">
            <TrendingUp size={18} className="text-gold-500" />
            Predictions
          </h2>
          <Suspense fallback={<PollsSkeleton />}>
            <SpleisPolls />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function PollsSkeleton() {
  return (
    <div className="space-y-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-rally-card border border-rally-border rounded-2xl p-6 animate-pulse">
          <div className="h-5 bg-neutral-800 rounded w-3/4 mb-5" />
          <div className="space-y-3">
            {[0, 1, 2].map((j) => <div key={j} className="h-8 bg-neutral-800 rounded" />)}
          </div>
        </div>
      ))}
    </div>
  );
}
