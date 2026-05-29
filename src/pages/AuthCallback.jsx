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

    refreshUser();

  }, []);

  /**
   * =========================
   * WAIT FOR AUTH
   * =========================
   */
  useEffect(() => {

    /**
     * STILL LOADING
     */
    if (loading) {
      return;
    }

    /**
     * AUTHENTICATED
     */
    if (user) {

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
      Finalising login...
    </div>
  );
}