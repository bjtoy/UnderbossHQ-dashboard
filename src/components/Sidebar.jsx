import { Link, useLocation } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import BrandMark from "./BrandMark.jsx";

function getPageLabel(path) {
  if (path === "/member") return "Member Dashboard";
  if (path === "/moderator") return "Moderator Dashboard";
  if (path === "/admin") return "Admin Dashboard";
  if (path.startsWith("/admin/logs")) return "Live Logs";
  if (path.startsWith("/admin/settings")) return "Server Settings";
  if (path.startsWith("/guides")) return "Guides";
  if (path.startsWith("/announcements")) return "Announcements";
  if (path.startsWith("/moderator/active-cases")) return "Active Cases";
  if (path.startsWith("/moderator/case-history")) return "Case History";
  if (path.startsWith("/moderator/user-lookup")) return "User Lookup";
  return "Dashboard";
}

export default function Sidebar() {
  const { hasAnyRole, roles, user, logout } = useRoles();
  const location = useLocation();
  const path = location.pathname;

  const isModerator = hasAnyRole(["Admin", "Mod", "Moderator"]);
  const isAdmin = hasAnyRole(["Admin"]);

  const navClass = (active) => `nav-item${active ? " active" : ""}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {user?.username && (
          <p className="sidebar-user">{user.username}</p>
        )}
        <BrandMark size="sidebar" subtitle={getPageLabel(path)} />
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <p className="sidebar-section-label">Member</p>
          <Link to="/member" className={navClass(path === "/member")}>
            Dashboard
          </Link>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-label">Content</p>
          <Link
            to="/guides"
            className={navClass(
              path.startsWith("/guides") && path !== "/guides/new"
            )}
          >
            Guides
          </Link>
          <Link
            to="/announcements"
            className={navClass(
              path.startsWith("/announcements") &&
                path !== "/announcements/new"
            )}
          >
            Announcements
          </Link>
        </div>

        {isModerator && (
          <div className="sidebar-section">
            <p className="sidebar-section-label">Moderation</p>
            <Link to="/moderator" className={navClass(path === "/moderator")}>
              Overview
            </Link>
            <Link
              to="/moderator/active-cases"
              className={navClass(path === "/moderator/active-cases")}
            >
              Active Cases
            </Link>
            <Link
              to="/moderator/case-history"
              className={navClass(path === "/moderator/case-history")}
            >
              Case History
            </Link>
            <Link
              to="/moderator/user-lookup"
              className={navClass(path === "/moderator/user-lookup")}
            >
              User Lookup
            </Link>
          </div>
        )}

        {isAdmin && (
          <div className="sidebar-section">
            <p className="sidebar-section-label">Admin</p>
            <Link to="/admin" className={navClass(path === "/admin")}>
              Bot Panel
            </Link>
            <Link
              to="/admin/logs"
              className={navClass(path === "/admin/logs")}
            >
              Live Logs
            </Link>
            <Link
              to="/admin/settings"
              className={navClass(path === "/admin/settings")}
            >
              Settings
            </Link>
          </div>
        )}
      </nav>

      {!isModerator && !isAdmin && (
        <p className="sidebar-note muted">
          Server manager permissions unlock moderator and admin tools.
          {roles?.length ? ` Roles: ${roles.join(", ")}` : ""}
        </p>
      )}

      <div className="sidebar-footer">
        <button
          type="button"
          className="btn btn-outline-gold btn-sm btn-block"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
