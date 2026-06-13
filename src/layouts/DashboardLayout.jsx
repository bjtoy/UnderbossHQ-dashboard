import Sidebar from "../components/Sidebar.jsx";

export default function DashboardLayout({
  children,
}) {

  return (
    <div className="dashboard-layout">
      <aside style={{ flexShrink: 0, zIndex: 10 }}>
        <Sidebar />
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-inner">
          {children}
        </div>
      </main>
    </div>
  );
}