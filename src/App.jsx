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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* OAuth Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Not Authorized */}
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Protected Routes Wrapped in Dashboard Layout */}
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

        <Route
          path="/moderator"
          element={
            <ProtectedRoute roles={["Admin", "Moderator"]}>
              <DashboardLayout>
                <ModDashboard />
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
