import { useCallback, useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard({ user, onOpenHabit }) {
  const [summary, setSummary] = useState(null);
  const [habits, setHabits] = useState([]);
  const [statsById, setStatsById] = useState({});
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [dash, list] = await Promise.all([
        api("/dashboard"),
        api("/habits"),
      ]);
      setSummary(dash);
      setHabits(list);
      for (const h of list) {
        const s = await api(`/habits/${h.id}/stats`);
        setStatsById((prev) => ({ ...prev, [h.id]: s }));
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 4000);
    return () => clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    api(`/habits/search?q=${encodeURIComponent(query)}`)
      .then(setResults)
      .catch(() => setResults([]));
  }, [query]);

  async function checkIn(habitId) {
    setError("");
    try {
      await api(`/habits/${habitId}/checkin`, { method: "POST" });
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function cheer(habitId) {
    try {
      await api(`/habits/${habitId}/cheer`, { method: "POST" });
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId ? { ...h, cheers: h.cheers + 1 } : h
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page">
      {error && <div className="error banner">{error}</div>}

      {summary && (
        <section className="tiles">
          <div className="tile">
            <div className="tile-num">{summary.totals.habits}</div>
            <div className="tile-label">Active habits</div>
          </div>
          <div className="tile">
            <div className="tile-num">{summary.totals.today}</div>
            <div className="tile-label">Check-ins today</div>
          </div>
          <div className="tile">
            <div className="tile-num">{summary.totals.checkins}</div>
            <div className="tile-label">All-time check-ins</div>
          </div>
        </section>
      )}

      {summary && (
        <section className="panel">
          <h3>Last 12 weeks</h3>
          <div className="heatmap">
            {summary.heatmap.map((d) => (
              <div
                key={d.date}
                className={"cell" + (d.count > 0 ? " on" : "")}
                style={d.count > 0 ? { opacity: Math.min(0.25 + d.count / 10, 1) } : undefined}
                title={`${d.date}: ${d.count} check-ins`}
              />
            ))}
          </div>
        </section>
      )}

      <section className="panel">
        <h3>Search habits</h3>
        <input
          className="search"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {results && (
          <ul className="search-results">
            {results.length === 0 && <li className="muted">No matches</li>}
            {results.map((r) => (
              <li key={r.id}>
                <button className="link" onClick={() => onOpenHabit(r.id)}>
                  {r.emoji} {r.name}
                </button>
                <span className="muted"> (owner #{r.user_id})</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="cards">
        {habits.map((h) => {
          const s = statsById[h.id];
          return (
            <div className="card" key={h.id}>
              <div className="card-head">
                <span className="card-emoji">{h.emoji}</span>
                <button
                  className="link card-title"
                  onClick={() => onOpenHabit(h.id)}
                >
                  {h.name}
                </button>
              </div>
              <div className="card-streak">
                {s ? `🔥 ${s.current_streak} day streak` : "Loading..."}
              </div>
              {s && (
                <div className="card-meta">
                  best {s.best_streak}d · 30d rate {(s.rate30 * 100).toFixed(0)}%
                </div>
              )}
              <div className="card-actions">
                <button
                  className="btn primary small"
                  disabled={h.today_done}
                  onClick={() => checkIn(h.id)}
                >
                  {h.today_done ? "Done ✓" : "Check in"}
                </button>
                <button className="btn ghost small" onClick={() => cheer(h.id)}>
                  👏 {h.cheers}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
