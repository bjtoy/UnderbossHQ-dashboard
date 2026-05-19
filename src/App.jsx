import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Real pages
import LoginPage from "./pages/LoginPage.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx";
import MemberHome from "./pages/MemberHome.jsx";

// Placeholder pages (these will be replaced next)
function ModDashboard() {
  return <h1>Moderator Dashboard</h1>;
}

function AdminDashboard() {
  return <h1>Admin Dashboard</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Not authorized */}
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Member-only route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MemberHome />
            </ProtectedRoute>
          }
        />

        {/* Moderator route */}
        <Route
          path="/moderator"
          element={
            <ProtectedRoute roles={["Admin", "Moderator"]}>
              <ModDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
