export function normalizeProfile(raw = {}) {
  const profile = raw.user || raw.profile || raw || {};

  const get = (keys) => {
    for (const k of keys) {
      const parts = k.split(".");
      let cur = profile;
      for (const p of parts) {
        if (cur == null) break;
        cur = cur[p];
      }
      if (cur !== undefined) return cur;
    }
    return undefined;
  };

  return {
    username:
      get(["username", "user.username", "name", "displayName"]) || null,
    guildName: get(["guildName", "guild.name"]) || null,
    faction:
      get(["faction", "guildName", "stats.faction"]) || null,
    rank: get(["rank", "stats.rank"]) || null,
    dailyTasks:
      get([
        "dailyTasks",
        "daily_tasks",
        "tasks.daily",
        "stats.dailyTasks",
        "stats.daily_tasks",
      ]) ?? null,
    level: get(["level", "stats.level", "power", "stats.power"]) ?? null,
    influence: get(["influence", "stats.influence"]) ?? null,
    warnings: get(["warnings", "stats.warnings"]) ?? null,
  };
}
