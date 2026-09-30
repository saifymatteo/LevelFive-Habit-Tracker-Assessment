import { useState } from "react";
import { api, setToken } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("demo@habit.app");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api("/login", {
        method: "POST",
        body: { email, password },
      });
      setToken(data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="brand big">
          <span className="brand-mark">HT</span>
          <span>Habit Tracker</span>
        </div>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn primary" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <p className="hint">Demo account is pre-filled. Just hit sign in.</p>
      </form>
    </div>
  );
}
