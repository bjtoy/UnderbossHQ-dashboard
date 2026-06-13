import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function AdminDashboard() {
  const [status, setStatus] = useState(null);
  const [guildInfo, setGuildInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.bot.admin.status(), api.bot.admin.guildInfo()])
      .then(([statusRes, guildRes]) => {
        setStatus(statusRes?.status || null);
        setGuildInfo(guildRes?.info || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
        title="Admin Panel"
        subtitle="Bot status, guild info, and server sync tools."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}
      {actionMessage && (
        <div className="message-banner success">{actionMessage}</div>
      )}

      {!loading && !error && (
        <div className="page-body">
          <div className="dashboard-grid dashboard-grid-3">
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
          </div>

          <div className="card">
            <h3>Guild Info</h3>
            <p className="muted">Name: {guildInfo?.name ?? "Unknown"}</p>
            <p className="muted">ID: {guildInfo?.id ?? "—"}</p>
          </div>

          <div className="action-row">
            <button
              type="button"
              className="btn btn-gold"
              disabled={actionLoading}
              onClick={() => runAction("reload")}
            >
              Reload Bot Config
            </button>
            <button
              type="button"
              className="btn btn-outline-gold"
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
