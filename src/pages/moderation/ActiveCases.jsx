import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.caseId}>
                      <td>{c.caseId}</td>
                      <td>
                        <div>{c.userLabel || c.userUsername || c.userId}</div>
                        {c.userUsername ? (
                          <div className="discord-id">{c.userId}</div>
                        ) : null}
                      </td>
                      <td>
                        <div>
                          {c.moderatorLabel ||
                            c.moderatorUsername ||
                            c.moderatorId}
                        </div>
                        {c.moderatorUsername ? (
                          <div className="discord-id">{c.moderatorId}</div>
                        ) : null}
                      </td>
                      <td>{c.status || "open"}</td>
                      <td>{new Date(c.openedAt).toLocaleString()}</td>
                      <td>
                        <Link
                          to={`/moderator/cases/${c.userId}`}
                          className="btn btn-outline-red btn-sm"
                        >
                          Open
                        </Link>
                      </td>
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
