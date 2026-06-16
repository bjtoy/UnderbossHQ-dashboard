import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function AdminDashboard() {
  const { isPlatformOwner } = useRoles();
  const [status, setStatus] = useState(null);
  const [guildInfo, setGuildInfo] = useState(null);
  const [premium, setPremium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const requests = [api.bot.admin.status(), api.bot.admin.guildInfo()];

    if (isPlatformOwner) {
      requests.push(api.premium.status().catch(() => null));
    }

    Promise.all(requests)
      .then((results) => {
        const [statusRes, guildRes, premiumRes] = results;
        setStatus(statusRes?.status || null);
        setGuildInfo(guildRes?.info || null);
        setPremium(premiumRes?.data || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isPlatformOwner]);

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

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Bot status, guild info, and server sync tools."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}
      {actionMessage && (
        <div className="message-banner success">{actionMessage}</div>
      )}

      {!loading && !error && (
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

          <div className="card">
            <h3>Guild Info</h3>
            <p className="muted">Name: {guildInfo?.name ?? "Unknown"}</p>
            <p className="muted">ID: {guildInfo?.id ?? "—"}</p>
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
