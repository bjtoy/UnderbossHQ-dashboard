import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

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

  if (loading) return <Loader />;
  if (error) return <ErrorCard message={error} />;

  return (
    <div>
      <h1 className="section-title">Live Logs</h1>
      <p className="muted page-intro">
        Recent moderation actions for the selected server.
      </p>

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
                    <span className={`log-level log-${log.action?.toLowerCase()}`}>
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
  );
}
