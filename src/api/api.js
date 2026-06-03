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

    return;
  }

  if (res.status === 403) {
    window.location.href =
      "/not-authorized";

    return;
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
};in/sync-roles"
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