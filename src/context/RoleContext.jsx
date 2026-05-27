import { createContext, useContext, useEffect, useState } from "react";
import { registerAuthHandlers } from "../utils/api.js";

const RoleContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export function RoleProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // GUILD CONTEXT
  // ================================
  const [guildId, setGuildId] = useState(() => {
    return localStorage.getItem("guildId") || null;
  });

  // Keep localStorage in sync when guildId changes
  useEffect(() => {
    if (guildId) {
      localStorage.setItem("guildId", guildId);
    } else {
      localStorage.removeItem("guildId");
    }
  }, [guildId]);

  // ================================
  // LOAD USER FROM BACKEND SESSION
  // ================================
  async function loadUser() {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
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

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  // ================================
  // HELPERS
  // ================================
  function hasRole(roleName) {
    return roles.includes(roleName);
  }

  function hasAnyRole(roleList) {
    return roleList.some((r) => roles.includes(r));
  }

  function hasPermission(permissionName) {
    return permissions.includes(permissionName);
  }

  // ================================
  // LOGOUT
  // ================================
  async function logout() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    setRoles([]);
    setPermissions([]);
    setGuildId(null);
    window.location.href = "/login";
  }

  registerAuthHandlers({
    logout,
    refreshUser: loadUser,
  });

  const value = {
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
