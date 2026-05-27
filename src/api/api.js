// =======================================
// FRONTEND API WRAPPER (FINAL MERGED VERSION)
// Works with Render backend + Vercel frontend
// =======================================

import { toastError } from "./toastHelper.js";

let logoutFn = null;
let refreshUserFn = null;

// Allow AuthContext to inject logout + refreshUser
export function registerAuthHandlers({ logout, refreshUser }) {
  logoutFn = logout;
  refreshUserFn = refreshUser;
}

// =======================================
// CORRECT BASE URL
// Must point to Render backend
// =======================================
const API_BASE = import.meta.env.VITE_API_URL; 
// Example: https://tgm-backend-v5bp.onrender.com

// =======================================
// UNIVERSAL REQUEST WRAPPER
// Handles cookies, errors, auth, redirects
// =======================================
async function request(method, endpoint, body = null) {
  const options = {
    method,
    credentials: "include", // CRITICAL: sends session cookies
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
    if (logoutFn) logoutFn(); // session expired
    return;
  }

  if (res.status === 403) {
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

// =======================================
// PUBLIC API WRAPPER
// =======================================
export const api = {
  get: (endpoint) => request("GET", endpoint),
  post: (endpoint, body) => request("POST", endpoint, body),
  put: (endpoint, body) => request("PUT", endpoint, body),
  delete: (endpoint) => request("DELETE", endpoint),

  // ============================
  // AUTH
  // ============================
  auth: {
    me: () => request("GET", "/api/auth/me"),
    logout: () => request("POST", "/api/auth/logout"),
  },

  // ============================
  // GUILDS
  // ============================
  guilds: {
    list: () => request("GET", "/api/guilds"),
  },

  // ============================
  // BOT → MODERATION
  // ============================
  bot: {
    mod: {
      overview: () => request("GET", "/bot/mod/overview"),
      activeCases: () => request("GET", "/bot/mod/active-cases"),
      warnings: (userId) => request("GET", `/bot/mod/warnings/${userId}`),

      warn: (data) => request("POST", "/bot/mod/warn", data),
      kick: (data) => request("POST",