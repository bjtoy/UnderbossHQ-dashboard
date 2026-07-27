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

export function isRevolutCheckoutAvailable(billingConfigured, billingProvider) {
  return billingConfigured && (billingProvider === "revolut" || !billingProvider);
}

export function getPremiumAccessState({
  user,
  guildId,
  dashboardAccess,
  billingProvider,
  billingConfigured,
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
    accessSource: dashboardAccess?.source || null,
  };
}
