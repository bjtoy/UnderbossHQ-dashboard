import { useEffect, useState } from "react";
import { api } from "../../api/api.js";

export default function WarningsList({ userId }) {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setWarnings([]);
      setLoading(false);
      setError("");
      return;
    }

    async function loadWarnings() {
      setLoading(true);
      setError("");

      try {
        const res = await api.bot.mod.warnings(userId);

        if (!res || res.error) {
          setError(res?.error || "Failed to load warnings");
          return;
        }

        setWarnings(res.warnings || []);
      } catch (err) {
        setError(err.message || "Failed to load warnings");
      } finally {
        setLoading(false);
      }
    }

    loadWarnings();
  }, [userId]);

  if (!userId) {
    return (
      <div className="card empty-state">
        Enter a user ID to view warnings.
      </div>
    );
  }

  if (loading) {
    return <div className="card empty-state">Loading warnings…</div>;
  }

  if (error) {
    return <div className="message-banner error">{error}</div>;
  }

  return (
    <div className="card">
      <h3>Warnings for User: {userId}</h3>

      {warnings.length === 0 ? (
        <p className="empty-state">This user has no warnings.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Warning ID</th>
              <th>Reason</th>
              <th>Moderator</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {warnings.map((w) => (
              <tr key={w.id}>
                <td>{w.id}</td>
                <td>{w.reason}</td>
                <td>{w.moderatorId}</td>
                <td>{new Date(w.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
