import { Link, useLocation } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function Sidebar() {
  const { user } = useRoles();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">UnderbossHQ</h2>
      </div>

      <nav className="sidebar-nav">

        {/* MEMBER */}
            <Link
              to="/member"
              className={`nav-item ${isActive("/member") ? "active" : ""}`}
            >
              Member Dashboard
            </Link>

        {/* MODERATOR */}
        {(user?.role === "moderator" || user?.role === "admin") && (
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

        {/* ADMIN */}
        {user?.role === "admin" && (
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
