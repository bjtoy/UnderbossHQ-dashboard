import { Navigate, useLocation } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function ProtectedRoute({
  roles = null,
  permissions = null,
  children,
}) {
  const {
    user,
    loading,
    hasAnyRole,
    hasPermission,
    guildId,
  } = useRoles();

  const location = useLocation();

  // ========================================
  // STILL LOADING
  // ========================================
  if (loading) {
    return (
      <div
        style={{
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
        }}
      >
        Loading...
      </div>
    );
  }

  // ========================================
  // NOT LOGGED IN
  // ========================================
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ========================================
  // ALLOW ACCESS TO GUILD SELECTOR
  // WITHOUT guildId
  // ========================================
  if (
    !guildId &&
    location.pathname !== "/select-guild"
  ) {
    return <Navigate to="/select-guild" replace />;
  }

  // ========================================
  // ROLE CHECK
  // ========================================
  if (roles && !hasAnyRole(roles)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // ========================================
  // PERMISSION CHECK
  // ========================================
  if (
    permissions &&
    !permissions.every((p) => hasPermission(p))
  ) {
    return <Navigate to="/not-authorized" replace />;
  }

  // ========================================
  // ALLOWED
  // ========================================
  return children;
}