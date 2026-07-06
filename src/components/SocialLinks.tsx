"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const SOCIALS = [
  {
    name: "Instagram",
    handle: "@teampolomarket",
    url: "https://instagram.com/teampolomarket",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    color: "hover:border-pink-600 hover:text-pink-400",
    iconColor: "text-pink-500",
  },
  {
    name: "TikTok",
    handle: "@teampolomarket",
    url: "https://tiktok.com/@teampolomarket",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
      </svg>
    ),
    color: "hover:border-white hover:text-white",
    iconColor: "text-neutral-300",
  },
  {
    name: "YouTube",
    handle: "@teampolomarket",
    url: "https://www.youtube.com/@teampolomarket",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: "hover:border-red-600 hover:text-red-400",
    iconColor: "text-red-500",
  },
];

export default function SocialLinks() {
  return (
    <section id="socials" className="py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            Follow along
          </p>
          <h2 className="text-4xl font-display tracking-widest text-white">
            FIND US ONLINE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SOCIALS.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col gap-4 p-6 rounded-2xl bg-rally-card border border-rally-border transition-all duration-200 ${social.color}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`${social.iconColor} transition-colors duration-200`}>
                {social.icon}
              </div>
              <div className="flex-1">
                <p className="text-white font-display tracking-wider text-xl mb-0.5">
                  {social.name}
                </p>
                <p className="text-neutral-500 text-sm">{social.handle}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">
                <ExternalLink size={12} />
                <span>Open {social.name}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
