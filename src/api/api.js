import { toastError } from "../utils/toastHelper.js";

let logoutFn = null;
let refreshUserFn = null;

// Allow AuthContext to inject logout + refreshUser
export function registerAuthHandlers({ logout, refreshUser }) {
  logoutFn = logout;
  refreshUserFn = refreshUser;
}

// =======================================
// API BASE
// =======================================
const API_BASE = import.meta.env.VITE_API_URL;

// =======================================
// UNIVERSAL REQUEST WRAPPER
// =======================================
async function request(method, endpoint, body = null) {
  // ===================================
  // GET CURRENT GUILD ID
  // ===================================
  const guildId = localStorage.getItem("guildId");

  const options = {
    method,
    credentials: "include",

    headers: {
      "Content-Type": "application/json",

      // ===================================
      // SEND GUILD ID TO BACKEND
      // ===================================
      ...(guildId
        ? { "x-guild-id": guildId }
        : {}),
    },

    member: {
      profile: () =>
        request("GET", "/api/member/profile"),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  let res;

  try {
    res = await fetch(
      `${API_BASE}${endpoint}`,
      options
    );
  } catch (err) {
    toastError(
      "Network error — server unreachable"
    );

    throw err;
  }

  // ===================================
  // AUTH
  // ===================================
  if (res.status === 401) {
    if (logoutFn) logoutFn();
    return;
  }

  if (res.status === 403) {
    window.location.href =
      "/not-authorized";

    return;
  }

  // ===================================
  // PARSE RESPONSE
  // ===================================
  let data = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // ===================================
  // ERROR HANDLING
  // ===================================
  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      "API request failed";

    toastError(msg);

    throw new Error(msg);
  }

  // ===================================
  // REFRESH USER
  // ===================================
  if (
    ["POST", "PUT", "DELETE"].includes(method) &&
    refreshUserFn
  ) {
    refreshUserFn();
  }

  return data;
}

// =======================================
// API METHODS
// =======================================
export const api = {
  get: (endpoint) =>
    request("GET", endpoint),

  post: (endpoint, body) =>
    request("POST", endpoint, body),

  put: (endpoint, body) =>
    request("PUT", endpoint, body),

  delete: (endpoint) =>
    request("DELETE", endpoint),

  auth: {
    me: () =>
      request("GET", "/api/auth/me"),

    logout: () =>
      request("POST", "/api/auth/logout"),
  },

  guilds: {
    list: () =>
      request("GET", "/api/guilds"),
  },

  bot: {
    mod: {
      overview: () =>
        request(
          "GET",
          "/bot/mod/overview"
        ),

      activeCases: () =>
        request(
          "GET",
          "/bot/mod/active-cases"
        ),

      warnings: (userId) =>
        request(
          "GET",
          `/bot/mod/warnings/${userId}`
        ),

      warn: (data) =>
        request(
          "POST",
          "/bot/mod/warn",
          data
        ),

      kick: (data) =>
        request(
          "POST",
          "/bot/mod/kick",
          data
        ),

      ban: (data) =>
        request(
          "POST",
          "/bot/mod/ban",
          data
        ),
    },

    admin: {
      status: () =>
        request(
          "GET",
          "/bot/admin/status"
        ),

      guildInfo: () =>
        request(
          "GET",
          "/bot/admin/guild-info"
        ),

      reloadConfig: () =>
        request(
          "POST",
          "/bot/admin/reload-config"
        ),

      syncRoles: () =>
        request(
          "POST",
          "/bot/admin/sync-roles"
        ),
    },

    logs: {
      recent: () =>
        request(
          "GET",
          "/bot/logs/recent"
        ),

      cases: () =>
        request(
          "GET",
          "/bot/logs/cases"
        ),
    },
  },
};