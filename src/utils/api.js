import { toastError } from "./toastHelper.js";

let logoutFn = null;
let refreshUserFn = null;

// Allow RoleContext to inject logout + refreshUser
export function registerAuthHandlers({ logout, refreshUser }) {
  logoutFn = logout;
  refreshUserFn = refreshUser;
}

const API_BASE = "/api";

// ================================================
// UNIVERSAL REQUEST WRAPPER (SESSION-BASED AUTH)
// ================================================
async function request(method, endpoint, body = null) {
  const options = {
    method,
    credentials: "include", // IMPORTANT: send session cookies
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  let res;

  try {
    res = await fetch(`${API_BASE}${endpoint}`, options);
  } catch (err) {
    toastError("Network error — server unreachable");
    throw err;
  }

  // ============================
  // AUTH HANDLING
  // ============================
  if (res.status === 401) {
    // Session expired or not logged in
    if (logoutFn) logoutFn();
    return;
  }

  if (res.status === 403) {
    // User exists but lacks permission
    window.location.href = "/not-authorized";
    return;
  }

  // ============================
  // PARSE JSON SAFELY
  // ============================
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // ============================
  // ERROR HANDLING
  // ============================
  if (!res.ok) {
    toastError(data?.error || "API request failed");
    throw new Error(data?.error || "API request failed");
  }

  // ============================
  // OPTIONAL: REFRESH USER AFTER WRITE
  // ============================
  if (["POST", "PUT", "DELETE"].includes(method) && refreshUserFn) {
    refreshUserFn();
  }

  return data;
}

// ================================================
// PUBLIC API WRAPPER
// ================================================
export const api = {
  get: (endpoint) => request("GET", endpoint),
  post: (endpoint, body) => request("POST", endpoint, body),
  put: (endpoint, body) => request("PUT", endpoint, body),
  delete: (endpoint) => request("DELETE", endpoint),
};
