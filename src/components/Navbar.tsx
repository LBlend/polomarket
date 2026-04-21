"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Coins, LogOut, LogIn, ShoppingBag } from "lucide-react";
import { formatRimcoins } from "@/lib/utils";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-rally-dark/90 backdrop-blur-md border-b border-rally-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display tracking-widest text-gold-500 group-hover:text-gold-400 transition-colors">
              POLOMARKET
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#team" className="text-sm text-neutral-300 hover:text-gold-400 transition-colors tracking-wide">
              Team
            </Link>
            <Link href="/#kart" className="text-sm text-neutral-300 hover:text-gold-400 transition-colors tracking-wide">
              Map
            </Link>
            <Link href="/#instagram" className="text-sm text-neutral-300 hover:text-gold-400 transition-colors tracking-wide">
              Instagram
            </Link>
            <Link
              href="/market"
              className="flex items-center gap-2 px-4 py-2 bg-gold-600 hover:bg-gold-500 text-black font-semibold text-sm rounded-full transition-colors"
            >
              <ShoppingBag size={14} />
              Market
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rally-card rounded-full border border-rally-border text-sm">
                  <Coins size={14} className="text-gold-500" />
                  <span className="text-gold-400 font-mono font-semibold">
                    {formatRimcoins(session.user.rimcoins)}
                  </span>
                </span>
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full border border-rally-border"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 px-4 py-2 border border-rally-border hover:border-gold-600 text-sm text-neutral-300 hover:text-white rounded-full transition-all"
              >
                <LogIn size={14} />
                Sign in
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-rally-card border-t border-rally-border px-4 py-4 space-y-3">
          <Link href="/#team" onClick={() => setOpen(false)} className="block text-sm text-neutral-300 hover:text-gold-400 py-2">Team</Link>
          <Link href="/#kart" onClick={() => setOpen(false)} className="block text-sm text-neutral-300 hover:text-gold-400 py-2">Map</Link>
          <Link href="/#instagram" onClick={() => setOpen(false)} className="block text-sm text-neutral-300 hover:text-gold-400 py-2">Instagram</Link>
          <Link href="/market" onClick={() => setOpen(false)} className="block text-sm text-gold-500 font-semibold py-2">Market</Link>
          <div className="pt-2 border-t border-rally-border">
            {session ? (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm">
                  <Coins size={14} className="text-gold-500" />
                  <span className="text-gold-400 font-mono">{formatRimcoins(session.user.rimcoins)}</span>
                </span>
                <button onClick={() => signOut()} className="text-sm text-red-400">Sign out</button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="w-full py-2 border border-rally-border rounded-full text-sm text-neutral-300"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
