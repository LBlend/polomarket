"use client";

import { useState } from "react";
import fuelEntries from "@/data/fuel-entries.json";

type FuelEntry = {
  date: string;
  litersCl: number;
  coords: { lat: number; lng: number };
  pricePerLEurCents?: number;
  place?: string;
};

export default function FuelTracker() {
  const [timeMode, setTimeMode] = useState<"local" | "place">("local");
  const entries = (fuelEntries as FuelEntry[] | undefined) ?? [];

  const sorted = entries
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalStops = sorted.length;
  const totalLitersCl = sorted.reduce((acc, e) => acc + (Number(e.litersCl) || 0), 0);
  const totalLiters = totalLitersCl / 100;
  const totalCostEuros = sorted.reduce((acc, e) => {
    if (typeof e.pricePerLEurCents !== "number") {
      return acc;
    }

    return acc + (e.pricePerLEurCents * (Number(e.litersCl) || 0)) / 100 / 100;
  }, 0);
  const averageLiters = totalStops > 0 ? totalLiters / totalStops : 0;
  const averagePrice = totalLiters > 0 ? totalCostEuros / totalLiters : 0;

  const pricesPerLiter = sorted
    .filter((e) => typeof e.pricePerLEurCents === "number")
    .map((e) => (e.pricePerLEurCents as number) / 100);
  const lowestPrice = pricesPerLiter.length > 0 ? Math.min(...pricesPerLiter) : 0;
  const highestPrice = pricesPerLiter.length > 0 ? Math.max(...pricesPerLiter) : 0;

  return (
    <section id="fuel" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rally-card border border-rally-border rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-display tracking-wider text-white mb-3">
            Fuel tracker
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6 text-sm text-neutral-400">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Total fueled</div>
              <div className="mt-1 text-white font-semibold tabular-nums text-lg">
                {totalLiters.toFixed(1)} L
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Total cost</div>
              <div className="mt-1 text-white font-semibold tabular-nums text-lg">
                €{totalCostEuros.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Fuel stops</div>
              <div className="mt-1 text-white font-semibold tabular-nums">{totalStops}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Average fill</div>
              <div className="mt-1 text-white font-semibold tabular-nums">
                {averageLiters.toFixed(1)} L
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 text-sm text-neutral-400">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Average price</div>
              <div className="mt-1 text-white font-semibold tabular-nums">
                €{averagePrice.toFixed(2)} / L
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Lowest price</div>
              <div className="mt-1 text-white font-semibold tabular-nums">
                €{lowestPrice.toFixed(2)} / L
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Highest price</div>
              <div className="mt-1 text-white font-semibold tabular-nums">
                €{highestPrice.toFixed(2)} / L
              </div>
            </div>

            <div className="inline-flex rounded-full border border-rally-border bg-neutral-950/70 p-1">
              <button
                type="button"
                onClick={() => setTimeMode("local")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  timeMode === "local"
                    ? "bg-gold-600 text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Local time
              </button>
              <button
                type="button"
                onClick={() => setTimeMode("place")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  timeMode === "place"
                    ? "bg-gold-600 text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Place time
              </button>
            </div>
          </div>

          <div className="divide-y divide-rally-border">
            {sorted.length === 0 && (
              <div className="text-sm text-neutral-500 py-4">No entries yet</div>
            )}

            {sorted.map((e, i) => {
              const liters = Number(e.litersCl) / 100;
              const costEuros = typeof e.pricePerLEurCents === "number"
                ? (e.pricePerLEurCents * (Number(e.litersCl) || 0)) / 100 / 100
                : null;
              const pricePerLiter = typeof e.pricePerLEurCents === "number"
                ? e.pricePerLEurCents / 100
                : null;

              return (
                <div key={i} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <a
                      href={googleMapsLink(e.coords)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium underline decoration-white/30 hover:text-neutral-200"
                    >
                      {e.place ?? `${e.coords.lat.toFixed(4)}, ${e.coords.lng.toFixed(4)}`}
                    </a>
                    <div className="text-neutral-500 text-xs">
                      {formatFuelTimestamp(e.date, e.place, timeMode)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-white tabular-nums">{liters.toFixed(1)} L</div>
                    {pricePerLiter !== null ? (
                      <>
                        <div className="text-neutral-500 text-xs">
                          €{pricePerLiter.toFixed(2)} / L
                        </div>
                        <div className="text-yellow-400 text-sm font-semibold tabular-nums">
                          €{costEuros!.toFixed(2)}
                        </div>
                      </>
                    ) : (
                      <div className="text-neutral-500 text-xs">No price data</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function googleMapsLink(coords: { lat: number; lng: number }) {
  return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
}

function formatFuelTimestamp(dateString: string, place: string | undefined, mode: "local" | "place") {
  const date = new Date(dateString);
  const baseOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (mode === "local") {
    return date.toLocaleString("en-GB", baseOptions);
  }

  const timeZone = getTimeZoneForPlace(place);
  return date.toLocaleString("en-GB", {
    ...baseOptions,
    ...(timeZone ? { timeZone } : {}),
  });
}

function getTimeZoneForPlace(place: string | undefined) {
  if (!place) {
    return undefined;
  }

  const normalized = place.toLowerCase();

  // Northern / Central Europe
  if (normalized.includes("sweden") || normalized.includes("håby") || normalized.includes("malmö")) {
    return "Europe/Stockholm";
  }

  if (normalized.includes("germany") || normalized.includes("alt duvenstedt") || normalized.includes("stadtallendorf") || normalized.includes("hinterzarten")) {
    return "Europe/Berlin";
  }

  if (normalized.includes("italy") || normalized.includes("vicenza")) {
    return "Europe/Rome";
  }

  if (normalized.includes("austria") || normalized.includes("gailitz") || normalized.includes("unterweitersdorf") || normalized.includes("korneuburg") || normalized.includes("völkermarkt") || normalized.includes("volkermarkt")) {
    return "Europe/Vienna";
  }

  if (normalized.includes("czech") || normalized.includes("unhošť") || normalized.includes("unhost")) {
    return "Europe/Prague";
  }

  if (normalized.includes("croatia") || normalized.includes("delnice") || normalized.includes("polača") || normalized.includes("polaca") || normalized.includes("gradac")) {
    return "Europe/Zagreb";
  }

  if (normalized.includes("montenegro") || normalized.includes("risan") || normalized.includes("podgorica")) {
    return "Europe/Podgorica";
  }

  if (normalized.includes("north macedonia") || normalized.includes("macedonia") || normalized.includes("struga")) {
    return "Europe/Skopje";
  }

  if (normalized.includes("greece") || normalized.includes("serres")) {
    return "Europe/Athens";
  }

  // Türkiye may be written as 'turkiye', 'türkiye' or 'turkey'
  if (normalized.includes("türkiye") || normalized.includes("turkiye") || normalized.includes("turkey")) {
    return "Europe/Istanbul";
  }

  if (normalized.includes("georgia") || normalized.includes("khelvachauri") || normalized.includes("kareli")) {
    return "Asia/Tbilisi";
  }

  if (normalized.includes("azerbaijan") || normalized.includes("qobustan") || normalized.includes("baku")) {
    return "Asia/Baku";
  }

  // Central Asia
  if (normalized.includes("kazakhstan") || normalized.includes("zhanaozen") || normalized.includes("beyneu") || normalized.includes("bozoy") || normalized.includes("kamyshlybash") || normalized.includes("kyzylorda") || normalized.includes("turkistan") || normalized.includes("kamyshlybash")) {
    return "Asia/Almaty"; // most of the data here uses +05:00/+06:00 regions; Almaty is a reasonable default
  }

  if (normalized.includes("uzbekistan") || normalized.includes("tashkent")) {
    return "Asia/Tashkent";
  }

  if (normalized.includes("tajikistan") || normalized.includes("panjakent") || normalized.includes("panjakent")) {
    return "Asia/Dushanbe";
  }

  return undefined;
}
