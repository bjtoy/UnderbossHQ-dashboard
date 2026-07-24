import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../api/api.js";
import MemberSearchField from "../../components/MemberSearchField.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import WarningsList from "./WarningsList.jsx";

export default function UserLookup() {
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get("userId") || "";
  const [selectedMember, setSelectedMember] = useState(null);
  const [reason, setReason] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const userId = selectedMember?.discordId || "";

  function handleMemberSelect(member) {
    setSelectedMember(member);
    setActionMessage("");
  }

  async function handleAction(type) {
    if (!userId) {
      setActionMessage("Search for a member first.");
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
          <MemberSearchField
            label="Member"
            placeholder="Type a Discord name…"
            selectedMember={selectedMember}
            onSelect={handleMemberSelect}
            initialDiscordId={initialUserId}
            disabled={loadingAction}
          />

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
              disabled={loadingAction || !userId}
              className="btn btn-outline-red btn-sm"
            >
              Warn
            </button>
            <button
              type="button"
              onClick={() => handleAction("promote")}
              disabled={loadingAction || !userId}
              className="btn btn-outline-red btn-sm"
            >
              Promote
            </button>
            <button
              type="button"
              onClick={() => handleAction("demote")}
              disabled={loadingAction || !userId}
              className="btn btn-outline-red btn-sm"
            >
              Demote
            </button>
            <button
              type="button"
              onClick={() => handleAction("kick")}
              disabled={loadingAction || !userId}
              className="btn btn-danger btn-sm"
            >
              Kick
            </button>
          </div>

          {actionMessage && (
            <div className="message-banner success">{actionMessage}</div>
          )}

          {userId && (
            <div className="action-row">
              <Link
                to={`/moderator/cases/${userId}`}
                className="btn btn-outline-red btn-sm"
              >
                Open Case File
              </Link>
            </div>
          )}
        </div>

        <WarningsList userId={userId} />
      </div>
    </div>
  );
}
