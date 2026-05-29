import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import { registerAuthHandlers } from "../api/api.js";

const RoleContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export function RoleProvider({ children }) {

  // =========================
  // AUTH STATE
  // =========================
  const [user, setUser] = useState(null);

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [loading, setLoading] = useState(true);

  /**
   * Prevent duplicate auth hydration
   */
  const loadedRef = useRef(false);

  /**
   * Prevent state updates after unmount
   */
  const mountedRef = useRef(true);

  // =========================
  // GUILD STATE
  // =========================
  const [guildId, setGuildId] = useState(() => {
    return localStorage.getItem("guildId") || null;
  });

  // =========================
  // LOAD USER
  // =========================
  async function loadUser() {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          credentials: "include",
        }
      );

      // UNAUTHORISED
      if (response.status === 401) {

        if (!mountedRef.current) return;

        setUser(null);
        setRoles([]);
        setPermissions([]);

        return;
      }

      // INVALID RESPONSE
      if (!response.ok) {

        throw new Error(
          `Auth request failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (!mountedRef.current) return;

      // SUCCESS
      setUser(data.user || null);

      setRoles(
        Array.isArray(data.roles)
          ? data.roles
          : []
      );

      setPermissions(
        Array.isArray(data.permissions)
          ? data.permissions
          : []
      );

    } catch (error) {

      console.error(
        "Failed loading auth state:",
        error
      );

      if (!mountedRef.current) return;

      setUser(null);
      setRoles([]);
      setPermissions([]);

    } finally {

      if (!mountedRef.current) return;

      setLoading(false);

      loadedRef.current = true;
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    mountedRef.current = true;

    if (!loadedRef.current) {
      loadUser();
    }

    return () => {
      mountedRef.current = false;
    };

  }, []);

  // =========================
  // HELPERS
  // =========================
  function hasRole(roleName) {

    return roles.includes(roleName);
  }

  function hasAnyRole(roleList) {

    return roleList.some(
      (role) => roles.includes(role)
    );
  }

  function hasPermission(permission) {

    return permissions.includes(permission);
  }

  // =========================
  // LOGOUT
  // =========================
  async function logout() {

    try {

      await fetch(
        `${API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );
    }

    setUser(null);
    setRoles([]);
    setPermissions([]);

    localStorage.removeItem("guildId");

    window.location.href = "/login";
  }

  // =========================
  // API REGISTRATION
  // =========================
  useEffect(() => {

    registerAuthHandlers({
      logout,
      refreshUser: loadUser,
    });

  }, []);

  return (
    <RoleContext.Provider
      value={{
        user,
        roles,
        permissions,
        guildId,
        setGuildId,
        loading,
        hasRole,
        hasAnyRole,
        hasPermission,
        refreshUser: loadUser,
        logout,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRoles() {

  return useContext(RoleContext);
}