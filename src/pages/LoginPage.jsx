import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import BrandMark from "../components/BrandMark.jsx";
import { getDiscordBotInviteUrl } from "../utils/discordBotInvite.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, guildId } = useRoles();

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    if (!guildId) {
      navigate("/select-guild", { replace: true });
      return;
    }

    navigate("/", { replace: true });
  }, [user, loading, guildId, navigate]);

  function handleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/login`;
  }

  const botInviteUrl = getDiscordBotInviteUrl();

  if (loading) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <BrandMark size="lg" />
        <p className="login-copy">
          Sign in with Discord to access your server dashboard, guides, and
          moderation tools. Add the bot first if it is not in your server yet.
        </p>
        <div className="login-actions">
          <button type="button" className="btn btn-outline-red" onClick={handleLogin}>
            Login with Discord
          </button>
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
        </div>
        <p className="login-legal-links">
          <Link to="/terms">Terms of Service</Link>
          {" · "}
          <Link to="/privacy">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
