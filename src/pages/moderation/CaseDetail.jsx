import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/api.js";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";

export default function CaseDetail() {
  const { userId } = useParams();
  const [caseFile, setCaseFile] = useState(null);
  const [note, setNote] = useState("");
  const [kickReason, setKickReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadCaseFile() {
    setLoading(true);
    setError("");

    try {
      const res = await api.bot.mod.caseFile(userId);
      setCaseFile(res?.data || null);
    } catch (err) {
      setError(err.message || "Failed to load case file");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCaseFile();
  }, [userId]);

  async function runAction(action) {
    setActing(true);
    setMessage("");
    setError("");

    try {
      let res;

      if (action === "kick") {
        res = await api.bot.mod.kick({
          userId,
          reason: kickReason || "Kicked from case file",
        });
      } else if (action === "promote") {
        res = await api.bot.mod.promote({
          userId,
          reason: "Promoted from case file",
        });
      } else if (action === "demote") {
        res = await api.bot.mod.demote({
          userId,
          reason: "Demoted from case file",
        });
      } else if (action === "note") {
        res = await api.bot.mod.note({ userId, note });
        setNote("");
      }

      if (res?.result?.discord?.error) {
        setMessage(`Action logged — Discord: ${res.result.discord.error}`);
      } else {
        setMessage(`${action.toUpperCase()} recorded.`);
      }

      await loadCaseFile();
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setActing(false);
    }
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Case File"
        subtitle={`Full moderation history for ${
          caseFile?.profile?.username || caseFile?.userLabel || userId
        }`}
        actions={
          <Link to="/moderator/user-lookup" className="btn btn-outline-red btn-sm">
            User Lookup
          </Link>
        }
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      {!loading && !error && caseFile && (
        <div className="page-body page-stack">
          <div className="card page-stack">
            <h3>Member</h3>
            <p className="muted">
              Username:{" "}
              <strong>
                {caseFile.profile?.username || caseFile.userLabel || "Unknown"}
              </strong>
            </p>
            <p className="muted">
              Discord ID: <code className="discord-id">{userId}</code>
            </p>
            <p className="muted">Warnings: {caseFile.warningCount}</p>
            {caseFile.activeTimeouts?.length > 0 && (
              <p className="muted">
                Active timeout until{" "}
                {new Date(caseFile.activeTimeouts[0].expiresAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="card page-stack">
            <h3>Quick Actions</h3>
            <div className="field-group">
              <label className="field-label" htmlFor="kick-reason">
                Kick reason (optional)
              </label>
              <input
                id="kick-reason"
                className="field-input"
                value={kickReason}
                onChange={(e) => setKickReason(e.target.value)}
                placeholder="Reason for kick"
              />
            </div>
            <div className="action-row">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                disabled={acting}
                onClick={() => runAction("kick")}
              >
                Kick
              </button>
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={acting}
                onClick={() => runAction("promote")}
              >
                Promote
              </button>
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={acting}
                onClick={() => runAction("demote")}
              >
                Demote
              </button>
            </div>
          </div>

          <div className="card page-stack">
            <h3>Add Case Note</h3>
            <textarea
              className="field-textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Internal note for moderators"
            />
            <button
              type="button"
              className="btn btn-outline-red btn-sm"
              disabled={acting || !note.trim()}
              onClick={() => runAction("note")}
            >
              Add Note
            </button>
          </div>

          <div className="card">
            <h3>Timeline</h3>
            {caseFile.timeline?.length === 0 ? (
              <p className="muted empty-state">No moderation history.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Reason</th>
                    <th>Moderator</th>
                    <th>Duration</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {caseFile.timeline.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <span
                          className={`log-level log-${entry.action.toLowerCase()}`}
                        >
                          {entry.action}
                        </span>
                      </td>
                      <td>{entry.reason || "-"}</td>
                      <td>
                        <div>
                          {entry.moderatorLabel ||
                            entry.moderatorUsername ||
                            entry.moderatorId}
                        </div>
                        {entry.moderatorUsername ? (
                          <div className="discord-id">{entry.moderatorId}</div>
                        ) : null}
                      </td>
                      <td>
                        {entry.durationMinutes
                          ? `${entry.durationMinutes}m`
                          : "-"}
                      </td>
                      <td>{new Date(entry.timestamp).toLocaleString()}</td>
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
