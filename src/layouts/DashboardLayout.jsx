import { NavLink, useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import mascot from "../assets/images/redthornelogo1.png";

export default function DashboardLayout({ children }) {
  const { user, roles, loading, logout } = useRoles();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{
          textAlign: "center",
          marginTop: "120px",
          fontSize: "28px",
          color: "var(--text-muted)",
        }}
      >
        Loading your dashboard…
      </div>
    );
  }

  const safeRoles = Array.isArray(roles) ? roles : [];
  const isMod = safeRoles.includes("Moderator") || safeRoles.includes("Admin");
  const isAdmin = safeRoles.includes("Admin");

  const changeServer = () => {
    try {
      localStorage.removeItem("guildId");
    } catch {}
    navigate("/select-guild");
  };

  return (
    <div
      className="dashboard-wrapper"
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-darkest)",
      }}
    >
      {/* ===========================
          SIDEBAR
      ============================ */}
      <nav
        className="sidebar"
        style={{
          width: "240px",
          background: "var(--bg-darker)",
          borderRight: "1px solid rgba(255, 46, 46, 0.15)",
          padding: "24px 0",
          position: "fixed",
          top: "0",
          bottom: "0",
          left: "0",
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Home
        </NavLink>

        <NavLink to="/guides" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Guides
        </NavLink>

        {isMod && (
          <NavLink to="/guides/create" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Create Guide
          </NavLink>
        )}

        {isMod && (
          <NavLink to="/guides/drafts" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Drafts
          </NavLink>
        )}

        {isMod && (
          <NavLink to="/guides/publish" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Publish Guide
          </NavLink>
        )}

        {isMod && (
          <>
            <div className="sidebar-section-label">Moderator</div>
            <NavLink to="/moderator" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              Moderation Tools
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <div className="sidebar-section-label">Admin</div>

            <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              Admin Dashboard
            </NavLink>

            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              User Management
            </NavLink>

            <NavLink to="/admin/roles" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              Role Management
            </NavLink>

            <NavLink to="/admin/categories" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              Guide Categories
            </NavLink>

            <NavLink to="/admin/logs" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              System Logs
            </NavLink>
          </>
        )}

        <button
          className="btn"
          onClick={changeServer}
          style={{
            marginTop: "20px",
            width: "80%",
            marginLeft: "10%",
            background: "var(--accent)",
          }}
        >
          Change Server
        </button>

        <button
          className="btn logout-btn"
          onClick={logout}
          style={{
            marginTop: "30px",
            width: "80%",
            marginLeft: "10%",
          }}
        >
          Logout
        </button>
      </nav>

      {/* ===========================
          MAIN CONTENT AREA
      ============================ */}
      <div
        style={{
          marginLeft: "240px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* ===========================
            TOPBAR — HERO HEADER
        ============================ */}
        <header
          className="topbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "26px 36px",
            background: "var(--bg-dark)",
            borderBottom: "1px solid rgba(255, 46, 46, 0.25)",
            boxShadow: "0 0 20px rgba(255, 46, 46, 0.35)",
            position: "sticky",
            top: 0,
            zIndex: 5,
          }}
        >
          <div>
            <h1
              className="header-title"
              style={{
                fontSize: "46px",
                marginBottom: "6px",
                fontWeight: "800",
                letterSpacing: "1.5px",
                textShadow: "0 0 16px rgba(255, 46, 46, 0.9)",
              }}
            >
              UnderbossHQ
            </h1>

            <p
              className="header-subtitle"
              style={{
                fontSize: "16px",
                color: "var(--text-muted)",
              }}
            >
              Welcome back, <strong>{user?.username}</strong>
            </p>
          </div>

          <div className="header-art" style={{ display: "flex", alignItems: "center" }}>
            <img
              src={mascot}
              alt="Mascot"
              className="mascot-img"
              style={{
                height: "90px",
                filter: "drop-shadow(0 0 12px rgba(255, 46, 46, 0.9))",
              }}
            />
          </div>
        </header>

        {/* ===========================
            PAGE CONTENT
        ============================ */}
        <main
          className="app-container"
          style={{
            padding: "30px",
            flexGrow: 1,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
