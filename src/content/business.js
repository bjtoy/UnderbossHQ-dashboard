/** Public business details for banking, legal pages, and contact. No secrets. */

export const BUSINESS = {
  name: "UnderbossHQ",
  legalName: "UnderbossHQ",
  productDescription:
    "UnderbossHQ provides a web dashboard and Discord bot for community and game server management — guides, announcements, moderation tools, and subscription billing.",
  website:
    import.meta.env.VITE_DASHBOARD_URL ||
    "https://underbosshq-two.vercel.app",
  contactEmail:
    import.meta.env.VITE_BUSINESS_CONTACT_EMAIL ||
    "underbosshq@outlook.com.au",
  contactPhone:
    import.meta.env.VITE_BUSINESS_CONTACT_PHONE || "+61403713713",
  contactPhoneDisplay: "+61 403 713 713",
  country: "Australia",
  currency: "AUD",
};

/** Paths that must work with no login (business banking, SEO, legal). */
export const PUBLIC_PATHS = [
  "/",
  "/pricing",
  "/help/public",
  "/demo",
  "/contact",
  "/terms",
  "/privacy",
  "/login",
];

export function isPublicPath(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  return PUBLIC_PATHS.some((entry) => {
    if (entry === "/") return path === "/";
    return path === entry || path.startsWith(`${entry}/`);
  });
}
