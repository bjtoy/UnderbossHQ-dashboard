export function getDashboardUrl() {
  const configured = import.meta.env.VITE_DASHBOARD_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }

  return "";
}
