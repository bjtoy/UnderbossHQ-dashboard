import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

export default function ModDashboard() {
  const [cases, setCases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/moderator/active-cases")
      .then((data) => setCases(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="section-title">Moderator Dashboard</h1>

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="card">
          <h3>Active Cases</h3>
          <div className="value">{cases?.length ?? "0"}</div>
        </div>
      )}
    </div>
  );
}
