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
    faction:
      get(["faction", "stats.faction"]) || null,
    rank: get(["rank", "stats.rank"]) || null,
    dailyTasks:
      get([
        "dailyTasks",
        "daily_tasks",
        "tasks.daily",
        "stats.dailyTasks",
        "stats.daily_tasks",
      ]) ?? null,
    power: get(["power", "stats.power"]) ?? null,
    influence: get(["influence", "stats.influence"]) ?? null,
  };
}
