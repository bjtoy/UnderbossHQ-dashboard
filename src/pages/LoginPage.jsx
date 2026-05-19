import React from "react";

export default function LoginPage() {
  function handleLogin() {
    // Redirect user to backend OAuth login
    window.location.href = "/api/auth/login";
  }

  return (
    <div
      className="app-container"
      style={{
        textAlign: "center",
        marginTop: "120px",
      }}
    >
      <h1 className="header-title" style={{ fontSize: "48px" }}>
        TGM BOT CONTROL PANEL
      </h1>

      <h2 className="header-subtitle" style={{ marginTop: "10px" }}>
        Login Required
      </h2>

      <p style={{ marginTop: "20px", color: "var(--text-muted)" }}>
        Sign in with Discord to access your dashboard.
      </p>

      <button
        className="btn"
        style={{ marginTop: "40px", padding: "12px 28px" }}
        onClick={handleLogin}
      >
        Login with Discord
      </button>
    </div>
  );
}
