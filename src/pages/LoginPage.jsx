import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import BrandMark from "../components/BrandMark.jsx";
import PublicShell from "../components/PublicShell.jsx";
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

    navigate("/member", { replace: true });
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
    <PublicShell>
      <div className="public-auth-wrap">
        <div className="login-card">
          <BrandMark
            size="lg"
            subtitle="Gaming community server management"
          />
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
          <div className="login-manual">
            <a
              href="/UnderbossHQ-User-Manual.docx"
              download
              className="login-manual-link"
            >
              Download User Manual
            </a>
            <p className="login-manual-hint muted">
              After sign-in, open <strong>Help</strong> in the sidebar for the full
              guide.
            </p>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
