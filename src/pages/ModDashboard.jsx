import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

export default function ModDashboard() {
  const { user, roles, guildId } = useRoles();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load moderator stats (guild-aware)
  useEffect(() => {
    if (!guildId) return;

    setLoading(true);
    setError(null);

    api
      .get("/mod/stats")
      .then((data) => {
        if (!data || data.error) {
          setError(data?.error || "Failed to load moderator stats");
          return;
        }
        setStats(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [guildId]);

  return (
    <div>
      <h1
        className="header-title"
        style={{
          marginBottom: "20px",
          fontSize: "38px",
          textShadow: "0 0 10px rgba(255, 46, 46, 0.6)",
        }}
      >
        Moderator Dashboard
      </h1>

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <>
          {/* PROFILE CARD */}
          <div
            className="card"
            style={{
              marginBottom: "30px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                marginBottom: "10px",
                fontSize: "26px",
                color: "var(--red-neon)",
                textShadow: "0 0 8px rgba(255, 46, 46, 0.6)",
              }}
            >
              Moderator
            </h2>

            <p style={{ fontSize: "20px", marginBottom: "6px" }}>
              {user?.username}
            </p>

            <p style={{ color: "var(--text-muted)" }}>
              Roles: {roles?.join(", ")}
            </p>
          </div>

          {/* STATS GRID */}
          <div className="dashboard-grid">
            <div className="card">
              <h3>Reports Today</h3>
              <div className="value">{stats?.reportsToday ?? "—"}</div>
            </div>

            <div className="card">
              <h3>Active Cases</h3>
              <div className="value">{stats?.activeCases ?? "—"}</div>
            </div>

            <div className="card">
              <h3>Warnings Issued</h3>
              <div className="value">{stats?.warnings ?? "—"}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
