import Sidebar from "../components/Sidebar.jsx";
import { useRoles } from "../context/RoleContext.jsx";

export default function DashboardLayout({ children }) {
  const { user, guildId } = useRoles();

  const guildName =
    user?.guilds?.find((guild) => guild.id === guildId)?.name ||
    (guildId ? "Selected server" : "No server selected");

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        <Sidebar />
      </div>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <span className="dashboard-topbar-label">Active server</span>
          <span className="dashboard-topbar-guild">{guildName}</span>
        </div>

        <main className="dashboard-content">
          <div className="dashboard-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
