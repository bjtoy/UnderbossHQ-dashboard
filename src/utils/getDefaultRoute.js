const MOD_ROLES = ["Admin", "Mod", "Moderator"];

function hasAnyRole(roles, allowed) {
  return allowed.some((role) => roles.includes(role));
}

/**
 * Pick the best landing route after login / guild selection.
 */
export function getDefaultRoute(roles = []) {
  if (roles.includes("Admin")) {
    return "/admin";
  }

  if (hasAnyRole(roles, MOD_ROLES)) {
    return "/moderator";
  }

  return "/member";
}
