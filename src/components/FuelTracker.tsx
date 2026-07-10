"use server";

import fuelEntries from "@/data/fuel-entries.json";

type FuelEntry = {
  date: string;
  liters: number;
  coords: { lat: number; lng: number };
  pricePerL?: number;
  notes?: string;
};

export default function FuelTracker() {
  const entries = (fuelEntries as FuelEntry[] | undefined) ?? [];

  // sort newest first
  const sorted = entries
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalLiters = sorted.reduce((acc, e) => acc + (Number(e.liters) || 0), 0);

  return (
    <section id="fuel" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rally-card border border-rally-border rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-display tracking-wider text-white mb-3">
            Fuel tracker
          </h2>
          <p className="text-neutral-400 mb-6">
            Total fuel logged:{" "}
            <span className="font-semibold text-white tabular-nums">
              {totalLiters.toFixed(1)} L
            </span>
          </p>

          <div className="divide-y divide-rally-border">
            {sorted.length === 0 && (
              <div className="text-sm text-neutral-500 py-4">No entries yet</div>
            )}

            {sorted.map((e, i) => (
              <div key={i} className="py-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-white font-medium">{formatLocation(e.coords)}</div>
                  <div className="text-neutral-500 text-xs">
                    {new Date(e.date).toLocaleString()}
                  </div>
                  {e.notes && <div className="text-neutral-400 text-sm mt-1">{e.notes}</div>}
                </div>

                <div className="text-right">
                  <div className="font-semibold text-white tabular-nums">{Number(e.liters).toFixed(1)} L</div>
                  {typeof e.pricePerL === "number" && (
                    <div className="text-neutral-500 text-xs">kr {e.pricePerL.toFixed(2)} / L</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatLocation(coords: { lat: number; lng: number }) {
  // short coords display — change formatting if you prefer
  return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
}