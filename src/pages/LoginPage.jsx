import React from "react";

export default function LoginPage() {

  function handleLogin() {

    window.location.href =
      `${import.meta.env.VITE_API_URL}/api/auth/login`;
  }

  return (
    <div
      className="app-container"
      style={{
        textAlign: "center",
        marginTop: "120px",
      }}
    >

      <h1
        className="header-title"
        style={{
          fontSize: "48px",
        }}
      >
        TGM BOT CONTROL PANEL
      </h1>

      <h2
        className="header-subtitle"
        style={{
          marginTop: "10px",
        }}
      >
        Login Required
      </h2>

      <p
        style={{
          marginTop: "20px",
          color:
            "var(--text-muted)",
        }}
      >
        Sign in with Discord to
        access your dashboard.
      </p>

      <button
        className="btn btn-gold"
        style={{
          marginTop: "40px",
        }}
        onClick={handleLogin}
      >
        Login with Discord
      </button>

    </div>
  );
}