import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

export default function MemberHome() {
  const { user } = useRoles();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load member profile from backend
  useEffect(() => {
    api
      .get("/member/profile")
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1
        className="header-title"
        style={{
          marginBottom: "20px",
          fontSize: "38px",
          textShadow: "0 0 10px rgba(255, 46, 46, 0.6)",
        }}
      >
        Member Dashboard
      </h1>

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <>
          {/* PROFILE CARD */}
          <div
            className="card"
            style={{
              marginBottom: "30px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                marginBottom: "10px",
                fontSize: "26px",
                color: "var(--red-neon)",
                textShadow: "0 0 8px rgba(255, 46, 46, 0.6)",
              }}
            >
              Welcome
            </h2>

            <p style={{ fontSize: "20px", marginBottom: "6px" }}>
              {profile?.username || user?.username}
            </p>

            <p style={{ color: "var(--text-muted)" }}>
              Faction: {profile?.faction || "Unknown"}
            </p>

            <p style={{ color: "var(--text-muted)" }}>
              Rank: {profile?.rank || "Unknown"}
            </p>
          </div>

          {/* STATS GRID */}
          <div className="dashboard-grid">
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
