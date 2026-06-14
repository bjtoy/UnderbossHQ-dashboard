import { useState } from "react";
import { api } from "../../api/api";

export default function ModerationActions({ userId }) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userId) {
    return (
      <div className="card empty-state">
        Enter a user ID to perform moderation actions.
      </div>
    );
  }

  async function runAction(type) {
    setLoading(true);
    setMessage("");

    const payload = {
      userId,
      reason: reason || "No reason provided",
    };

    let res;

    if (type === "warn") res = await api.bot.mod.warn(payload);
    if (type === "promote") res = await api.bot.mod.promote(payload);
    if (type === "demote") res = await api.bot.mod.demote(payload);
    if (type === "kick") res = await api.bot.mod.kick(payload);

    if (!res || res.error) {
      setMessage(res?.error || "Action failed");
    } else {
      setMessage(`Successfully executed: ${type.toUpperCase()}`);
    }

    setLoading(false);
  }

  return (
    <div className="card page-stack">
      <h2 className="section-title">
        Moderation Actions for {userId}
      </h2>

      <div className="field-group">
        <label className="field-label" htmlFor="mod-reason">
          Reason
        </label>
        <textarea
          id="mod-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="field-textarea"
        />
      </div>

      <div className="action-row">
        <button
          type="button"
          onClick={() => runAction("warn")}
          disabled={loading}
          className="btn btn-outline-red"
        >
          Warn
        </button>

        <button
          type="button"
          onClick={() => runAction("promote")}
          disabled={loading}
          className="btn btn-outline-red"
        >
          Promote
        </button>

        <button
          type="button"
          onClick={() => runAction("demote")}
          disabled={loading}
          className="btn btn-outline-red"
        >
          Demote
        </button>

        <button
          type="button"
          onClick={() => runAction("kick")}
          disabled={loading}
          className="btn btn-danger"
        >
          Kick
        </button>
      </div>

      {message && (
        <div
          className={`message-banner ${
            message.includes("failed") || message.includes("Failed")
              ? "error"
              : "success"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
