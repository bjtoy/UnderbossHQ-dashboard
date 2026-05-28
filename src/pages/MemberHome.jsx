import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

export default function MemberHome() {
  const { user } = useRoles();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/member/profile")
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="section-title">Member Dashboard</h1>

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <>
          <div className="card" style={{ marginBottom: "30px" }}>
            <h3>Welcome</h3>

            <p style={{ fontSize: "20px", marginBottom: "6px" }}>
              {profile?.username || user?.username}
            </p>

            <p className="muted">Faction: {profile?.faction || "Unknown"}</p>
            <p className="muted">Rank: {profile?.rank || "Unknown"}</p>
          </div>

          <div className="card-grid card-grid-3">
            <div className="card">
              <h3>Daily Tasks</h3>
              <div className="value">{profile?.dailyTasks ?? "—"}</div>
            </div>

            <div className="card">
              <h3>Power</h3>
              <div className="value">{profile?.power ?? "—"}</div>
            </div>

            <div className="card">
              <h3>Influence</h3>
              <div className="value">{profile?.influence ?? "—"}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
