import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

export default function ModDashboard() {
  const [overview, setOverview] = useState(null);
  const [caseCount, setCaseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.bot.mod.overview(), api.bot.mod.activeCases()])
      .then(([overviewRes, casesRes]) => {
        setOverview(overviewRes?.data || null);
        setCaseCount((casesRes?.cases || []).length);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="section-title">Moderator Dashboard</h1>

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="card-grid card-grid-3">
          <div className="card">
            <h3>Active Cases</h3>
            <div className="value">{caseCount}</div>
          </div>

          <div className="card">
            <h3>Total Warnings</h3>
            <div className="value">{overview?.totalWarnings ?? "0"}</div>
          </div>

          <div className="card">
            <h3>Moderation Actions</h3>
            <div className="value">{overview?.totalCases ?? "0"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
