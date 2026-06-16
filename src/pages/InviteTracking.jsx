import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function InviteTracking() {
  const [summary, setSummary] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.invites.stats(), api.invites.recent()])
      .then(([statsRes, recentRes]) => {
        setSummary(statsRes?.data?.summary || null);
        setLeaderboard(statsRes?.data?.leaderboard || []);
        setRecent(recentRes?.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Invite Tracking"
        subtitle="See who invited members to the server."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="page-body page-stack">
          {summary && (
            <div className="dashboard-grid dashboard-grid-4">
              <div className="card">
                <h3>Total Joins</h3>
                <div className="value">{summary.totalJoins}</div>
              </div>
              <div className="card">
                <h3>Tracked Invites</h3>
                <div className="value">{summary.trackedJoins}</div>
              </div>
              <div className="card">
                <h3>Unknown Source</h3>
                <div className="value">{summary.unknownJoins}</div>
              </div>
              <div className="card">
                <h3>Active Inviters</h3>
                <div className="value">{summary.uniqueInviters}</div>
              </div>
            </div>
          )}

          <div className="card">
            <h3>Top Inviters</h3>
            {leaderboard.length === 0 ? (
              <p className="muted empty-state">
                No invite data yet. The bot needs Manage Server permission to
                read invites. New joins will appear here automatically.
              </p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Inviter</th>
                    <th>Discord ID</th>
                    <th>Invites</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.inviterId}>
                      <td>{index + 1}</td>
                      <td>{entry.inviterUsername}</td>
                      <td>
                        <code>{entry.inviterId}</code>
                      </td>
                      <td>{entry.inviteCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h3>Recent Joins</h3>
            {recent.length === 0 ? (
              <p className="muted empty-state">No join records yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Invited By</th>
                    <th>Invite Code</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        {entry.invitedUsername}
                        <br />
                        <code>{entry.invitedUserId}</code>
                      </td>
                      <td>
                        {entry.inviterUsername || "Unknown"}
                        {entry.inviterId ? (
                          <>
                            <br />
                            <code>{entry.inviterId}</code>
                          </>
                        ) : null}
                      </td>
                      <td>{entry.inviteCode || "—"}</td>
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
