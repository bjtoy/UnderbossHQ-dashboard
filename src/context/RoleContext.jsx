import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";

import {
  registerAuthHandlers,
} from "../api/api.js";
import { isPublicPath } from "../content/business.js";

const RoleContext =
  createContext();

const API_URL =
  import.meta.env.VITE_API_URL;

export function RoleProvider({
  children,
}) {
  const location = useLocation();
  const onPublicPage = isPublicPath(location.pathname);

  /**
   * =========================
   * AUTH STATE
   * =========================
   */

  /**
   * IMPORTANT:
   * undefined = hydrating
   * null = not logged in
   * object = authenticated
   */
  const [user, setUser] =
    useState(undefined);

  const [roles, setRoles] =
    useState([]);

  const [permissions,
    setPermissions] =
    useState([]);

  const [isPlatformOwner, setIsPlatformOwner] =
    useState(false);

  const [dashboardAccess, setDashboardAccess] =
    useState(null);

  const [billingProvider, setBillingProvider] =
    useState(null);

  const [billingConfigured, setBillingConfigured] =
    useState(false);

  const [loading,
    setLoading] =
    useState(!onPublicPage);

  /**
   * Prevent duplicate loads
   */
  const loadedRef =
    useRef(false);

  /**
   * Prevent updates after unmount
   */
  const mountedRef =
    useRef(true);

  /**
   * =========================
   * GUILD STATE
   * =========================
   */
  const [guildId, setGuildIdState] = useState(() => {
    return localStorage.getItem("guildId") || null;
  });

  function setGuildId(id) {
    if (id) {
      localStorage.setItem("guildId", id);
    } else {
      localStorage.removeItem("guildId");
    }
    setGuildIdState(id);
  }

  /**
   * =========================
   * LOAD USER
   * =========================
   */
  async function loadUser() {
    try {
      setLoading(true);

      const storedGuildId = localStorage.getItem("guildId");

      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
        headers: storedGuildId ? { "x-guild-id": storedGuildId } : {},
      });

      if (response.status === 401) {
        if (!mountedRef.current) {
          return { user: null, roles: [], permissions: [] };
        }

        setUser(null);
        setRoles([]);
        setPermissions([]);
        setIsPlatformOwner(false);
        setDashboardAccess(null);
        setBillingProvider(null);
        setBillingConfigured(false);

        return { user: null, roles: [], permissions: [], isPlatformOwner: false, dashboardAccess: null };
      }

      if (!response.ok) {
        throw new Error(`Auth request failed: ${response.status}`);
      }

      const data = await response.json();

      if (!mountedRef.current) {
        return null;
      }

      const nextUser = data.user || null;
      const nextRoles = Array.isArray(data.roles) ? data.roles : [];
      const nextPermissions = Array.isArray(data.permissions)
        ? data.permissions
        : [];
      const nextIsPlatformOwner = Boolean(data.isPlatformOwner);
      const nextDashboardAccess = data.dashboardAccess || null;
      const nextBillingProvider = data.billingProvider || null;
      const nextBillingConfigured = Boolean(data.billingConfigured);

      setUser(nextUser);
      setRoles(nextRoles);
      setPermissions(nextPermissions);
      setIsPlatformOwner(nextIsPlatformOwner);
      setDashboardAccess(nextDashboardAccess);
      setBillingProvider(nextBillingProvider);
      setBillingConfigured(nextBillingConfigured);

      return {
        user: nextUser,
        roles: nextRoles,
        permissions: nextPermissions,
        isPlatformOwner: nextIsPlatformOwner,
        dashboardAccess: nextDashboardAccess,
        billingProvider: nextBillingProvider,
        billingConfigured: nextBillingConfigured,
      };
    } catch (error) {
      console.error("Failed loading auth state:", error);

      if (!mountedRef.current) {
        return { user: null, roles: [], permissions: [] };
      }

      setUser(null);
      setRoles([]);
      setPermissions([]);
      setIsPlatformOwner(false);
      setDashboardAccess(null);
      setBillingProvider(null);
      setBillingConfigured(false);

      return { user: null, roles: [], permissions: [], isPlatformOwner: false, dashboardAccess: null };
    } finally {
      if (!mountedRef.current) {
        return;
      }

      setLoading(false);
      loadedRef.current = true;
    }
  }

  /**
   * =========================
   * INITIAL LOAD
   * =========================
   */
  useEffect(() => {

    mountedRef.current =
      true;

    if (onPublicPage) {
      setLoading(false);
      loadUser();
      return () => {
        mountedRef.current = false;
      };
    }

    loadUser();

    return () => {

      mountedRef.current =
        false;
    };

  }, [guildId, location.pathname]);

  /**
   * =========================
   * HELPERS
   * =========================
   */
  function hasRole(
    roleName
  ) {

    return roles.includes(
      roleName
    );
  }

  function hasAnyRole(
    roleList
  ) {

    return roleList.some(
      (role) =>
        roles.includes(role)
    );
  }

  function hasPermission(permission) {
    return (
      permissions.includes("*") || permissions.includes(permission)
    );
  }

  /**
   * =========================
   * LOGOUT
   * =========================
   */
  async function logout() {

    try {

      await fetch(
        `${API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials:
            "include",
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

    setIsPlatformOwner(false);
    setDashboardAccess(null);
    setBillingProvider(null);
    setBillingConfigured(false);

    localStorage.removeItem(
      "guildId"
    );

    window.location.href =
      "/login";
  }

  /**
   * =========================
   * REGISTER API HANDLERS
   * =========================
   */
  useEffect(() => {

    registerAuthHandlers({
      logout,
      refreshUser:
        loadUser,
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
        isPlatformOwner,
        dashboardAccess,
        billingProvider,
        billingConfigured,
        refreshUser:
          loadUser,
        logout,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRoles() {

  return useContext(
    RoleContext
  );
}