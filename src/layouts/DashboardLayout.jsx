import Sidebar from "../components/Sidebar.jsx";

export default function DashboardLayout({
  children,
}) {

  return (
    <div
      className="dashboard-layout"
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "var(--bg-darkest)",
        overflow: "hidden",
      }}
    >

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        style={{
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <Sidebar />
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main
        className="dashboard-content"
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "32px",
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "1600px",
            margin: "0 auto",
          }}
        >
          {children}
        </div>

      </main>

    </div>
  );
}