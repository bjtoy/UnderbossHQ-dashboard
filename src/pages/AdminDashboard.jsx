import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { getDiscordBotInviteUrl } from "../utils/discordBotInvite.js";
import { getDashboardUrl } from "../utils/appUrls.js";

export default function AdminDashboard() {
  const { isPlatformOwner, loading: authLoading } = useRoles();
  const [status, setStatus] = useState(null);
  const [guildInfo, setGuildInfo] = useState(null);
  const [premium, setPremium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      const errors = [];

      try {
        const statusRes = await api.bot.admin.status();
        if (!cancelled) setStatus(statusRes?.status || null);
      } catch (err) {
        errors.push(err.message || "Failed to load bot status");
      }

      try {
        const guildRes = await api.bot.admin.guildInfo();
        if (!cancelled) setGuildInfo(guildRes?.info || null);
      } catch (err) {
        errors.push(err.message || "Failed to load guild info");
      }

      if (isPlatformOwner) {
        try {
          const premiumRes = await api.premium.status();
          if (!cancelled) setPremium(premiumRes?.data || null);
        } catch {
          if (!cancelled) setPremium(null);
        }
      }

      if (!cancelled) {
        if (errors.length === 2) {
          setError(errors.join(" · "));
        } else if (errors.length === 1) {
          setError(errors[0]);
        }
        setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [isPlatformOwner, authLoading]);

  async function runAction(action) {
    setActionLoading(true);
    setActionMessage("");
    setError(null);

    try {
      let result;

      if (action === "reload") {
        result = await api.bot.admin.reloadConfig();
      } else if (action === "sync") {
        result = await api.bot.admin.syncRoles();
      }

      setActionMessage(
        result?.result?.message ||
          (result?.result?.status === "completed" &&
          result?.result?.memberCount != null
            ? `Synced ${result.result.memberCount} members in ${result.result.guildName || "guild"}`
            : result?.result?.status === "failed"
              ? result.result.message || `${action} failed`
              : `${action} completed`)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  const hasData = status || guildInfo;
  const dashboardUrl = getDashboardUrl();
  const botInviteUrl = getDiscordBotInviteUrl();

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Bot status, guild info, and server sync tools."
      />

      {(authLoading || loading) && <Loader />}
      {error && <ErrorCard message={error} />}
      {actionMessage && (
        <div className="message-banner success">{actionMessage}</div>
      )}

      {!authLoading && !loading && (hasData || !error) && (
        <div className="page-body">
          <div
            className={`dashboard-grid ${
              isPlatformOwner ? "dashboard-grid-4" : "dashboard-grid-3"
            }`}
          >
            <div className="card">
              <h3>Bot Status</h3>
              <div className="value">{status?.online ? "Online" : "Offline"}</div>
              {!status?.online && (
                <p className="muted">Set DISCORD_TOKEN on the backend for live bot status</p>
              )}
            </div>
            <div className="card">
              <h3>Latency</h3>
              <div className="value">
                {status?.latency != null ? `${status.latency}ms` : "—"}
              </div>
            </div>
            <div className="card">
              <h3>Guild Members</h3>
              <div className="value">{guildInfo?.memberCount ?? "—"}</div>
            </div>
            {isPlatformOwner && (
              <div className="card">
                <h3>Premium</h3>
                <div className="value">{premium?.active ? "Active" : "Free"}</div>
                {premium?.active && premium?.daysRemaining != null && (
                  <p className="muted">{premium.daysRemaining} day(s) left</p>
                )}
                <Link to="/admin/premium" className="btn btn-outline-red btn-sm">
                  Manage
                </Link>
              </div>
            )}
          </div>

          <div className="card page-stack">
            <h3>Guild Info</h3>
            <p className="muted">Name: {guildInfo?.name ?? "Unknown"}</p>
            <p className="muted">ID: {guildInfo?.id ?? "—"}</p>
          </div>

          <div className="card page-stack">
            <h3>Web dashboard</h3>
            <p className="muted">
              UnderbossHQ is a Discord bot plus web dashboard. Staff can manage
              guides, announcements, moderation, invite tracking, analytics, and
              server settings from the browser — the bot handles in-Discord
              slash commands and live server actions.
            </p>
            <ul className="muted page-stack" style={{ paddingLeft: "1.2rem" }}>
              <li>Share the dashboard link with admins who have Manage Server.</li>
              <li>Add the bot to any server before using dashboard features there.</li>
              <li>Use `/help` in Discord for command reference and the dashboard link.</li>
            </ul>
            <div className="action-row">
              {dashboardUrl && (
                <a
                  href={dashboardUrl}
                  className="btn btn-outline-red btn-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open dashboard
                </a>
              )}
              <Link to="/admin/settings" className="btn btn-outline-red btn-sm">
                Server settings
              </Link>
              {botInviteUrl && (
                <a
                  href={botInviteUrl}
                  className="btn btn-outline-gold btn-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add bot to server
                </a>
              )}
            </div>
            {dashboardUrl && (
              <p className="muted">
                Dashboard URL: <code>{dashboardUrl}</code>
              </p>
            )}
          </div>

          <div className="action-row">
            <button
              type="button"
              className="btn btn-outline-red btn-sm"
              disabled={actionLoading}
              onClick={() => runAction("reload")}
            >
              Reload Bot Config
            </button>
            <button
              type="button"
              className="btn btn-outline-red btn-sm"
              disabled={actionLoading}
              onClick={() => runAction("sync")}
            >
              Sync Roles
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
