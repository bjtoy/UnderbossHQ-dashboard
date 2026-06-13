import { Navigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function FallbackRoute() {
  const { user, loading } = useRoles();

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

  return <Navigate to="/member" replace />;
}
