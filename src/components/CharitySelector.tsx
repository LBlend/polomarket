"use client";

import { useState } from "react";
import { Heart, ExternalLink, Check } from "lucide-react";

interface Charity {
  id: string;
  name: string;
  slug: string;
  url?: string | null;
}

interface CharitySelectorProps {
  charities: Charity[];
  selectedId: string | null;
  onSelect: (id: string) => Promise<void>;
}

const CHARITY_INFO: Record<string, { description: string; color: string }> = {
  "bla-kors": {
    description: "Helping people and families affected by substance abuse",
    color: "blue",
  },
  "leger-uten-grenser": {
    description: "Medical emergency aid where crises hit hardest",
    color: "red",
  },
  "mental-helse-ungdom": {
    description: "Working for good mental health and quality of life for young people",
    color: "green",
  },
};

const colorMap: Record<string, string> = {
  blue: "border-blue-500 bg-blue-500/10",
  red: "border-red-500 bg-red-500/10",
  green: "border-green-500 bg-green-500/10",
};

export default function CharitySelector({
  charities,
  selectedId,
  onSelect,
}: CharitySelectorProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelect = async (id: string) => {
    if (loading || id === selectedId) return;
    setLoading(id);
    await onSelect(id);
    setLoading(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Heart size={16} className="text-red-400" />
        <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
          Choose your charity
        </h3>
      </div>
      <p className="text-xs text-neutral-500 -mt-2 mb-4">
        Your winnings and losses go to the charity you choose.
      </p>
      {charities.map((charity) => {
        const info = CHARITY_INFO[charity.slug];
        const isSelected = charity.id === selectedId;
        const color = info?.color ?? "gold";

        return (
          <button
            key={charity.id}
            onClick={() => handleSelect(charity.id)}
            disabled={loading !== null}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              isSelected
                ? colorMap[color] ?? "border-gold-500 bg-gold-500/10"
                : "border-rally-border bg-neutral-900 hover:border-neutral-600"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className={`font-semibold text-sm ${isSelected ? "text-white" : "text-neutral-300"}`}>
                  {charity.name}
                </p>
                {info && (
                  <p className="text-xs text-neutral-500 mt-0.5">{info.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                {charity.url && (
                  <a
                    href={charity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-neutral-600 hover:text-neutral-400"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-current bg-current"
                      : "border-neutral-600"
                  }`}
                >
                  {isSelected && <Check size={11} className="text-black" />}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
