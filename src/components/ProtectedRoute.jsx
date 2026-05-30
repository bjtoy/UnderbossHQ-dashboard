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
   * AUTHENTICATED
   * =========================
   */
  return children;
}