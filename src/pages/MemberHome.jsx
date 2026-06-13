import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import { normalizeProfile } from "../utils/profileNormalizer.js";

export default function MemberHome() {
  const { user } = useRoles();

  const [profile, setProfile] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const guildId = localStorage.getItem("guildId");

      if (!guildId) {
        window.location.href = "/select-guild";
        return;
      }

      try {
        const [profileData, announcementData] = await Promise.all([
          api.member.profile(),
          api.announcements.list().catch(() => ({ data: [] })),
        ]);

        if (!mounted) return;

        const normalized = normalizeProfile(profileData);
        setProfile(normalized);
        setAnnouncements((announcementData?.data || []).slice(0, 3));
      } catch (err) {
        console.error("Profile load failed:", err);

        if (mounted) {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="section-title">Member Dashboard</h1>

      {loading && <Loader />}

      {error && <ErrorCard message={error} />}

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
              {profile.username || user?.username || "Unknown"}
            </p>

            <p className="muted">Server: {profile.guildName || profile.faction || "—"}</p>

            <p className="muted">Rank: {profile.rank || "—"}</p>
            <p className="muted">Warnings: {profile.warnings ?? 0}</p>
          </div>

          <div className="card-grid card-grid-3">
            <div className="card">
              <h3>Daily Tasks</h3>

              <div className="value">{profile.dailyTasks ?? "N/A"}</div>
              <p className="muted card-note">Game stats not connected yet</p>
            </div>

            <div className="card">
              <h3>Power</h3>

              <div className="value">{profile.power ?? "N/A"}</div>
            </div>

            <div className="card">
              <h3>Influence</h3>

              <div className="value">{profile.influence ?? "N/A"}</div>
            </div>
          </div>

          <div className="card mt-4">
            <div
              className="action-row"
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <h3 style={{ marginBottom: 0 }}>Recent Announcements</h3>
              <Link to="/announcements" className="btn btn-outline-gold btn-sm">
                View all
              </Link>
            </div>

            {announcements.length === 0 ? (
              <p className="empty-state">No announcements yet.</p>
            ) : (
              <div className="page-stack mt-3">
                {announcements.map((item) => (
                  <div key={item.id}>
                    <h4>{item.title}</h4>
                    <p className="muted">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <p className="guide-preview">
                      {item.description.length > 120
                        ? `${item.description.slice(0, 120)}…`
                        : item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
