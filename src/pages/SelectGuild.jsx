import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import { getDefaultRoute } from "../utils/getDefaultRoute.js";
import BrandMark from "../components/BrandMark.jsx";
import { getDiscordBotInviteUrl } from "../utils/discordBotInvite.js";

export default function SelectGuild() {
  const navigate = useNavigate();
  const { setGuildId, refreshUser } = useRoles();

  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const botInviteUrl = getDiscordBotInviteUrl();

  useEffect(() => {
    api.guilds
      .list()
      .then((data) => {
        if (!data || !data.success) {
          throw new Error(data?.message || "Failed to fetch guilds");
        }

        const guildList = data.guilds || [];
        setGuilds(guildList);

        if (guildList.length === 1) {
          selectGuild(guildList[0]);
        }
      })
      .catch((err) => {
        console.error("Guild list error:", err);
        setError(
          err.message ||
            "Failed to load servers. Ensure you have Manage Server permission on at least one Discord server."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function selectGuild(guild) {
    setGuildId(guild.id);
    const access = await refreshUser();
    navigate(getDefaultRoute(access?.roles || []), { replace: true });
  }

  if (loading) {
    return (
      <div className="loading-screen">Loading servers…</div>
    );
  }

  if (error) {
    return (
      <div className="standalone-page">
        <div className="standalone-card">
          <BrandMark size="md" />
          <h1 className="page-title">Could not load servers</h1>
          <p className="page-subtitle">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="standalone-page">
      <div className="standalone-card standalone-card-wide">
        <BrandMark size="md" />
        <h1 className="page-title">Select Server</h1>
        <p className="page-subtitle">
          Choose which Discord server you want to manage.
        </p>

        <div className="standalone-list">
          {guilds.length === 0 ? (
            <>
              <p className="page-subtitle">
                No manageable servers found. Add UnderbossHQ to a Discord server
                where you have Manage Server permission, then sign in again.
              </p>
              {botInviteUrl && (
                <a
                  href={botInviteUrl}
                  className="btn btn-outline-gold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add bot to server
                </a>
              )}
            </>
          ) : (
            guilds.map((guild) => (
              <button
                key={guild.id}
                type="button"
                className="btn btn-outline-red"
                onClick={() => selectGuild(guild)}
              >
                {guild.name}
              </button>
            ))
          )}
        </div>

        <p className="page-subtitle select-guild-help">
          Need a walkthrough?{" "}
          <Link to="/help">Open Help</Link>
          {" · "}
          <a href="/UnderbossHQ-User-Manual.docx" download>
            Download User Manual
          </a>
        </p>
      </div>
    </div>
  );
}
