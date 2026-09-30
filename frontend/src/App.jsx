import { useState } from "react";
import Dashboard from "./components/Dashboard";
import HabitDetail from "./components/HabitDetail";
import Login from "./components/Login";
import { setToken } from "./api";

export default function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  function handleLogin(u) {
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  }

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("user");
    setUser(null);
  }

  if (!user) return <Login onLogin={handleLogin} />;

  return <Home user={user} onLogout={handleLogout} />;
}

function Home({ user, onLogout }) {
  const [selectedHabit, setSelectedHabit] = useState(null);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">HT</span>
          <span>Habit Tracker</span>
        </div>
        <div className="topbar-right">
          <span className="user-name">{user.name}</span>
          <button className="btn ghost" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>
      {selectedHabit ? (
        <HabitDetail
          habitId={selectedHabit}
          onBack={() => setSelectedHabit(null)}
        />
      ) : (
        <Dashboard user={user} onOpenHabit={setSelectedHabit} />
      )}
    </div>
  );
}
