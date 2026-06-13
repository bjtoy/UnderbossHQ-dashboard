import { useEffect, useState } from "react";
import { api } from "../../api/api";

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
      <div className="p-4 text-gray-400">
        Enter a user ID to view warnings.
      </div>
    );
  }

  if (loading) {
    return <div className="p-4 text-gray-300">Loading warnings…</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-400">
        Error loading warnings: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4 text-white">
        Warnings for User: {userId}
      </h2>

      {warnings.length === 0 ? (
        <div className="text-gray-400">This user has no warnings.</div>
      ) : (
        <table className="w-full border border-gray-700 text-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 border border-gray-700">Warning ID</th>
              <th className="p-2 border border-gray-700">Reason</th>
              <th className="p-2 border border-gray-700">Moderator</th>
              <th className="p-2 border border-gray-700">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {warnings.map((w) => (
              <tr key={w.id} className="bg-gray-900">
                <td className="p-2 border border-gray-700">{w.id}</td>
                <td className="p-2 border border-gray-700">{w.reason}</td>
                <td className="p-2 border border-gray-700">{w.moderatorId}</td>
                <td className="p-2 border border-gray-700">
                  {new Date(w.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

