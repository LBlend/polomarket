"use client";

import { useEffect, useRef } from "react";
import { Tv } from "lucide-react";

const CHANNEL = "furumolive";

export default function TwitchStream() {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (ref.current) {
      const parent = window.location.hostname;
      ref.current.src = `https://player.twitch.tv/?channel=${CHANNEL}&parent=${parent}&autoplay=false`;
    }
  }, []);

  return (
    <section id="stream" className="py-20 bg-rally-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            Live
          </p>
          <h2 className="text-4xl font-display tracking-widest text-white flex items-center gap-3">
            LIVESTREAM
            <Tv size={28} className="text-gold-500" />
          </h2>
        </div>

        <div className="rounded-2xl overflow-hidden border border-rally-border aspect-video">
          <iframe
            ref={ref}
            height="100%"
            width="100%"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
