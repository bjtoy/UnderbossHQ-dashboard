import { Navigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function ProtectedRoute({
  roles = null,
  permissions = null,
  children,
}) {
  const { user, loading, hasAnyRole, hasPermission } = useRoles();

  // Still loading user data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection
  if (roles && !hasAnyRole(roles)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Permission-based protection
  if (permissions && !hasPermission(permissions)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // User is allowed
  return children;
}
