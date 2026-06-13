import { Navigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import { getDefaultRoute } from "../utils/getDefaultRoute.js";

export default function FallbackRoute() {
  const { user, roles, loading } = useRoles();

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

  return <Navigate to={getDefaultRoute(roles)} replace />;
}
