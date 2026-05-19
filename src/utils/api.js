import { toastError } from "./toastHelper.js";

let logoutFn = null;
let refreshUserFn = null;

// Allow AuthContext to inject logout + refreshUser
export function registerAuthHandlers({ logout, refreshUser }) {
  logoutFn = logout;
  refreshUserFn = refreshUser;
}

const API_BASE = "/api";

async function request(method, endpoint, body = null) {
  const token = localStorage.getItem("authToken");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
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

  // Handle auth errors
  if (res.status === 401) {
    if (logoutFn) logoutFn();
    return;
  }

  if (res.status === 403) {
    window.location.href = "/not-authorized";
    return;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    toastError(data?.error || "API request failed");
    throw new Error(data?.error || "API request failed");
  }

  // Optional: refresh user after successful write operations
  if (["POST", "PUT", "DELETE"].includes(method) && refreshUserFn) {
    refreshUserFn();
  }

  return data;
}

export const api = {
  get: (endpoint) => request("GET", endpoint),
  post: (endpoint, body) => request("POST", endpoint, body),
  put: (endpoint, body) => request("PUT", endpoint, body),
  delete: (endpoint) => request("DELETE", endpoint),
};
