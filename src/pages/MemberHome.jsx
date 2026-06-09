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
let mounted = true;

```
async function load() {
  const guildId = localStorage.getItem("guildId");

  if (!guildId) {
    window.location.href = "/select-guild";
    return;
  }

  try {
    const data = await api.member.profile();

    if (!mounted) return;

    setProfile(data || {});
  } catch (err) {
    console.error("Profile load failed:", err);

    if (!mounted) return;

    setError(err.message || "Failed to load profile");
  } finally {
    if (!mounted) return;

    setLoading(false);
  }
}

load();

return () => {
  mounted = false;
};
```

}, []);

return ( <div> <h1 className="section-title">
Member Dashboard </h1>

```
  {loading && <Loader />}

  {error && (
    <ErrorCard message={error} />
  )}

  {!loading && !error && profile && (
    <>
      <div
        className="card"
        style={{
          marginBottom: "30px",
        }}
      >
        <h3>Welcome</h3>

        <p
          style={{
            fontSize: "20px",
            marginBottom: "6px",
          }}
        >
          {profile.username ||
            user?.username ||
            "Unknown"}
        </p>

        <p className="muted">
          Faction: {profile.faction || "Unknown"}
        </p>

        <p className="muted">
          Rank: {profile.rank || "Unknown"}
        </p>
      </div>

      <div className="card-grid card-grid-3">
        <div className="card">
          <h3>Daily Tasks</h3>

          <div className="value">
            {profile.dailyTasks ?? "—"}
          </div>
        </div>

        <div className="card">
          <h3>Power</h3>

          <div className="value">
            {profile.power ?? "—"}
          </div>
        </div>

        <div className="card">
          <h3>Influence</h3>

          <div className="value">
            {profile.influence ?? "—"}
          </div>
        </div>
      </div>
    </>
  )}
</div>
```

);
}
