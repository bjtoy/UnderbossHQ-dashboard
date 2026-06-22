export function canManageGuildBilling(user, guildId) {
  if (!user?.id || !guildId) {
    return false;
  }

  if (!Array.isArray(user.guilds)) {
    return false;
  }

  const guild = user.guilds.find((entry) => entry.id === guildId);
  if (!guild) {
    return false;
  }

  const permissions = BigInt(guild.permissions || "0");
  const isAdministrator = (permissions & BigInt(0x8)) === BigInt(0x8);
  const canManageGuild = (permissions & BigInt(0x20)) === BigInt(0x20);

  return isAdministrator || canManageGuild;
}
