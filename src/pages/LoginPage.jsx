import React from "react";

export default function LoginPage() {
  function handleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/login`;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">UnderbossHQ</h1>
        <h2 className="login-subtitle">TGM Bot Control Panel</h2>
        <p className="login-copy">
          Sign in with Discord to access your server dashboard, guides, and
          moderation tools.
        </p>
        <button type="button" className="btn btn-gold" onClick={handleLogin}>
          Login with Discord
        </button>
      </div>
    </div>
  );
}
