import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Store token
      localStorage.setItem("authToken", token);

      // Redirect to dashboard
      navigate("/", { replace: true });
    } else {
      // No token found → redirect to login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div
      className="app-container"
      style={{ textAlign: "center", marginTop: "80px" }}
    >
      <h1 className="header-title" style={{ fontSize: "42px" }}>
        Processing Login…
      </h1>

      <p style={{ marginTop: "20px", color: "var(--text-muted)" }}>
        Please wait while we complete your authentication.
      </p>
    </div>
  );
}
