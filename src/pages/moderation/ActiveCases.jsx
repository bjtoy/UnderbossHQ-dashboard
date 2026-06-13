import { useEffect, useState } from "react";
import { api } from "../../api/api";

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

  if (loading) {
    return <div className="p-4 text-gray-300">Loading active cases…</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-400">
        Error loading cases: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-white">Active Moderation Cases</h1>

      {cases.length === 0 ? (
        <div className="text-gray-400">No active cases.</div>
      ) : (
        <table className="w-full border border-gray-700 text-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 border border-gray-700">Case ID</th>
              <th className="p-2 border border-gray-700">User</th>
              <th className="p-2 border border-gray-700">Moderator</th>
              <th className="p-2 border border-gray-700">Status</th>
              <th className="p-2 border border-gray-700">Opened</th>
            </tr>
          </thead>

          <tbody>
            {cases.map((c) => (
              <tr key={c.caseId} className="bg-gray-900">
                <td className="p-2 border border-gray-700">{c.caseId}</td>
                <td className="p-2 border border-gray-700">{c.userId}</td>
                <td className="p-2 border border-gray-700">{c.moderatorId}</td>
                <td className="p-2 border border-gray-700">{c.status || "open"}</td>
                <td className="p-2 border border-gray-700">
                  {new Date(c.openedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
