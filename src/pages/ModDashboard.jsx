import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { useRoles } from "../context/RoleContext.jsx";

export default function ModDashboard() {
  const { user, roles } = useRoles();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/mod/stats").then((data) => setStats(data));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Moderator Dashboard</h2>

      <div className="card">
        <h3>Moderator</h3>
        <p style={{ fontSize: "20px", marginBottom: "6px" }}>
          {user?.username}
        </p>
        <p style={{ color: "var(--text-muted)" }}>
          Roles: {roles?.join(", ")}
        </p>
      </div>

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

      <div className="card">
        <h3>Moderator Tools</h3>

        <button className="btn" style={{ marginRight: "12px" }}>
          Review Reports
        </button>

        <button className="btn" style={{ marginRight: "12px" }}>
          Manage Users
        </button>

        <button className="btn">Issue Warning</button>
      </div>
    </div>
  );
}
