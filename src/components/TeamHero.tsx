"use client";

import { motion } from "framer-motion";
import { Flag, Wrench, Users } from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Leander",
    role: "Driver & Mechanic",
    emoji: "🔧",
    bio: "Responsible for making sure Tjukk Tuk actually starts.",
  },
  {
    name: "Team member 2",
    role: "Navigator & Chef",
    emoji: "🗺️",
    bio: "Always knows roughly where we are.",
  },
  {
    name: "Team member 3",
    role: "Photographer & Morale Officer",
    emoji: "📸",
    bio: "Documents everything — especially the breakdowns.",
  },
];

const CAR_SPECS = [
  { label: "Model", value: "Volkswagen Polo" },
  { label: "Horsepower", value: "60 (on a good day)" },
  { label: "Age", value: "2000 (Vintage)" },
  { label: "Air conditioning", value: "Open the window" },
  { label: "GPS", value: "1994 road atlas" },
  { label: "Spare parts", value: "Plenty of prayers" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function TeamHero() {
  return (
    <section className="relative min-h-screen pt-24 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-rally-dark via-neutral-950 to-rally-dark pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.12),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-gold-500 text-sm font-semibold tracking-[0.3em] uppercase mb-3">
            Mongol Rally 2026
          </p>
          <h1 className="text-7xl sm:text-9xl font-display tracking-widest text-white leading-none mb-4">
            POLOMARKET
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            From Oslo to Ulaanbaatar in a car that technically shouldn&apos;t make it.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5"><Flag size={14} className="text-gold-600" /> ~14,000 km</span>
            <span className="flex items-center gap-1.5"><Users size={14} className="text-gold-600" /> 3 rallyists</span>
            <span className="flex items-center gap-1.5"><Wrench size={14} className="text-gold-600" /> 1 questionable car</span>
          </div>
        </motion.div>

        {/* Car showcase */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative rounded-3xl overflow-hidden border border-rally-border bg-rally-card">
            {/* Car image placeholder */}
            <div className="aspect-[16/7] bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center relative">
              <div className="text-center">
                <div className="text-8xl mb-4">🚗</div>
                <p className="text-neutral-600 text-sm">Add a photo of Tjukk Tuk here</p>
              </div>
              {/* Decorative sticker-style label */}
              <div className="absolute top-6 left-6 bg-gold-500 text-black font-display text-2xl tracking-widest px-4 py-2 rounded-lg rotate-[-2deg] shadow-lg">
                TJUKK TUK
              </div>
              <div className="absolute bottom-6 right-6 bg-rally-red text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Mongol Rally 2026
              </div>
            </div>

            {/* Specs grid */}
            <div className="p-6">
              <h2 className="text-2xl font-display tracking-widest text-gold-500 mb-4">
                VEHICLE SPECS
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CAR_SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="bg-neutral-900 rounded-xl p-3 border border-rally-border"
                  >
                    <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                      {spec.label}
                    </p>
                    <p className="text-white text-sm font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <div id="team">
          <motion.h2
            className="text-center text-4xl font-display tracking-widest text-white mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            THE TEAM
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={member.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-rally-card border border-rally-border rounded-2xl p-6 text-center hover:border-gold-700 transition-colors group"
              >
                <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-rally-border group-hover:border-gold-700 transition-colors mx-auto mb-4 flex items-center justify-center text-4xl">
                  {member.emoji}
                </div>
                <h3 className="text-xl font-display tracking-wider text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-gold-500 text-xs uppercase tracking-wider mb-3">
                  {member.role}
                </p>
                <p className="text-neutral-400 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
