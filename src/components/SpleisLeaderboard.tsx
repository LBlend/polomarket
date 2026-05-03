const SPLEIS_PROJECT = 494404;

interface Giver {
  name?: string;
  amount?: number;
  message?: string;
  anonymous?: boolean;
}

async function fetchLeaderboard(): Promise<Giver[]> {
  try {
    const res = await fetch(
      `https://www.spleis.no/api/public/project/${SPLEIS_PROJECT}/promoted-givers`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const MEDALS = ["🥇", "🥈", "🥉"];
const MEDAL_COLORS = ["text-yellow-400", "text-neutral-400", "text-amber-600"];

export default async function SpleisLeaderboard() {
  const givers = await fetchLeaderboard();

  if (!givers.length) {
    return (
      <div className="bg-rally-card border border-rally-border rounded-2xl p-8 text-center">
        <p className="text-2xl mb-3">🏆</p>
        <p className="text-neutral-300 font-semibold mb-1">No donors yet</p>
        <p className="text-sm text-neutral-600">Be the first to top the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="bg-rally-card border border-rally-border rounded-2xl overflow-hidden">
      {givers.map((giver, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 px-5 py-4 ${i < givers.length - 1 ? "border-b border-rally-border" : ""}`}
        >
          <span className={`w-7 text-center text-sm font-bold ${MEDAL_COLORS[i] ?? "text-neutral-600"}`}>
            {MEDALS[i] ?? `#${i + 1}`}
          </span>
          <span className="flex-1 text-neutral-200 truncate">
            {giver.anonymous ? "Anonymous" : (giver.name ?? "Anonymous")}
          </span>
          {giver.amount != null && (
            <span className="text-gold-400 font-mono font-semibold text-sm tabular-nums shrink-0">
              {giver.amount.toLocaleString("nb-NO")} kr
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
