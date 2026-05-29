import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useRoles } from "../context/RoleContext.jsx";

export default function LoginPage() {

  const navigate = useNavigate();

  const {
    user,
    loading,
    guildId,
  } = useRoles();

  // =========================
  // REDIRECT AUTHENTICATED USERS
  // =========================
  useEffect(() => {

    if (loading) return;

    // NOT LOGGED IN
    if (!user) return;

    // LOGGED IN BUT NO GUILD
    if (!guildId) {

      navigate("/select-guild", {
        replace: true,
      });

      return;
    }

    // FULLY AUTHENTICATED
    navigate("/", {
      replace: true,
    });

  }, [
    user,
    loading,
    guildId,
    navigate,
  ]);

  // =========================
  // LOGIN
  // =========================
  function handleLogin() {

    window.location.href =
      `${import.meta.env.VITE_API_URL}/api/auth/login`;
  }

  // =========================
  // WAIT FOR HYDRATION
  // =========================
  if (loading) {

    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
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
          color: "var(--text-muted)",
        }}
      >
        Sign in with Discord to access your dashboard.
      </p>

      <button
        className="btn"
        style={{
          marginTop: "40px",
          padding: "12px 28px",
        }}
        onClick={handleLogin}
      >
        Login with Discord
      </button>

    </div>
  );
}