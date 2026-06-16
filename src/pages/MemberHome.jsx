import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { normalizeProfile } from "../utils/profileNormalizer.js";
import { formatEventRange } from "../utils/eventDates.js";

export default function MemberHome() {
  const [profile, setProfile] = useState(null);
  const [factionStats, setFactionStats] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
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
        const [profileData, announcementData, summaryData, eventsData] =
          await Promise.all([
          api.member.profile(),
          api.announcements.list().catch(() => ({ data: [] })),
          api.analytics.summary().catch(() => ({ data: null })),
          api.events.list(true).catch(() => ({ data: [] })),
        ]);

        if (!mounted) return;

        setProfile(normalizeProfile(profileData));
        setAnnouncements((announcementData?.data || []).slice(0, 3));
        setFactionStats(summaryData?.data || null);
        setUpcomingEvents((eventsData?.data || []).slice(0, 3));
      } catch (err) {
        console.error("Profile load failed:", err);
        if (mounted) {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Member Dashboard"
        subtitle={`Your profile and server activity.`}
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && profile && (
        <div className="page-body">
          <div className="card">
            <h3>Profile</h3>
            <p className="muted">Server: {profile.guildName || profile.faction || "—"}</p>
            <p className="muted">Rank: {profile.rank || "—"}</p>
            <p className="muted">Warnings: {profile.warnings ?? 0}</p>
          </div>

          <div className="dashboard-grid dashboard-grid-3">
            <div className="card">
              <h3>Members</h3>
              <div className="value">{factionStats?.memberCount ?? "—"}</div>
              <p className="muted">Discord server size</p>
            </div>
            <div className="card">
              <h3>Guides</h3>
              <div className="value">{factionStats?.guides ?? "—"}</div>
            </div>
            <div className="card">
              <h3>New (30d)</h3>
              <div className="value">{factionStats?.newMembers30d ?? "—"}</div>
              <p className="muted">Tracked joins this month</p>
            </div>
          </div>

          <section className="page-section">
            <div className="page-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
              <div className="page-header-text">
                <h2 className="page-section-title">Upcoming Events</h2>
              </div>
              <div className="page-header-actions">
                <Link to="/events" className="btn btn-outline-red btn-sm">
                  View all
                </Link>
              </div>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="card empty-state">No upcoming events.</div>
            ) : (
              <div className="page-stack">
                {upcomingEvents.map((item) => (
                  <div key={item.id} className="card">
                    <h4>{item.title}</h4>
                    <p className="muted">
                      {formatEventRange(item.startsAt, item.endsAt)}
                    </p>
                    {item.location ? (
                      <p className="muted">{item.location}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="page-section">
            <div className="page-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
              <div className="page-header-text">
                <h2 className="page-section-title">Recent Announcements</h2>
              </div>
              <div className="page-header-actions">
                <Link to="/announcements" className="btn btn-outline-red btn-sm">
                  View all
                </Link>
              </div>
            </div>

            {announcements.length === 0 ? (
              <div className="card empty-state">No announcements yet.</div>
            ) : (
              <div className="page-stack">
                {announcements.map((item) => (
                  <div key={item.id} className="card">
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
          </section>
        </div>
      )}
    </div>
  );
}
