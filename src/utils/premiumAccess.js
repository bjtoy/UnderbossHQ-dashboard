import { canManageGuildBilling } from "./guildBillingAuth.js";

/** Premium is enforced unless the API explicitly sets premiumRequired: false. */
export function isPremiumEnforced(dashboardAccess) {
  return dashboardAccess?.premiumRequired !== false;
}

export function hasPremiumAccess(dashboardAccess) {
  return dashboardAccess?.allowed === true;
}

/** Logged-in user on a server without premium when billing is enforced. */
export function needsPremiumUpgrade(user, dashboardAccess) {
  return Boolean(user && isPremiumEnforced(dashboardAccess) && !hasPremiumAccess(dashboardAccess));
}

export const PREMIUM_REQUIRED_CODE = "DASHBOARD_PREMIUM_REQUIRED";

export function isPremiumRequiredError(error) {
  if (!error) return false;
  if (error.code === PREMIUM_REQUIRED_CODE) return true;

  const message = String(error.message || error).toLowerCase();
  return (
    message.includes("premium subscription required") ||
    message.includes("premium required")
  );
}

export function isRevolutCheckoutAvailable(billingConfigured, billingProvider) {
  return billingConfigured && (billingProvider === "revolut" || !billingProvider);
}

export function getPremiumAccessState({
  user,
  guildId,
  dashboardAccess,
  billingProvider,
  billingConfigured,
  billingCheckout = null,
}) {
  const premiumEnforced = isPremiumEnforced(dashboardAccess);
  const premiumActive = hasPremiumAccess(dashboardAccess);
  const needsUpgrade = needsPremiumUpgrade(user, dashboardAccess);
  const canSubscribe = canManageGuildBilling(user, guildId);
  const revolutCheckoutAvailable = isRevolutCheckoutAvailable(
    billingConfigured,
    billingProvider
  );

  return {
    premiumEnforced,
    premiumActive,
    needsUpgrade,
    canSubscribe,
    revolutCheckoutAvailable,
    billingConfigured,
    billingProvider,
    billingCheckout,
    accessSource: dashboardAccess?.source || null,
  };
}
