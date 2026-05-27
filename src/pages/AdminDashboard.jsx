import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

export default function AdminDashboard() {
  const { user, roles, guildId } = useRoles();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load admin stats (guild-aware)
  useEffect(() => {
    if (!guildId) return;

    setLoading(true);
    setError(null);

    api
      .get("/admin/stats")
      .then((data) => {
        if (!data || data.error) {
          setError(data?.error || "Failed to load admin stats");
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
        Admin Control Panel
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
              Logged in as
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
              <h3>Total Users</h3>
              <div className="value">{stats?.totalUsers ?? "—"}</div>
            </div>

            <div className="card">
              <h3>Active Moderators</h3>
              <div className="value">{stats?.activeMods ?? "—"}</div>
            </div>

            <div className="card">
              <h3>Pending Reports</h3>
              <div className="value">{stats?.pendingReports ?? "—"}</div>
            </div>

            <div className="card">
              <h3>System Status</h3>
              <div className="value">{stats?.systemStatus ?? "Unknown"}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
