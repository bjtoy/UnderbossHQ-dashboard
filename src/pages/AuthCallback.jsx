import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { refreshUser } = useRoles();

  useEffect(() => {
    async function finishLogin() {
      try {
        // Refresh authenticated user from backend session
        await refreshUser();

        // Redirect to dashboard
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Login finalisation failed:", error);

        navigate("/login", { replace: true });
      }
    }

    finishLogin();
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
        Signing you in...
      </h1>

      <p
        style={{
          marginTop: "20px",
          color: "var(--text-muted)",
        }}
      >
        Please wait while we load your dashboard.
      </p>
    </div>
  );
}