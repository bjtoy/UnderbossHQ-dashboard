import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.bot.logs
      .recent()
      .then((res) => setLogs(res?.logs || []))
      .catch((err) => setError(err.message || "Failed to load logs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Live Logs"
        subtitle="Recent moderation actions for the selected server."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="page-body">
          {logs.length === 0 ? (
            <div className="card empty-state">No log entries yet.</div>
          ) : (
            <div className="card">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
