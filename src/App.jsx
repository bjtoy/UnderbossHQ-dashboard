import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* AUTH */
import LoginPage from "./pages/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import SelectGuild from "./pages/SelectGuild.jsx";

/* DASHBOARDS */
import MemberHome from "./pages/MemberHome.jsx";
import ModDashboard from "./pages/ModDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

/* ACCESS */
import NotAuthorized from "./pages/NotAuthorized.jsx";

/* LAYOUT */
import DashboardLayout from "./layouts/DashboardLayout.jsx";

/* REAL PROTECTED ROUTE */
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/**
 * =========================
 * APP
 * =========================
 */
export default function App() {

  return (
    <Router>

      <Routes>

        {/* =========================
            LOGIN FLOW
        ========================== */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/auth/callback"
          element={<AuthCallback />}
        />

        <Route
          path="/select-guild"
          element={
            <ProtectedRoute>
              <SelectGuild />
            </ProtectedRoute>
          }
        />

        {/* =========================
            MEMBER
        ========================== */}
        <Route
          path="/member"
          element={
            <ProtectedRoute
              roles={["Member", "Moderator", "Admin"]}
            >
              <DashboardLayout>
                <MemberHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* =========================
            MODERATOR
        ========================== */}
        <Route
          path="/moderator"
          element={
            <ProtectedRoute
              roles={["Moderator", "Admin"]}
            >
              <DashboardLayout>
                <ModDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* =========================
            ADMIN
        ========================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              roles={["Admin"]}
            >
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* =========================
            DEFAULT AUTH ROUTE
        ========================== */}
        <Route
          path="/"
          element={
            <Navigate
              to="/member"
              replace
            />
          }
        />

        {/* =========================
            ACCESS DENIED
        ========================== */}
        <Route
          path="/not-authorized"
          element={<NotAuthorized />}
        />

        {/* =========================
            FALLBACK
        ========================== */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </Router>
  );
}