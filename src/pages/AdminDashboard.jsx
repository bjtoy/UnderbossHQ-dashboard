import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.bot.admin
      .status()
      .then((data) => setStats(data))
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
            <h3>Total Members</h3>
            <div className="value">{stats?.members ?? "—"}</div>
          </div>

          <div className="card">
            <h3>Moderators</h3>
            <div className="value">{stats?.moderators ?? "—"}</div>
          </div>

          <div className="card">
            <h3>Admins</h3>
            <div className="value">{stats?.admins ?? "—"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
