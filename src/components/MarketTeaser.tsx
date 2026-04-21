"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Heart, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: <Coins size={22} className="text-gold-500" />,
    title: "Rimcoins",
    desc: "Deposit money and receive our virtual currency — 1 EUR = 100 RC.",
  },
  {
    icon: <TrendingUp size={22} className="text-indigo-400" />,
    title: "Betting",
    desc: "Bet on the outcomes of rally events with odds-based payouts.",
  },
  {
    icon: <Heart size={22} className="text-red-400" />,
    title: "All for charity",
    desc: "100% of winnings and losses are donated to your chosen organisation.",
  },
];

export default function MarketTeaser() {
  return (
    <section className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(245,158,11,0.08),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            Betting for charity
          </p>
          <h2 className="text-5xl sm:text-7xl font-display tracking-widest text-white mb-5">
            THE MARKET
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto">
            Bet on whether Tjukk Tuk actually makes it to Mongolia, who gives up first, and other crucial rally milestones — with rimcoins that go straight to charity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-rally-card border border-rally-border rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-display tracking-wider text-white mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/market"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold-600 hover:bg-gold-500 text-black font-bold text-base rounded-full transition-colors group"
          >
            Go to the Market
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
