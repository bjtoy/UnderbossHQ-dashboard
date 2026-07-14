import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import BrandMark from "../components/BrandMark.jsx";
import PremiumPaywall from "../pages/PremiumPaywall.jsx";
import TranslatorWidget from "../components/TranslatorWidget.jsx";
import { useRoles } from "../context/RoleContext.jsx";

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
  const { user, guildId, loading, dashboardAccess, isPlatformOwner } = useRoles();
  const location = useLocation();
  const pageLabel = getPageLabel(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("mobile-nav-open", sidebarOpen);
    return () => document.body.classList.remove("mobile-nav-open");
  }, [sidebarOpen]);

  const billingBlocked =
    guildId &&
    dashboardAccess?.premiumRequired !== false &&
    dashboardAccess?.allowed === false &&
    !(isPlatformOwner && location.pathname.startsWith("/admin/premium"));

  const guildName =
    user?.guilds?.find((guild) => guild.id === guildId)?.name ||
    (guildId ? "Selected server" : "No server selected");

  if (loading) {
    return (
      <div className="loading-screen">Loading your dashboard…</div>
    );
  }

  return (
    <div className={`dashboard-layout${sidebarOpen ? " sidebar-open" : ""}`}>
      <button
        type="button"
        className="dashboard-nav-toggle"
        aria-expanded={sidebarOpen}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        onClick={() => setSidebarOpen((open) => !open)}
      >
        <span aria-hidden="true">{sidebarOpen ? "✕" : "☰"}</span>
      </button>

      {sidebarOpen ? (
        <button
          type="button"
          className="dashboard-sidebar-overlay"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="dashboard-sidebar">
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-brand">
            <BrandMark
              size="header"
              showName={false}
              className="dashboard-topbar-brandmark"
            />
            <h1 className="dashboard-topbar-title">UnderbossHQ</h1>
          </div>

          <div className="dashboard-topbar-meta">
            <p className="dashboard-topbar-page">{pageLabel}</p>
            <p className="dashboard-topbar-welcome">
              Welcome back, <strong>{user?.username || "Member"}</strong>
              <span className="dashboard-topbar-sep"> · </span>
              <span className="dashboard-topbar-guild">{guildName}</span>
            </p>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="dashboard-inner">
            {billingBlocked ? <PremiumPaywall /> : children}
          </div>
        </main>
      </div>

      {!billingBlocked && <TranslatorWidget />}
    </div>
  );
}
