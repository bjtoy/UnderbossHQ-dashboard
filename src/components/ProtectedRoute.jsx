import { Navigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function ProtectedRoute({ roles = null, children }) {
  const token = localStorage.getItem("authToken");
  const { user, loading, hasAnyRole } = useRoles();

  // No token → not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Still loading user data (F3 will improve this)
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user data exists, enforce role checks
  if (user && roles && !hasAnyRole(roles)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // User is allowed
  return children;
}
