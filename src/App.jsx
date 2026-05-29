import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* AUTH FLOW */
import LoginPage from "./pages/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import SelectGuild from "./pages/SelectGuild.jsx";

/* DASHBOARDS */
import MemberHome from "./pages/MemberHome.jsx";
import ModDashboard from "./pages/ModDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

/* ACCESS CONTROL */
import NotAuthorized from "./pages/NotAuthorized.jsx";

/* LAYOUT */
import DashboardLayout from "./layouts/DashboardLayout.jsx";

/* CONTEXT */
import { useRoles } from "./context/RoleContext.jsx";

/**
 * =========================
 * PROTECTED ROUTE
 * =========================
 */
function ProtectedRoute({
  children,
  roles,
}) {

  const {
    user,
    loading,
  } = useRoles();

 