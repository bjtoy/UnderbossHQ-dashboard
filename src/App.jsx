import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/**
 * AUTH
 */
import LoginPage from "./pages/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";

/**
 * GUILD
 */
import SelectGuild from "./pages/SelectGuild.jsx";

/**
 * DASHBOARDS
 */
import MemberHome from "./pages/MemberHome.jsx";
import ModDashboard from "./pages/ModDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

/**
 * MODERATION
 */
import ActiveCases from "./pages/moderation/ActiveCases.jsx";
import CaseHistory from "./pages/moderation/CaseHistory.jsx";
import UserLookup from "./pages/moderation/UserLookup.jsx";

/**
 * ACCESS
 */
import NotAuthorized from "./pages/NotAuthorized.jsx";

/**
 * LAYOUT
 */
import DashboardLayout from "./layouts/DashboardLayout.jsx";

/**
 * PROTECTION
 */
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {

  return (
    <Router>

      <Routes>

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

        <Route
          path="/member"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MemberHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ModDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator/active-cases"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ActiveCases />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator/case-history"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CaseHistory />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator/user-lookup"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UserLookup />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/not-authorized"
          element={
            <NotAuthorized />
          }
        />

        <Route
          path="/"
          element={
            <Navigate
              to="/member"
              replace
            />
          }
        />

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