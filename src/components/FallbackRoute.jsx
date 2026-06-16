import { Navigate, useLocation } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import { getDefaultRoute } from "../utils/getDefaultRoute.js";
import TermsOfService from "../pages/TermsOfService.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";

const PUBLIC_LEGAL_PATHS = {
  "/terms": TermsOfService,
  "/privacy": PrivacyPolicy,
};

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export default function FallbackRoute() {
  const location = useLocation();
  const { user, roles, loading } = useRoles();
  const publicPage = PUBLIC_LEGAL_PATHS[normalizePath(location.pathname)];

  if (publicPage) {
    const Page = publicPage;
    return <Page />;
  }

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
