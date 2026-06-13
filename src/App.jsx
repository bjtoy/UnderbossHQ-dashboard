import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import SelectGuild from "./pages/SelectGuild.jsx";
import MemberHome from "./pages/MemberHome.jsx";
import ModDashboard from "./pages/ModDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogs from "./pages/AdminLogs.jsx";
import ActiveCases from "./pages/moderation/ActiveCases.jsx";
import CaseHistory from "./pages/moderation/CaseHistory.jsx";
import UserLookup from "./pages/moderation/UserLookup.jsx";
import GuidesList from "./pages/guides/GuidesList.jsx";
import GuideView from "./pages/guides/GuideView.jsx";
import GuideEditor from "./pages/guides/GuideEditor.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import FallbackRoute from "./components/FallbackRoute.jsx";

const MOD_ROLES = ["Admin", "Mod", "Moderator"];
const GUIDE_EDITOR_ROLES = ["Admin", "Mod", "Moderator", "Enforcer"];

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

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
          path="/guides"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <GuidesList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/guides/new"
          element={
            <ProtectedRoute roles={GUIDE_EDITOR_ROLES}>
              <DashboardLayout>
                <GuideEditor />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/guides/:id/edit"
          element={
            <ProtectedRoute roles={GUIDE_EDITOR_ROLES}>
              <DashboardLayout>
                <GuideEditor />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/guides/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <GuideView />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator"
          element={
            <ProtectedRoute roles={MOD_ROLES}>
              <DashboardLayout>
                <ModDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator/active-cases"
          element={
            <ProtectedRoute roles={MOD_ROLES}>
              <DashboardLayout>
                <ActiveCases />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator/case-history"
          element={
            <ProtectedRoute roles={MOD_ROLES}>
              <DashboardLayout>
                <CaseHistory />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator/user-lookup"
          element={
            <ProtectedRoute roles={MOD_ROLES}>
              <DashboardLayout>
                <UserLookup />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <DashboardLayout>
                <AdminLogs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/" element={<Navigate to="/member" replace />} />
        <Route path="*" element={<FallbackRoute />} />
      </Routes>
    </Router>
  );
}
