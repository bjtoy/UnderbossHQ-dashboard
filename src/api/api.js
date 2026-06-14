import { toastError } from "../utils/toastHelper.js";

let logoutFn = null;
let refreshUserFn = null;

export function registerAuthHandlers({
  logout,
  refreshUser,
}) {
  logoutFn = logout;
  refreshUserFn = refreshUser;
}

const API_BASE = import.meta.env.VITE_API_URL;

async function request(
  method,
  endpoint,
  body = null
) {
  const guildId =
    localStorage.getItem("guildId");

  const options = {
    method,
    credentials: "include",

    headers: {
      "Content-Type":
        "application/json",

      ...(guildId
        ? {
            "x-guild-id":
              guildId,
          }
        : {}),
    },
  };

  if (body) {
    options.body =
      JSON.stringify(body);
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

  if (res.status === 401) {
    if (logoutFn) {
      logoutFn();
    }

    throw new Error("Not authenticated");
  }

  if (res.status === 403) {
    window.location.href = "/not-authorized";
    throw new Error("Forbidden");
  }

  let data = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      "API request failed";

    toastError(msg);

    throw new Error(msg);
  }

  if (
    ["POST", "PUT", "DELETE"].includes(
      method
    ) &&
    refreshUserFn
  ) {
    refreshUserFn();
  }

  return data;
}

export const api = {
  get: (endpoint) =>
    request("GET", endpoint),

  post: (endpoint, body) =>
    request(
      "POST",
      endpoint,
      body
    ),

  put: (endpoint, body) =>
    request(
      "PUT",
      endpoint,
      body
    ),

  delete: (endpoint) =>
    request(
      "DELETE",
      endpoint
    ),

  auth: {
    me: () =>
      request(
        "GET",
        "/api/auth/me"
      ),

    logout: () =>
      request(
        "POST",
        "/api/auth/logout"
      ),
  },

  guilds: {
    list: () =>
      request(
        "GET",
        "/api/guilds"
      ),
  },

  member: {
    profile: () =>
      request(
        "GET",
        "/api/member/profile"
      ),
  },

  bot: {
    admin: {
      status: () =>
        request(
          "GET",
          "/api/bot/admin/status"
        ),

      guildInfo: () =>
        request(
          "GET",
          "/api/bot/admin/guild-info"
        ),

      reloadConfig: () =>
        request(
          "POST",
          "/api/bot/admin/reload-config"
        ),

      syncRoles: () =>
        request(
          "POST",
          "/api/bot/admin/sync-roles"
        ),
    },

    mod: {
      overview: () =>
        request(
          "GET",
          "/api/bot/mod/overview"
        ),

      activeCases: () =>
        request(
          "GET",
          "/api/bot/mod/active-cases"
        ),

      warnings: (userId) =>
        request(
          "GET",
          `/api/bot/mod/warnings/${userId}`
        ),

      warn: (body) =>
        request(
          "POST",
          "/api/bot/mod/warn",
          body
        ),

      kick: (body) =>
        request(
          "POST",
          "/api/bot/mod/kick",
          body
        ),

      ban: (body) =>
        request(
          "POST",
          "/api/bot/mod/ban",
          body
        ),

      promote: (body) =>
        request(
          "POST",
          "/api/bot/mod/promote",
          body
        ),

      demote: (body) =>
        request(
          "POST",
          "/api/bot/mod/demote",
          body
        ),

      caseFile: (userId) =>
        request("GET", `/api/bot/mod/case/${userId}`),

      mute: (body) => request("POST", "/api/bot/mod/mute", body),

      unmute: (body) => request("POST", "/api/bot/mod/unmute", body),

      unban: (body) => request("POST", "/api/bot/mod/unban", body),

      note: (body) => request("POST", "/api/bot/mod/note", body),
    },

    logs: {
      recent: () =>
        request(
          "GET",
          "/api/bot/logs/recent"
        ),

      cases: () =>
        request(
          "GET",
          "/api/bot/logs/cases"
        ),
    },
  },

  guides: {
    list: () => request("GET", "/api/guides"),

    get: (id) => request("GET", `/api/guides/${id}`),

    create: (body) => request("POST", "/api/guides", body),

    update: (id, body) => request("PUT", `/api/guides/${id}`, body),

    remove: (id) => request("DELETE", `/api/guides/${id}`),

    publish: (id) => request("POST", `/api/guides/${id}/publish`),
  },

  announcements: {
    list: () => request("GET", "/api/announcements"),

    get: (id) => request("GET", `/api/announcements/${id}`),

    create: (body) => request("POST", "/api/announcements", body),

    update: (id, body) =>
      request("PUT", `/api/announcements/${id}`, body),

    remove: (id) => request("DELETE", `/api/announcements/${id}`),
  },

  settings: {
    get: () => request("GET", "/api/settings"),

    update: (body) => request("PUT", "/api/settings", body),
  },

  users: {
    list: (search = "") =>
      request(
        "GET",
        search
          ? `/api/users?search=${encodeURIComponent(search)}`
          : "/api/users"
      ),

    get: (id) => request("GET", `/api/users/${id}`),

    create: (body) => request("POST", "/api/users", body),

    update: (id, body) => request("PUT", `/api/users/${id}`, body),

    remove: (id) => request("DELETE", `/api/users/${id}`),
  },

  invites: {
    stats: (limit = 20) =>
      request("GET", `/api/invites/stats?limit=${limit}`),

    recent: (limit = 50) =>
      request("GET", `/api/invites/recent?limit=${limit}`),
  },

  health: {
    status: () => request("GET", "/api/health"),

    errors: (limit = 50) =>
      request("GET", `/api/health/errors?limit=${limit}`),
  },

  analytics: {
    overview: () => request("GET", "/api/analytics/overview"),

    summary: () => request("GET", "/api/analytics/summary"),
  },

  events: {
    list: (upcomingOnly = false) =>
      request(
        "GET",
        upcomingOnly ? "/api/events?upcoming=true" : "/api/events"
      ),

    get: (id) => request("GET", `/api/events/${id}`),

    create: (body) => request("POST", "/api/events", body),

    update: (id, body) => request("PUT", `/api/events/${id}`, body),

    remove: (id) => request("DELETE", `/api/events/${id}`),
  },
};