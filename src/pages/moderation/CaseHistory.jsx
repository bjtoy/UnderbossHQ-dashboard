import { useEffect, useState } from "react";
import { api } from "../../api/api";

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

  if (loading) {
    return <div className="p-4 text-gray-300">Loading case history…</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-400">
        Error loading case history: {error}
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-xl font-bold mb-4 text-white">Case History</h1>

      {cases.length === 0 ? (
        <div className="text-gray-400">No cases found.</div>
      ) : (
        <div className="space-y-6">
          {cases.map((c) => (
            <div
              key={c.caseId}
              className="p-4 bg-gray-900 border border-gray-700 rounded"
            >
              <h2 className="text-lg font-bold text-white mb-2">
                Case #{c.caseId}
              </h2>

              <div className="text-gray-300 mb-3">
                <div>User: {c.userId}</div>
                <div>Moderator: {c.moderatorId}</div>
                <div>Status: {c.closedAt ? "Closed" : "Open"}</div>
                <div>
                  Opened: {new Date(c.openedAt).toLocaleString()}
                </div>
                {c.closedAt && (
                  <div>
                    Closed: {new Date(c.closedAt).toLocaleString()}
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <h3 className="text-md font-semibold text-white mb-2">
                Actions
              </h3>

              {(!c.actions || c.actions.length === 0) ? (
                <div className="text-gray-400">No actions recorded.</div>
              ) : (
                <table className="w-full border border-gray-700 text-gray-200">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-2 border border-gray-700">Type</th>
                      <th className="p-2 border border-gray-700">Reason</th>
                      <th className="p-2 border border-gray-700">Timestamp</th>
                    </tr>
                  </thead>

                  <tbody>
                    {c.actions.map((a, i) => (
                      <tr key={i} className="bg-gray-900">
                        <td className="p-2 border border-gray-700">
                          {a.type}
                        </td>
                        <td className="p-2 border border-gray-700">
                          {a.reason}
                        </td>
                        <td className="p-2 border border-gray-700">
                          {new Date(a.timestamp).toLocaleString()}
                        </td>
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
  );
}
