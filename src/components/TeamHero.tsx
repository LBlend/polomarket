"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flag, Wrench, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const TEAM_MEMBERS = [
  {
    name: "Sebastian",
    role: "Engineer",
    emoji: "🔧",
    bio: "Responsible for making sure our Tjukk Tuk actually starts.",
    gif: "/gifs/sebastian.gif",
  },
  {
    name: "Sahib",
    role: "Navigator",
    emoji: "🗺️",
    bio: "Always knows roughly where we are.",
    gif: "/gifs/sahib.gif",
  },
  {
    name: "Sivert",
    role: "Logistics & Economics",
    emoji: "📦",
    bio: "Makes sure we have the stuff we need to do this in the first place.",
    gif: "/gifs/sivert.gif",
  },
  {
    name: "Leander",
    role: "Social Media & Documentarian",
    emoji: "📸",
    bio: "Always has a camera in hand, documenting our journey and making sure the world knows about our questionable decisions.",
    gif: "/gifs/leander.gif",
  },
];

const CAR_SPECS = [
  { label: "Model", value: "Volkswagen Polo" },
  { label: "Horsepower", value: "60 (on a good day)" },
  { label: "Age", value: "2000 (Vintage)" },
  { label: "Air conditioning", value: "Open the window" },
  { label: "Kilometerage", value: "230,000+ km" },
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

function TeamCard({ member, index }: { member: (typeof TEAM_MEMBERS)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={member.name}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative"
    >
      <motion.div
        className="bg-rally-card border rounded-2xl overflow-hidden cursor-pointer select-none"
        animate={{
          borderColor: hovered ? "#d97706" : "#262626",
          boxShadow: hovered
            ? "0 0 24px rgba(217, 119, 6, 0.2)"
            : "0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => setHovered((v) => !v)}
      >
        {/* Media area */}
        <div className="relative aspect-square bg-neutral-900 flex items-center justify-center overflow-hidden">
          <AnimatePresence>
            {!hovered && (
              <motion.div
                key="emoji"
                className="text-7xl absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {member.emoji}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {hovered && member.gif && (
              <motion.div
                key="gif"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Image
                  src={member.gif}
                  alt={member.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fallback when hovered but no GIF */}
          <AnimatePresence>
            {hovered && !member.gif && (
              <motion.div
                key="emoji-hovered"
                className="text-7xl absolute inset-0 flex items-center justify-center bg-neutral-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {member.emoji}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info area */}
        <div className="p-4 text-center">
          <h3 className="text-lg font-display tracking-wider text-white mb-0.5">
            {member.name}
          </h3>

          <AnimatePresence initial={false}>
            {!hovered && (
              <motion.p
                key="role"
                className="text-gold-500 text-xs uppercase tracking-wider"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {member.role}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {hovered && (
              <motion.div
                key="bio"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="text-gold-500 text-xs uppercase tracking-wider mb-2">
                  {member.role}
                </p>
                <p className="text-neutral-400 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

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
            TEAM POLOMARKET
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            From Oslo to Ulaanbaatar in a car that technically shouldn&apos;t make it.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5"><Flag size={14} className="text-gold-600" /> ~14,000 km</span>
            <span className="flex items-center gap-1.5"><Users size={14} className="text-gold-600" /> 4 fat dudes</span>
            <span className="flex items-center gap-1.5"><Wrench size={14} className="text-gold-600" /> 1 shitbox of a car</span>
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
            <div className="aspect-[16/7] relative overflow-hidden">
              <Image
                src="/tjukk_tuk.jpg"
                alt="Tjukk Tuk"
                fill
                className="object-cover"
                priority
              />
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-start">
            {TEAM_MEMBERS.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
