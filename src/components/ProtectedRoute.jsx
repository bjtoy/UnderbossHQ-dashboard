import {
  Navigate,
} from "react-router-dom";

import {
  useRoles,
} from "../context/RoleContext.jsx";

export default function ProtectedRoute({
  children,
}) {

  const {
    user,
    loading,
  } = useRoles();

  console.log(
    "ProtectedRoute",
    {
      loading,
      user,
      pathname:
        window.location.pathname,
    }
  );

  /**
   * =========================
   * WAIT FOR HYDRATION
   * =========================
   */
  if (
    loading ||
    user === undefined
  ) {

    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }

  /**
   * =========================
   * NOT LOGGED IN
   * =========================
   */
  if (user === null) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /**
   * =========================
   * GUILD SELECTION CHECK
   * =========================
   */
  const guildId = localStorage.getItem("guildId");
  const isSelectingGuild = window.location.pathname === "/select-guild";

  if (!guildId && !isSelectingGuild) {
    return (
      <Navigate
        to="/select-guild"
        replace
      />
    );
  }

  /**
   * =========================
   * AUTHENTICATED
   * =========================
   */
  return children;
}