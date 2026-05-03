"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, TrendingUp, Heart } from "lucide-react";

const SPLEIS_URL = "https://www.spleis.no/project/494404";

const FEATURES = [
  {
    icon: <TrendingUp size={22} className="text-gold-500" />,
    title: "Predict & Vote",
    desc: "Donate to place bets on what happens during the rally. Who crashes first? Who gets food poisoning?",
  },
  {
    icon: <Heart size={22} className="text-red-400" />,
    title: "All for charity",
    desc: "All the money donated goes toward covering rally costs and donated to Cool Earth.",
  },
];

export default function MarketTeaser() {
  return (
    <section className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(30,138,110,0.08),transparent)] pointer-events-none" />

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
            Bet on whether Tjukk Tuk actually makes it to <s>Mongolia</s> Oskemen, who gets food
            poisoning, and things that might happen during the trip.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/market"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold-600 hover:bg-gold-500 text-black font-bold text-base rounded-full transition-colors group"
          >
            View Predictions
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={SPLEIS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 border border-rally-border hover:border-gold-600 text-neutral-300 hover:text-white font-semibold text-base rounded-full transition-all"
          >
            Donate &amp; Vote on Spleis
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
