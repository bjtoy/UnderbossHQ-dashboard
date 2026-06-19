import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [systemErrors, setSystemErrors] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.bot.logs.recent(),
      api.health.errors(50),
      api.health.status(),
    ])
      .then(([modRes, errorRes, healthRes]) => {
        setLogs(modRes?.logs || []);
        setSystemErrors(errorRes?.data || []);
        setHealth(healthRes || null);
      })
      .catch((err) => setError(err.message || "Failed to load logs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Live Logs"
        subtitle="Moderation actions and system error records."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="page-body page-stack">
          {health && (
            <div className="card page-stack">
              <h3>System Health</h3>
              <p className="muted">
                Status:{" "}
                <span
                  className={
                    health.status === "healthy"
                      ? "log-level log-tip"
                      : "log-level log-warn"
                  }
                >
                  {health.status}
                </span>
                {" · "}
                Database: {health.database}
                {" · "}
                Bot: {health.bot?.enabled ? "enabled" : "disabled"}
              </p>
              {health.env?.missing?.length > 0 && (
                <p className="muted">
                  Missing env: {health.env.missing.join(", ")}
                </p>
              )}
              {health.env?.warnings?.length > 0 && (
                <p className="muted">
                  Warnings: {health.env.warnings.join(" · ")}
                </p>
              )}
            </div>
          )}

          <div className="card">
            <h3>Moderation Logs</h3>
            {logs.length === 0 ? (
              <p className="muted empty-state">No moderation entries yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>User</th>
                    <th>Moderator</th>
                    <th>Reason</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span
                          className={`log-level log-${log.action?.toLowerCase()}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td>{log.userId}</td>
                      <td>{log.moderatorId}</td>
                      <td>{log.reason || "—"}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h3>System Errors</h3>
            {systemErrors.length === 0 ? (
              <p className="muted empty-state">No system errors recorded.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Source</th>
                    <th>Message</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {systemErrors.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <span className={`log-level log-${entry.level}`}>
                          {entry.level}
                        </span>
                      </td>
                      <td>{entry.source || "—"}</td>
                      <td>{entry.message}</td>
                      <td>{new Date(entry.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
