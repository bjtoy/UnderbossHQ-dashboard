import { Link, useLocation } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function Sidebar() {
  const { hasAnyRole } = useRoles();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isModerator = hasAnyRole(["Admin", "Mod", "Moderator"]);
  const isAdmin = hasAnyRole(["Admin"]);
  const canEditGuides = hasAnyRole(["Admin", "Mod", "Moderator", "Enforcer"]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">UnderbossHQ</h2>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/member"
          className={`nav-item ${isActive("/member") ? "active" : ""}`}
        >
          Member Dashboard
        </Link>

        <Link
          to="/guides"
          className={`nav-item ${location.pathname.startsWith("/guides") ? "active" : ""}`}
        >
          Guides
        </Link>

        {canEditGuides && (
          <Link
            to="/guides/new"
            className={`nav-item ${isActive("/guides/new") ? "active" : ""}`}
          >
            Create Guide
          </Link>
        )}

        {isModerator && (
          <>
            <Link
              to="/moderator"
              className={`nav-item ${isActive("/moderator") ? "active" : ""}`}
            >
              Moderator Tools
            </Link>
            <Link
              to="/moderator/active-cases"
              className={`nav-item ${isActive("/moderator/active-cases") ? "active" : ""}`}
            >
              Active Cases
            </Link>
            <Link
              to="/moderator/case-history"
              className={`nav-item ${isActive("/moderator/case-history") ? "active" : ""}`}
            >
              Case History
            </Link>
            <Link
              to="/moderator/user-lookup"
              className={`nav-item ${isActive("/moderator/user-lookup") ? "active" : ""}`}
            >
              User Lookup
            </Link>
          </>
        )}

        {isAdmin && (
          <Link
            to="/admin"
            className={`nav-item ${isActive("/admin") ? "active" : ""}`}
          >
            Admin Panel
          </Link>
        )}
      </nav>
    </aside>
  );
}
