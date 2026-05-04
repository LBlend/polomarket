const SPLEIS_PROJECT = 494404;

interface PollOption {
  id: number;
  text: string;
  collected_amount: number;
  vote_count: number;
}

interface Poll {
  id: number;
  title: string;
  count_collected_amount: boolean;
  options: PollOption[];
}

async function fetchPolls(): Promise<Poll[]> {
  try {
    const res = await fetch(
      `https://www.spleis.no/api/public/project/${SPLEIS_PROJECT}/polls`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.polls ?? [];
  } catch {
    return [];
  }
}

export default async function SpleisPolls() {
  const polls = await fetchPolls();

  if (!polls.length) {
    return <p className="text-center text-neutral-500 py-8">No predictions available yet.</p>;
  }

  return (
    <div className="space-y-6">
      {polls.map((poll) => {
        const total = poll.options.reduce((s, o) => s + o.vote_count, 0);
        const leading = poll.options.reduce(
          (a, b) => (b.vote_count > a.vote_count ? b : a),
          poll.options[0]
        );

        return (
          <div key={poll.id} className="bg-rally-card border border-rally-border rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-5">{poll.title}</h3>
            <div className="space-y-3">
              {poll.options.map((opt) => {
                const pct = total > 0 ? (opt.vote_count / total) * 100 : 0;
                const isLeading = total > 0 && opt.id === leading.id;
                return (
                  <div key={opt.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={isLeading ? "text-gold-400 font-semibold" : "text-neutral-300"}>
                        {opt.text}
                      </span>
                      <span className="text-neutral-500 tabular-nums">
                        {opt.vote_count} vote{opt.vote_count !== 1 ? "s" : ""}
                        {poll.count_collected_amount && opt.collected_amount > 0
                          ? ` · ${opt.collected_amount.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`
                          : ""}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isLeading ? "bg-gold-500" : "bg-neutral-600"}`}
                        style={{ width: `${pct > 0 ? Math.max(pct, 2) : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {total === 0 && (
              <p className="text-xs text-neutral-600 mt-4 text-center">No votes yet</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
