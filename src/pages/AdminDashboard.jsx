import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

export default function AdminDashboard() {
  const { user, roles } = useRoles();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/admin/stats", ["Admin"])
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Admin Control Panel</h2>

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <>
          <div className="card">
            <h3>Logged in as</h3>
            <p style={{ fontSize: "20px", marginBottom: "6px" }}>
              {user?.username}
            </p>
            <p style={{ color: "var(--text-muted)" }}>
              Roles: {roles?.join(", ")}
            </p>
          </div>

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
              <div className="value">
                {stats?.systemStatus ?? "Unknown"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
