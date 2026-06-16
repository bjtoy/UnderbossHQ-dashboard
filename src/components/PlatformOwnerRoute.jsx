import { Navigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function PlatformOwnerRoute({ children }) {
  const { user, loading, isPlatformOwner } = useRoles();

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
  if (!guildId && window.location.pathname !== "/select-guild") {
    return <Navigate to="/select-guild" replace />;
  }

  if (!isPlatformOwner) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}
