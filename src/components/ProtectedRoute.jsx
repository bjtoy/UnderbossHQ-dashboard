import { Navigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function ProtectedRoute({ children, roles = null }) {
  const { user, loading, hasAnyRole } = useRoles();

  if (loading || user === undefined) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  const guildId = localStorage.getItem("guildId");
  const isSelectingGuild = window.location.pathname === "/select-guild";

  if (!guildId && !isSelectingGuild) {
    return <Navigate to="/select-guild" replace />;
  }

  if (roles?.length && !hasAnyRole(roles)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}
