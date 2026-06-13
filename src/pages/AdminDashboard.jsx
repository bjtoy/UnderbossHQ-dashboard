import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

export default function AdminDashboard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.bot.admin
      .status()
      .then((data) => setStatus(data?.status || null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="section-title">Admin Dashboard</h1>

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="card-grid card-grid-3">
          <div className="card">
            <h3>Bot Status</h3>
            <div className="value">
              {status?.online ? "Online" : "Offline"}
            </div>
          </div>

          <div className="card">
            <h3>Latency</h3>
            <div className="value">
              {status?.latency != null ? `${status.latency}ms` : "—"}
            </div>
          </div>

          <div className="card">
            <h3>Uptime</h3>
            <div className="value">{status?.uptime ?? "—"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
