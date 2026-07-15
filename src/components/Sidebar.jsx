import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import BrandMark from "./BrandMark.jsx";

export default function Sidebar({ onNavigate }) {
  const { hasAnyRole, roles, user, logout, setGuildId, isPlatformOwner } = useRoles();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isModerator = hasAnyRole(["Admin", "Mod", "Moderator"]);
  const isAdmin = hasAnyRole(["Admin"]);

  const navClass = (active) => `nav-item${active ? " active" : ""}`;

  function closeNav() {
    onNavigate?.();
  }

  function changeServer() {
    setGuildId(null);
    closeNav();
    navigate("/select-guild");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <BrandMark size="sidebar" />
        {user?.username && (
          <p className="sidebar-user">{user.username}</p>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <p className="sidebar-section-label">Member</p>
          <Link to="/member" className={navClass(path === "/member")} onClick={closeNav}>
            Home
          </Link>
          <Link to="/help" className={navClass(path === "/help")} onClick={closeNav}>
            Help
          </Link>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-label">Content</p>
          <Link
            to="/guides"
            className={navClass(
              path.startsWith("/guides") && path !== "/guides/new"
            )}
            onClick={closeNav}
          >
            Guides
          </Link>
          <Link
            to="/announcements"
            className={navClass(
              path.startsWith("/announcements") &&
                path !== "/announcements/new"
            )}
            onClick={closeNav}
          >
            Announcements
          </Link>
          <Link
            to="/events"
            className={navClass(
              path.startsWith("/events") && path !== "/events/new"
            )}
            onClick={closeNav}
          >
            Events
          </Link>
        </div>

        {isModerator && (
          <div className="sidebar-section">
            <p className="sidebar-section-label">Moderator</p>
            <Link
              to="/moderator"
              className={navClass(path === "/moderator")}
              onClick={closeNav}
            >
              Moderation Tools
            </Link>
            <Link
              to="/admin/analytics"
              className={navClass(path === "/admin/analytics")}
              onClick={closeNav}
            >
              Analytics
            </Link>
            <Link
              to="/moderator/active-cases"
              className={navClass(path === "/moderator/active-cases")}
              onClick={closeNav}
            >
              Active Cases
            </Link>
            <Link
              to="/moderator/case-history"
              className={navClass(path === "/moderator/case-history")}
              onClick={closeNav}
            >
              Case History
            </Link>
            <Link
              to="/moderator/user-lookup"
              className={navClass(path === "/moderator/user-lookup")}
              onClick={closeNav}
            >
              User Lookup
            </Link>
          </div>
        )}

        {isAdmin && (
          <div className="sidebar-section">
            <p className="sidebar-section-label">Admin</p>
            <Link
              to="/admin"
              className={navClass(path === "/admin")}
              onClick={closeNav}
            >
              Admin Dashboard
            </Link>
            <Link
              to="/admin/logs"
              className={navClass(path === "/admin/logs")}
              onClick={closeNav}
            >
              System Logs
            </Link>
            <Link
              to="/admin/webhooks"
              className={navClass(path === "/admin/webhooks")}
              onClick={closeNav}
            >
              Webhooks
            </Link>
            <Link
              to="/admin/invites"
              className={navClass(path === "/admin/invites")}
              onClick={closeNav}
            >
              Invites
            </Link>
            <Link
              to="/admin/users"
              className={navClass(path === "/admin/users")}
              onClick={closeNav}
            >
              Users
            </Link>
            <Link
              to="/admin/settings"
              className={navClass(path === "/admin/settings")}
              onClick={closeNav}
            >
              Settings
            </Link>
          </div>
        )}

        {isPlatformOwner && (
          <div className="sidebar-section">
            <p className="sidebar-section-label">Platform</p>
            <Link
              to="/admin/premium"
              className={navClass(path === "/admin/premium")}
              onClick={closeNav}
            >
              Premium & Billing
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
          className="btn btn-outline-red btn-sm btn-block"
          onClick={changeServer}
        >
          Change Server
        </button>
        <button
          type="button"
          className="btn btn-outline-red btn-sm btn-block sidebar-logout"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
