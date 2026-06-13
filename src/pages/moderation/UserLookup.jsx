import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/api.js";
import PageHeader from "../../components/PageHeader.jsx";
import WarningsList from "./WarningsList.jsx";

export default function UserLookup() {
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState(searchParams.get("userId") || "");
  const [reason, setReason] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  async function handleAction(type) {
    if (!userId) {
      setActionMessage("Enter a user ID first.");
      return;
    }

    setLoadingAction(true);
    setActionMessage("");

    try {
      const payload = {
        userId,
        reason: reason || "No reason provided",
      };

      let res;

      if (type === "warn") res = await api.bot.mod.warn(payload);
      if (type === "promote") res = await api.bot.mod.promote(payload);
      if (type === "demote") res = await api.bot.mod.demote(payload);
      if (type === "kick") res = await api.bot.mod.kick(payload);
      if (type === "ban") res = await api.bot.mod.ban(payload);

      if (!res || res.error) {
        setActionMessage(res?.error || "Action failed");
      } else {
        const result = res.result || {};
        const discord = result.discord;

        if (discord?.ok) {
          setActionMessage(`${type.toUpperCase()} executed on Discord`);
        } else if (discord?.mode === "discord" && discord?.error) {
          setActionMessage(
            `${type.toUpperCase()} logged, but Discord failed: ${discord.error}`
          );
        } else if (discord?.mode === "log-only") {
          setActionMessage(
            `${type.toUpperCase()} recorded in dashboard (configure DISCORD_TOKEN for live Discord actions)`
          );
        } else {
          setActionMessage(`${type.toUpperCase()} recorded successfully`);
        }
      }
    } catch (err) {
      setActionMessage(err.message || "Action failed");
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title="User Lookup"
        subtitle="Search a member and run moderation actions."
      />

      <div className="page-body">
        <div className="card page-stack">
          <div className="field-group">
            <label className="field-label" htmlFor="lookup-user-id">
              Discord User ID
            </label>
            <input
              id="lookup-user-id"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              className="field-input"
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="lookup-reason">
              Reason (optional)
            </label>
            <textarea
              id="lookup-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for action"
              className="field-textarea"
            />
          </div>

          <div className="action-row">
            <button
              type="button"
              onClick={() => handleAction("warn")}
              disabled={loadingAction}
              className="btn btn-gold btn-sm"
            >
              Warn
            </button>
            <button
              type="button"
              onClick={() => handleAction("promote")}
              disabled={loadingAction}
              className="btn btn-outline-gold btn-sm"
            >
              Promote
            </button>
            <button
              type="button"
              onClick={() => handleAction("demote")}
              disabled={loadingAction}
              className="btn btn-outline-gold btn-sm"
            >
              Demote
            </button>
            <button
              type="button"
              onClick={() => handleAction("kick")}
              disabled={loadingAction}
              className="btn btn-red btn-sm"
            >
              Kick
            </button>
            <button
              type="button"
              onClick={() => handleAction("ban")}
              disabled={loadingAction}
              className="btn btn-danger btn-sm"
            >
              Ban
            </button>
          </div>

          {actionMessage && (
            <div className="message-banner success">{actionMessage}</div>
          )}
        </div>

        <WarningsList userId={userId} />
      </div>
    </div>
  );
}
