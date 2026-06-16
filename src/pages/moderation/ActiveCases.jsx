import { useEffect, useState } from "react";
import { api } from "../../api/api.js";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";

export default function ActiveCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCases() {
      setLoading(true);
      setError("");

      try {
        const res = await api.bot.mod.activeCases();

        if (!res || res.error) {
          setError(res?.error || "Failed to load active cases");
          return;
        }

        setCases(res.cases || []);
      } catch (err) {
        setError(err.message || "Failed to load active cases");
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, []);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Active Cases"
        subtitle="Open moderation cases for this server."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="page-body">
          {cases.length === 0 ? (
            <div className="card empty-state">No active cases.</div>
          ) : (
            <div className="card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>User</th>
                    <th>Moderator</th>
                    <th>Status</th>
                    <th>Opened</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.caseId}>
                      <td>{c.caseId}</td>
                      <td>{c.userId}</td>
                      <td>{c.moderatorId}</td>
                      <td>{c.status || "open"}</td>
                      <td>{new Date(c.openedAt).toLocaleString()}</td>
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
