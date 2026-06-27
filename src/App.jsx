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
import CaseDetail from "./pages/moderation/CaseDetail.jsx";
import UserLookup from "./pages/moderation/UserLookup.jsx";
import GuidesList from "./pages/guides/GuidesList.jsx";
import GuideView from "./pages/guides/GuideView.jsx";
import GuideEditor from "./pages/guides/GuideEditor.jsx";
import AnnouncementsList from "./pages/announcements/AnnouncementsList.jsx";
import AnnouncementEditor from "./pages/announcements/AnnouncementEditor.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import InviteTracking from "./pages/InviteTracking.jsx";
import FactionAnalytics from "./pages/FactionAnalytics.jsx";
import AdminWebhooks from "./pages/AdminWebhooks.jsx";
import AdminPremium from "./pages/AdminPremium.jsx";
import PremiumSuccess from "./pages/PremiumSuccess.jsx";
import EventsList from "./pages/events/EventsList.jsx";
import EventEditor from "./pages/events/EventEditor.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PlatformOwnerRoute from "./components/PlatformOwnerRoute.jsx";
import FallbackRoute from "./components/FallbackRoute.jsx";

const MOD_ROLES = ["Admin", "Mod", "Moderator"];
const GUIDE_EDITOR_ROLES = ["Admin", "Mod", "Moderator", "Enforcer"];
const ANNOUNCEMENT_EDITOR_ROLES = ["Admin", "Mod", "Moderator"];
const EVENT_EDITOR_ROLES = ["Admin", "Mod", "Moderator"];

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

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
          path="/announcements"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnnouncementsList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/announcements/new"
          element={
            <ProtectedRoute roles={ANNOUNCEMENT_EDITOR_ROLES}>
              <DashboardLayout>
                <AnnouncementEditor />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/announcements/:id/edit"
          element={
            <ProtectedRoute roles={ANNOUNCEMENT_EDITOR_ROLES}>
              <DashboardLayout>
                <AnnouncementEditor />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EventsList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/new"
          element={
            <ProtectedRoute roles={EVENT_EDITOR_ROLES}>
              <DashboardLayout>
                <EventEditor />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id/edit"
          element={
            <ProtectedRoute roles={EVENT_EDITOR_ROLES}>
              <DashboardLayout>
                <EventEditor />
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
          path="/moderator/cases/:userId"
          element={
            <ProtectedRoute roles={MOD_ROLES}>
              <DashboardLayout>
                <CaseDetail />
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
          path="/admin/webhooks"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <DashboardLayout>
                <AdminWebhooks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/premium/success"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PremiumSuccess />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/premium"
          element={
            <PlatformOwnerRoute>
              <DashboardLayout>
                <AdminPremium />
              </DashboardLayout>
            </PlatformOwnerRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute roles={["Admin", "Mod", "Moderator"]}>
              <DashboardLayout>
                <FactionAnalytics />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/invites"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <DashboardLayout>
                <InviteTracking />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <DashboardLayout>
                <UserManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <DashboardLayout>
                <AdminSettings />
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
