import { createContext, useContext, useEffect, useState } from "react";
import { registerAuthHandlers } from "../utils/api.js";

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user from backend using stored token
  async function loadUser() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setUser(null);
      setRoles([]);
      setPermissions([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        // Token invalid or expired
        localStorage.removeItem("authToken");
        setUser(null);
        setRoles([]);
        setPermissions([]);
        setLoading(false);
        return;
      }

      if (res.status === 403) {
        // User exists but has no permission
        setUser(null);
        setRoles([]);
        setPermissions([]);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();

      setUser(data.user || null);
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
    } catch (err) {
      console.error("Failed to load user:", err);
      setUser(null);
      setRoles([]);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }

  // Load user on first mount
  useEffect(() => {
    loadUser();
  }, []);

  // Helpers
  function hasRole(roleName) {
    return roles.includes(roleName);
  }

  function hasAnyRole(roleList) {
    return roleList.some((r) => roles.includes(r));
  }

  function hasPermission(permissionName) {
    return permissions.includes(permissionName);
  }

  function logout() {
    localStorage.removeItem("authToken");
    setUser(null);
    setRoles([]);
    setPermissions([]);
    window.location.href = "/login";
  }

  // Register handlers with the API helper
  registerAuthHandlers({
    logout,
    refreshUser: loadUser,
  });

  const value = {
    user,
    roles,
    permissions,
    loading,
    hasRole,
    hasAnyRole,
    hasPermission,
    refreshUser: loadUser,
    logout,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoles() {
  return useContext(RoleContext);
}
