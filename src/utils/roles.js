import { getStoredRoles } from "../context/RoleContext.jsx";

// Wrapper so api.js can read roles without React hooks
export function getRoles() {
  return getStoredRoles(); // returns ["Admin"], ["Moderator"], etc.
}
