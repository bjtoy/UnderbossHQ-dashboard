import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import DashboardLayout from "./layouts/DashboardLayout.jsx";

// Pages
import LoginPage from "./pages/LoginPage.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx";
import MemberHome from "./pages/MemberHome.jsx";
import ModDashboard from "./pages/ModDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import SelectGuild from "./pages/SelectGuild.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Discord OAuth Callback Routes */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/discord/callback" element={<AuthCallback />} />

        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Not Authorized */}
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* ================================
            PROTECTED ROUTES
        ================================= */}

        {/* Select Guild Page */}
        <Route
          path="/select-guild"
          element={
            <ProtectedRoute>
              <SelectGuild />
            </ProtectedRoute>
          }
        />

        {/* Member Home */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MemberHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Moderator Dashboard */}
        <Route
          path="/moderator"
          element={
            <ProtectedRoute roles={["Admin", "Mod"]}>
              <DashboardLayout>
                <ModDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
