// src/pages/AuthCallback.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { refreshUser } = useRoles();

  useEffect(() => {
    async function processLogin() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      // No OAuth code present
      if (!code) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Send OAuth code to backend
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/callback`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        // Failed authentication
        if (!response.ok) {
          navigate("/login", { replace: true });
          return;
        }

        // Refresh user state
        await refreshUser();

        // Redirect to dashboard
        navigate("/", { replace: true });
      } catch (error) {
        console.error("OAuth callback failed:", error);
        navigate("/login", { replace: true });
      }
    }

    processLogin();
  }, [navigate, refreshUser]);

  return (
    <div
      className="app-container"
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1
        className="header-title"
        style={{
          fontSize: "42px",
        }}
      >
        Processing Login...
      </h1>

      <p
        style={{
          marginTop: "20px",
          color: "var(--text-muted)",
        }}
      >
        Please wait while we authenticate your Discord account.
      </p>
    </div>
  );
}