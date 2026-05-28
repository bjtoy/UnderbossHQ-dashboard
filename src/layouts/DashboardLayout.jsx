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
    <div className="dashboard-wrapper">
      {/* ===========================
          TOPBAR
      ============================ */}
      <header
        className="topbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 28px",
          background: "var(--bg-dark)",
          borderBottom: "1px solid rgba(255, 46, 46, 0.2)",
          boxShadow: "0 0 12px rgba(255, 46, 46, 0.25)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        {/* Left: Title */}
        <div>
          <h1
            className="header-title"
            style={{
              fontSize: "26px",
              marginBottom: "4px",
              textShadow: "0 0 10px rgba(255, 46, 46, 0.6)",
            }}
          >
            TGM BOT CONTROL PANEL
          </h1>
          <p
            className="header-subtitle"
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
            }}
          >
            Welcome back, <strong>{user?.username || "User"}</strong>
          </p>
        </div>

        {/* Right: Mascot */}
        <div className="header-art">
          <img
            src={mascot}
            alt="Mascot"
            className="mascot-img"
            style={{
              height: "58px",
              filter: "drop-shadow(0 0 8px rgba(255, 46, 46, 0.6))",
            }}
          />
        </div>
      </header>

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
          marginTop: "90px",
          overflowY: "auto",
        }}
      >
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Home
        </NavLink>

        {/* Guides */}
        <NavLink
          to="/guides"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Guides
        </NavLink>

        {/* Create Guide */}
        {isMod && (
          <NavLink
            to="/guides/create"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Create Guide
          </NavLink>
        )}

        {/* Drafts */}
        {isMod && (
          <NavLink
            to="/guides/drafts"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Drafts
          </NavLink>
        )}

        {/* Publish Guide */}
        {isMod && (
          <NavLink
            to="/guides/publish"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Publish Guide
          </NavLink>
        )}

        {/* Moderator Tools */}
        {isMod && (
          <>
            <div className="sidebar-section-label">Moderator</div>
            <NavLink
              to="/moderator"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Moderation Tools
            </NavLink>
          </>
        )}

        {/* Admin Tools */}
        {isAdmin && (
          <>
            <div className="sidebar-section-label">Admin</div>

            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Admin Dashboard
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              User Management
            </NavLink>

            <NavLink
              to="/admin/roles"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Role Management
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Guide Categories
            </NavLink>

            <NavLink
              to="/admin/logs"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              System Logs
            </NavLink>
          </>
        )}

        {/* ===========================
            CHANGE SERVER BUTTON
        ============================ */}
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

        {/* Logout */}
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
          MAIN CONTENT
      ============================ */}
      <main
        className="app-container"
        style={{
          marginLeft: "240px",
          padding: "30px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
