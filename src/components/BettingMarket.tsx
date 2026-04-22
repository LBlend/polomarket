"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, TrendingUp, Trophy, Lock, ChevronDown, ChevronUp, Loader2, Info } from "lucide-react";
import { formatRimcoins } from "@/lib/utils";
import CharitySelector from "./CharitySelector";
import AuthModal from "./AuthModal";
import type { BettingEventData, CharityData } from "@/types";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "text-gold-400" },
  CLOSED: { label: "Closed", color: "text-neutral-500" },
  RESOLVED: { label: "Resolved", color: "text-neutral-500" },
};

function formatOdds(odds: number | null): string {
  if (odds === null) return "—";
  return `${odds.toFixed(2)}x`;
}

// Estimate payout if user bets `amount` on an option right now
function estimatePayout(amount: number, optionTotal: number, totalPool: number): number {
  const newPool = totalPool + amount;
  const newOptionTotal = optionTotal + amount;
  return (amount / newOptionTotal) * newPool;
}

function EventCard({
  event,
  userRimcoins,
  onBet,
  onLoginRequired,
}: {
  event: BettingEventData;
  userRimcoins: number;
  onBet: (eventId: string, optionId: string, amount: number) => Promise<void>;
  onLoginRequired: () => void;
}) {
  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [amount, setAmount] = useState("50");
  const [placing, setPlacing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");

  const status = STATUS_LABELS[event.status] ?? STATUS_LABELS.CLOSED;
  const canBet = event.status === "OPEN" && !event.userBet;
  const totalPool = event.totalPool;
  const totalBetCount = event.options.reduce((s, o) => s + o.betCount, 0);

  const handleBet = async () => {
    if (!session) { onLoginRequired(); return; }
    if (!selectedOption) { setError("Please select an option"); return; }
    const amt = Number(amount);
    if (!amt || amt <= 0) { setError("Invalid amount"); return; }
    if (amt > userRimcoins) { setError("Not enough rimcoins"); return; }
    setError("");
    setPlacing(true);
    await onBet(event.id, selectedOption, amt);
    setPlacing(false);
  };

  const selectedOpt = event.options.find((o) => o.id === selectedOption);
  const estimatedPayout = selectedOpt && Number(amount) > 0
    ? estimatePayout(Number(amount), selectedOpt.totalAmount, totalPool)
    : null;

  return (
    <motion.div
      layout
      className={`bg-rally-card border rounded-2xl overflow-hidden transition-colors ${
        event.status === "OPEN" ? "border-rally-border hover:border-neutral-600" : "border-rally-border opacity-75"
      }`}
    >
      {/* Header */}
      <button
        className="w-full text-left p-5 flex items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wider ${status.color}`}>
              {status.label}
            </span>
            {totalBetCount > 0 && (
              <span className="text-xs text-neutral-600">
                {totalBetCount} bet{totalBetCount !== 1 ? "s" : ""} · {formatRimcoins(totalPool)} pool
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-white leading-snug">{event.title}</h3>
          {event.description && (
            <p className="text-neutral-500 text-sm mt-1">{event.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {event.userBet && (
            <span className="text-xs bg-gold-500/15 text-gold-400 border border-gold-500/30 px-2 py-1 rounded-full">
              Bet placed
            </span>
          )}
          {expanded ? <ChevronUp size={16} className="text-neutral-500" /> : <ChevronDown size={16} className="text-neutral-500" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {/* Dynamic odds note */}
              {event.status === "OPEN" && totalPool === 0 && (
                <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-900 rounded-xl px-3 py-2">
                  <Info size={12} />
                  Odds update live as bets come in — be the first!
                </div>
              )}
              {event.status === "OPEN" && totalPool > 0 && (
                <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-900 rounded-xl px-3 py-2">
                  <Info size={12} />
                  Live odds — payouts shift as more bets are placed.
                </div>
              )}

              {event.options.map((option) => {
                const poolPct = totalPool > 0 ? (option.totalAmount / totalPool) * 100 : 0;
                const isUserChoice = event.userBet?.optionId === option.id;

                return (
                  <button
                    key={option.id}
                    disabled={!canBet}
                    onClick={() => canBet && setSelectedOption(option.id)}
                    className={`w-full text-left rounded-xl border-2 p-3 transition-all relative overflow-hidden ${
                      option.isWinner
                        ? "border-gold-500 bg-gold-500/10"
                        : selectedOption === option.id
                        ? "border-white/30 bg-white/5"
                        : isUserChoice
                        ? "border-neutral-500 bg-neutral-500/10"
                        : "border-rally-border bg-neutral-900 hover:border-neutral-600"
                    }`}
                  >
                    {/* Pool share bar */}
                    <div
                      className="absolute inset-y-0 left-0 bg-white/[0.04] transition-all duration-700"
                      style={{ width: `${poolPct}%` }}
                    />
                    <div className="relative flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {option.isWinner && <Trophy size={14} className="text-gold-400 shrink-0" />}
                        <span className={`text-sm font-semibold truncate ${option.isWinner ? "text-gold-300" : "text-white"}`}>
                          {option.label}
                        </span>
                        {isUserChoice && !option.isWinner && (
                          <span className="text-xs text-neutral-500 shrink-0">(your bet)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-sm font-bold tabular-nums ${option.isWinner ? "text-gold-400" : "text-gold-500"}`}>
                          {formatOdds(option.impliedOdds)}
                        </span>
                        <span className="text-xs text-neutral-600 w-8 text-right tabular-nums">
                          {poolPct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* User's existing bet */}
              {event.userBet && (
                <div className="bg-neutral-900 border border-rally-border rounded-xl p-3 text-sm space-y-1">
                  <div className="flex justify-between text-neutral-300">
                    <span>Your stake</span>
                    <span className="font-semibold">{formatRimcoins(event.userBet.amount)}</span>
                  </div>
                  {event.userBet.status === "WON" && event.userBet.payout != null && (
                    <div className="flex justify-between text-gold-400">
                      <span>Payout</span>
                      <span className="font-bold">{formatRimcoins(event.userBet.payout)}</span>
                    </div>
                  )}
                  {event.userBet.status === "LOST" && (
                    <p className="text-neutral-500 text-xs">This bet didn&apos;t win.</p>
                  )}
                  {event.userBet.status === "PENDING" && totalPool > 0 && (() => {
                    const opt = event.options.find((o) => o.id === event.userBet!.optionId);
                    if (!opt || opt.totalAmount === 0) return null;
                    const currentEst = (event.userBet.amount / opt.totalAmount) * totalPool;
                    return (
                      <div className="flex justify-between text-neutral-500 text-xs pt-1 border-t border-rally-border">
                        <span>Current est. payout</span>
                        <span>{formatRimcoins(currentEst)}</span>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Bet input */}
              {canBet && (
                <div className="space-y-3 pt-2 border-t border-rally-border">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Coins size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500" />
                      <input
                        type="number"
                        min="1"
                        max={userRimcoins}
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setError(""); }}
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-900 border border-rally-border rounded-xl text-sm text-white focus:outline-none focus:border-gold-600 font-mono"
                        placeholder="Amount RC"
                      />
                    </div>
                    {[25, 50, 100].map((v) => (
                      <button
                        key={v}
                        onClick={() => setAmount(String(v))}
                        className="px-3 py-2.5 text-xs bg-neutral-900 border border-rally-border rounded-xl text-neutral-400 hover:text-white hover:border-neutral-600 transition-all"
                      >
                        {v}
                      </button>
                    ))}
                  </div>

                  {estimatedPayout !== null && selectedOpt && (
                    <div className="text-xs text-neutral-500 space-y-0.5">
                      <div className="flex justify-between">
                        <span>Est. payout if you win</span>
                        <span className="text-gold-400 font-semibold">{formatRimcoins(estimatedPayout)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. odds</span>
                        <span className="text-neutral-400">
                          {(estimatedPayout / Number(amount)).toFixed(2)}x
                        </span>
                      </div>
                      <p className="text-neutral-700 pt-0.5">
                        Final payout depends on bets placed before the event closes.
                      </p>
                    </div>
                  )}

                  {error && <p className="text-red-400 text-xs">{error}</p>}

                  <button
                    onClick={handleBet}
                    disabled={placing || !selectedOption}
                    className="w-full py-3 rounded-xl bg-gold-600 hover:bg-gold-500 disabled:opacity-40 text-black font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {placing ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : !session ? (
                      <><Lock size={14} /> Sign in to bet</>
                    ) : (
                      <><TrendingUp size={14} /> Place bet</>
                    )}
                  </button>
                </div>
              )}

              {event.status !== "OPEN" && !event.userBet && (
                <p className="text-center text-xs text-neutral-600 pt-2">
                  {event.status === "CLOSED" ? "Betting is closed for this event." : "This event has been resolved."}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BettingMarket() {
  const { data: session, update: updateSession } = useSession();
  const [events, setEvents] = useState<BettingEventData[]>([]);
  const [charities, setCharities] = useState<CharityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [rimcoins, setRimcoins] = useState(0);

  const fetchEvents = useCallback(async () => {
    const res = await fetch("/api/events");
    if (res.ok) setEvents(await res.json());
  }, []);

  useEffect(() => {
    const load = async () => {
      const [evRes, chRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/charities"),
      ]);
      if (evRes.ok) setEvents(await evRes.json());
      if (chRes.ok) setCharities(await chRes.json());
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (session?.user?.rimcoins !== undefined) {
      setRimcoins(session.user.rimcoins);
    }
  }, [session]);

  const handleBet = async (eventId: string, optionId: string, amount: number) => {
    const res = await fetch("/api/bets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, optionId, amount }),
    });
    if (res.ok) {
      setRimcoins((prev) => prev - amount);
      await fetchEvents();
      await updateSession();
    }
  };

  const handleCharitySelect = async (charityId: string) => {
    await fetch("/api/user/charity", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ charityId }),
    });
    await updateSession();
  };

  const openEvents = events.filter((e) => e.status === "OPEN");
  const closedEvents = events.filter((e) => e.status !== "OPEN");

  return (
    <section className="py-20 bg-rally-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            Betting for charity
          </p>
          <h2 className="text-5xl sm:text-6xl font-display tracking-widest text-white mb-4">
            THE MARKET
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm">
            Use rimcoins to bet on rally outcomes. Odds shift as bets come in — winners share the entire pool.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-rally-card border border-rally-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold-600/20 flex items-center justify-center">
                  <Coins size={18} className="text-gold-500" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider">Your balance</p>
                  <p className="text-2xl font-display tracking-wider text-gold-400">
                    {formatRimcoins(rimcoins)}
                  </p>
                </div>
              </div>

              {session ? (
                <>
                  <div className="bg-neutral-900 rounded-xl p-3 text-xs text-neutral-500 mb-4">
                    1 EUR = 100 Rimcoins (RC)
                  </div>
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-neutral-800 text-neutral-500 text-sm cursor-not-allowed"
                  >
                    Deposit — Coming soon
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-semibold text-sm transition-colors"
                >
                  Sign in to participate
                </button>
              )}
            </div>

            {session && charities.length > 0 && (
              <div className="bg-rally-card border border-rally-border rounded-2xl p-6">
                <CharitySelector
                  charities={charities}
                  selectedId={session.user.charityId}
                  onSelect={handleCharitySelect}
                />
              </div>
            )}

            {!session && (
              <div className="bg-rally-card border border-rally-border rounded-2xl p-6 text-center">
                <p className="text-sm text-neutral-500">
                  Sign in to choose a charity and place bets with rimcoins.
                </p>
              </div>
            )}

            {/* How it works */}
            <div className="bg-rally-card border border-rally-border rounded-2xl p-5 space-y-3">
              <p className="text-xs font-semibold text-white uppercase tracking-wider">How it works</p>
              {[
                ["Live odds", "Odds shift as people bet. Popular options pay less; bold picks pay more."],
                ["Parimutuel pool", "All stakes go into one pool. Winners split it proportional to their stake."],
                ["All for charity", "Your balance converts to EUR and goes to your chosen charity."],
              ].map(([title, desc]) => (
                <div key={title}>
                  <p className="text-xs text-neutral-300 font-medium">{title}</p>
                  <p className="text-xs text-neutral-600 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-gold-500" />
              </div>
            ) : (
              <>
                {openEvents.length > 0 && (
                  <div className="space-y-3">
                    {openEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        userRimcoins={rimcoins}
                        onBet={handleBet}
                        onLoginRequired={() => setAuthOpen(true)}
                      />
                    ))}
                  </div>
                )}

                {closedEvents.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-600 uppercase tracking-wider pt-4 pb-1">
                      Closed events
                    </p>
                    {closedEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        userRimcoins={rimcoins}
                        onBet={handleBet}
                        onLoginRequired={() => setAuthOpen(true)}
                      />
                    ))}
                  </div>
                )}

                {events.length === 0 && (
                  <div className="text-center py-16 text-neutral-600">
                    <TrendingUp size={40} className="mx-auto mb-4 opacity-20" />
                    <p>No events yet. Check back soon!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
