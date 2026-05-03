"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-rally-dark/90 backdrop-blur-md border-b border-rally-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display tracking-widest text-gold-500 group-hover:text-gold-400 transition-colors">
              TEAM POLOMARKET
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#team" className="text-sm text-neutral-300 hover:text-gold-400 transition-colors tracking-wide">Team</Link>
            <Link href="/#map" className="text-sm text-neutral-300 hover:text-gold-400 transition-colors tracking-wide">Map</Link>
            <Link href="/#socials" className="text-sm text-neutral-300 hover:text-gold-400 transition-colors tracking-wide">Socials</Link>
            <Link
              href="/market"
              className="flex items-center gap-2 px-4 py-2 bg-gold-600 hover:bg-gold-500 text-black font-semibold text-sm rounded-full transition-colors"
            >
              <ShoppingBag size={14} />
              Market
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-rally-card border-t border-rally-border px-4 py-4 space-y-3">
          <Link href="/#team" onClick={() => setOpen(false)} className="block text-sm text-neutral-300 hover:text-gold-400 py-2">Team</Link>
          <Link href="/#map" onClick={() => setOpen(false)} className="block text-sm text-neutral-300 hover:text-gold-400 py-2">Map</Link>
          <Link href="/#socials" onClick={() => setOpen(false)} className="block text-sm text-neutral-300 hover:text-gold-400 py-2">Socials</Link>
          <Link href="/market" onClick={() => setOpen(false)} className="block text-sm text-gold-500 font-semibold py-2">Market</Link>
        </div>
      )}
    </nav>
  );
}
