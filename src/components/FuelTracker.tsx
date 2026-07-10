import fuelEntries from "@/data/fuel-entries.json";

type FuelEntry = {
  date: string;
  litersCl: number;
  coords: { lat: number; lng: number };
  pricePerLEurCents?: number;
  place?: string;
};

export default function FuelTracker() {
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

  return (
    <section id="fuel" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rally-card border border-rally-border rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-display tracking-wider text-white mb-3">
            Fuel tracker
          </h2>

          <div className="grid gap-3 sm:grid-cols-3 mb-6 text-sm text-neutral-400">
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
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Average price</div>
              <div className="mt-1 text-white font-semibold tabular-nums">
                €{averagePrice.toFixed(2)} / L
              </div>
              <div className="text-neutral-500 text-xs mt-1">
                Total fueled: {totalLiters.toFixed(1)} L
              </div>
            </div>
          </div>

          <div className="divide-y divide-rally-border">
            {sorted.length === 0 && (
              <div className="text-sm text-neutral-500 py-4">No entries yet</div>
            )}

            {sorted.map((e, i) => (
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
                    {new Date(e.date).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-white tabular-nums">{(Number(e.litersCl) / 100).toFixed(1)} L</div>
                  {typeof e.pricePerLEurCents === "number" && (
                    <div className="text-neutral-500 text-xs">
                      €{(e.pricePerLEurCents / 100).toFixed(2)} / L
                    </div>
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

function googleMapsLink(coords: { lat: number; lng: number }) {
  return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
}