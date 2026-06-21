/** Permissions for moderation, guides, invites, and slash commands. */
const DEFAULT_BOT_PERMISSIONS = "1101927672886";

export function getDiscordBotInviteUrl(options = {}) {
  const clientId =
    options.clientId || import.meta.env.VITE_DISCORD_CLIENT_ID;

  if (!clientId?.trim()) {
    return null;
  }

  const permissions =
    options.permissions ||
    import.meta.env.VITE_DISCORD_BOT_PERMISSIONS ||
    DEFAULT_BOT_PERMISSIONS;

  const params = new URLSearchParams({
    client_id: clientId.trim(),
    permissions: String(permissions),
    scope: "bot applications.commands",
  });

  if (options.guildId) {
    params.set("guild_id", options.guildId);
  }

  if (options.disableGuildSelect) {
    params.set("disable_guild_select", "true");
  }

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}
