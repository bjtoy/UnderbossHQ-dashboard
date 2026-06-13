import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import { useRoles } from "../context/RoleContext.jsx";
import mascot from "../assets/images/underboss-mascot.png";

function getPageLabel(path) {
  if (path === "/member") return "Member Dashboard";
  if (path === "/moderator") return "Moderator Dashboard";
  if (path === "/admin") return "Admin Dashboard";
  if (path.startsWith("/admin/logs")) return "System Logs";
  if (path.startsWith("/admin/settings")) return "Server Settings";
  if (path.startsWith("/guides")) return "Guides";
  if (path.startsWith("/announcements")) return "Announcements";
  if (path.startsWith("/moderator/active-cases")) return "Active Cases";
  if (path.startsWith("/moderator/case-history")) return "Case History";
  if (path.startsWith("/moderator/user-lookup")) return "User Lookup";
  return "Dashboard";
}

export default function DashboardLayout({ children }) {
  const { user, guildId, loading } = useRoles();
  const location = useLocation();
  const pageLabel = getPageLabel(location.pathname);

  const guildName =
    user?.guilds?.find((guild) => guild.id === guildId)?.name ||
    (guildId ? "Selected server" : "No server selected");

  if (loading) {
    return (
      <div className="loading-screen">Loading your dashboard…</div>
    );
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        <Sidebar />
      </div>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-text">
            <h1 className="dashboard-topbar-title">UnderbossHQ</h1>
            <p className="dashboard-topbar-page">{pageLabel}</p>
            <p className="dashboard-topbar-welcome">
              Welcome back, <strong>{user?.username || "Member"}</strong>
              <span className="dashboard-topbar-sep"> · </span>
              <span className="dashboard-topbar-guild">{guildName}</span>
            </p>
          </div>

          <div className="dashboard-topbar-art">
            <img
              src={mascot}
              alt="UnderbossHQ mascot"
              className="dashboard-topbar-mascot"
            />
          </div>
        </header>

        <main className="dashboard-content">
          <div className="dashboard-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
