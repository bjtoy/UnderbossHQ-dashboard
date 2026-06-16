export function formatEventRange(startsAt, endsAt) {
  const start = new Date(startsAt);
  const startText = start.toLocaleString();

  if (!endsAt) {
    return startText;
  }

  const end = new Date(endsAt);
  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} – ${end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return `${startText} – ${end.toLocaleString()}`;
}

export function toDatetimeLocalValue(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);

  return local.toISOString().slice(0, 16);
}

export function isUpcoming(startsAt) {
  return new Date(startsAt) >= new Date();
}

export function eventStatus(startsAt, endsAt) {
  const now = new Date();
  const start = new Date(startsAt);
  const end = endsAt ? new Date(endsAt) : null;

  if (start > now) return "upcoming";
  if (end && end < now) return "ended";
  if (start <= now && (!end || end >= now)) return "live";
  return "ended";
}
