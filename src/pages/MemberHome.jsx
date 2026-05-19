import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { useRoles } from "../context/RoleContext.jsx";

export default function MemberHome() {
  const { user, roles } = useRoles();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/member/profile")
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Member Dashboard</h2>

      <div className="card">
        <h3>Welcome</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p style={{ fontSize: "20px", marginBottom: "6px" }}>
              {profile?.username || user?.username}
            </p>

            <p style={{ color: "var(--text-muted)" }}>
              Faction: {profile?.faction || "Unknown"}
            </p>

            <p style={{ color: "var(--text-muted)" }}>
              Rank: {profile?.rank || "Unknown"}
            </p>
          </>
        )}
      </div>

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
    </div>
  );
}
