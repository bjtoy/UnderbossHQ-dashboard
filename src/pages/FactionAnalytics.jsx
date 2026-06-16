import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function FactionAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.analytics
      .overview()
      .then((res) => setData(res?.data || null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Faction Analytics"
        subtitle="Server growth, moderation, and activity overview."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && data && (
        <div className="page-body page-stack">
          <div className="card">
            <h3>{data.guild?.name || "Server"}</h3>
            <p className="muted">
              Discord members: {data.guild?.memberCount ?? "—"} · Synced
              profiles: {data.members?.syncedProfiles ?? 0}
            </p>
          </div>

          <div className="dashboard-grid dashboard-grid-4">
            <div className="card">
              <h3>Guides</h3>
              <div className="value">{data.content?.guides ?? 0}</div>
            </div>
            <div className="card">
              <h3>Announcements</h3>
              <div className="value">{data.content?.announcements ?? 0}</div>
            </div>
            <div className="card">
              <h3>Warnings</h3>
              <div className="value">{data.moderation?.warnings ?? 0}</div>
            </div>
            <div className="card">
              <h3>Mod Actions</h3>
              <div className="value">{data.moderation?.actions ?? 0}</div>
            </div>
          </div>

          <div className="dashboard-grid dashboard-grid-3">
            <div className="card">
              <h3>New Members (7d)</h3>
              <div className="value">{data.growth?.joinsLast7Days ?? 0}</div>
            </div>
            <div className="card">
              <h3>New Members (30d)</h3>
              <div className="value">{data.growth?.joinsLast30Days ?? 0}</div>
            </div>
            <div className="card">
              <h3>Tracked Joins</h3>
              <div className="value">{data.growth?.totalJoinsTracked ?? 0}</div>
            </div>
          </div>

          <div className="card">
            <h3>Moderation Breakdown</h3>
            {data.moderation?.byAction?.length === 0 ? (
              <p className="muted empty-state">No moderation actions recorded.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.moderation.byAction.map((entry) => (
                    <tr key={entry.action}>
                      <td>{entry.action}</td>
                      <td>{entry.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h3>Top Inviters</h3>
            {data.invites?.topInviters?.length === 0 ? (
              <p className="muted empty-state">No invite data yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Inviter</th>
                    <th>Invites</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invites.topInviters.map((entry) => (
                    <tr key={entry.inviterId}>
                      <td>{entry.inviterUsername}</td>
                      <td>{entry.inviteCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h3>Recent Joins</h3>
            {data.growth?.recentJoins?.length === 0 ? (
              <p className="muted empty-state">No join records yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Invited By</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.growth.recentJoins.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.invitedUsername}</td>
                      <td>{entry.inviterUsername || "Unknown"}</td>
                      <td>{new Date(entry.joinedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
