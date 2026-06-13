import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import { getDefaultRoute } from "../utils/getDefaultRoute.js";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, roles, loading } = useRoles();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const guildId = localStorage.getItem("guildId");

    if (!guildId) {
      navigate("/select-guild", { replace: true });
      return;
    }

    navigate(getDefaultRoute(roles), { replace: true });
  }, [user, roles, loading, navigate]);

  return (
    <div className="loading-screen">
      Authenticating...
    </div>
  );
}
