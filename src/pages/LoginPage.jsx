import React from "react";
import BrandMark from "../components/BrandMark.jsx";

export default function LoginPage() {
  function handleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/login`;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <BrandMark size="lg" />
        <p className="login-copy">
          Sign in with Discord to access your server dashboard, guides, and
          moderation tools.
        </p>
        <button type="button" className="btn btn-outline-red" onClick={handleLogin}>
          Login with Discord
        </button>
      </div>
    </div>
  );
}
