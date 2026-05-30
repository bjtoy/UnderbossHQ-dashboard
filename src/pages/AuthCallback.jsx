import {
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useRoles,
} from "../context/RoleContext.jsx";

export default function AuthCallback() {

  const navigate =
    useNavigate();

  const {
    user,
    loading,
    refreshUser,
  } = useRoles();

  /**
   * =========================
   * HYDRATE AUTH
   * =========================
   */
  useEffect(() => {

    console.log(
      "AuthCallback mounted"
    );

    refreshUser();

  }, []);

  /**
   * =========================
   * WAIT FOR AUTH
   * =========================
   */
  useEffect(() => {

    console.log(
      "AuthCallback state",
      {
        pathname:
          window.location.pathname,
        loading,
        user,
      }
    );

    /**
     * STILL LOADING
     */
    if (loading) {

      console.log(
        "Still loading..."
      );

      return;
    }

    /**
     * AUTHENTICATED
     */
    if (user) {

      console.log(
        "Authenticated - navigating to /member"
      );

      navigate(
        "/member",
        {
          replace: true,
        }
      );

      return;
    }

    /**
     * FAILED LOGIN
     */
    if (user === null) {

      console.log(
        "User is null - navigating to /login"
      );

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    }

  }, [
    user,
    loading,
    navigate,
  ]);

  return (
    <div className="loading-screen">
      Finalising Discord login...
    </div>
  );
}