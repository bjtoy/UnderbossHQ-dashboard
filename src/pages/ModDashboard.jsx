import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

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
    <div className="dashboard-page">
      <PageHeader
        brand
        title="Moderator Dashboard"
        subtitle="Live moderation stats for the selected server."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="page-body">
          <div className="dashboard-grid dashboard-grid-3">
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
        </div>
      )}
    </div>
  );
}
