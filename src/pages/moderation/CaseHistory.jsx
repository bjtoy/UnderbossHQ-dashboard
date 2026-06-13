import { useEffect, useState } from "react";
import { api } from "../../api/api.js";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";

export default function CaseHistory() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCases() {
      setLoading(true);
      setError("");

      try {
        const res = await api.bot.logs.cases();

        if (!res || res.error) {
          setError(res?.error || "Failed to load case history");
          return;
        }

        setCases(res.cases || []);
      } catch (err) {
        setError(err.message || "Failed to load case history");
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, []);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Case History"
        subtitle="Closed and archived moderation cases."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="page-body">
          {cases.length === 0 ? (
            <div className="card empty-state">No cases found.</div>
          ) : (
            <div className="page-stack">
              {cases.map((c) => (
                <div key={c.caseId} className="card">
                  <h3>Case #{c.caseId}</h3>
                  <p className="muted">User: {c.userId}</p>
                  <p className="muted">Moderator: {c.moderatorId}</p>
                  <p className="muted">
                    Opened: {new Date(c.openedAt).toLocaleString()}
                  </p>

                  {!c.actions || c.actions.length === 0 ? (
                    <p className="empty-state">No actions recorded.</p>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Reason</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {c.actions.map((a, i) => (
                          <tr key={i}>
                            <td>{a.type}</td>
                            <td>{a.reason}</td>
                            <td>{new Date(a.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
