import { useEffect, useState } from "react";
import { api } from "../api";

export default function HabitDetail({ habitId, onBack }) {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/habits/${habitId}/stats`).then(setStats).catch(setError);
    api(`/habits/${habitId}/logs`).then(setLogs).catch(setError);
  }, [habitId]);

  const rows = logs.filter((l) => {
    if (!filter.trim()) return true;
    const f = filter.toLowerCase();
    return (
      l.date.includes(filter) || (l.note || "").toLowerCase().includes(f)
    );
  });

  async function checkIn() {
    setError("");
    try {
      await api(`/habits/${habitId}/checkin`, { method: "POST" });
      const [s, l] = await Promise.all([
        api(`/habits/${habitId}/stats`),
        api(`/habits/${habitId}/logs`),
      ]);
      setStats(s);
      setLogs(l);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page">
      <button className="btn ghost" onClick={onBack}>
        ← Back
      </button>
      {error && <div className="error banner">{error}</div>}

      {stats && (
        <div className="detail-head">
          <div>
            <h2>
              {stats.emoji} {stats.name}
            </h2>
            <div className="card-meta">
              🔥 current {stats.current_streak}d · best {stats.best_streak}d ·
              total {stats.total_completions} · 30d rate{" "}
              {(stats.rate30 * 100).toFixed(0)}%
            </div>
          </div>
          <button className="btn primary" onClick={checkIn}>
            Check in today
          </button>
        </div>
      )}

      <div className="panel">
        <div className="table-toolbar">
          <h3>Log history ({logs.length})</h3>
          <input
            className="search"
            placeholder="Filter by date or note..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="log-table-wrap">
          <table className="log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <td>{l.date}</td>
                  <td>{l.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
