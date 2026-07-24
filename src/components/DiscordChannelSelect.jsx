import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api.js";
import { debugLog } from "../utils/debugLog.js";

function channelLabel(channel) {
  const typeLabel =
    channel.type === 5
      ? "announcement"
      : channel.type === 15
        ? "forum"
        : "text";
  const category = channel.parentName ? `${channel.parentName} / ` : "";
  return `${category}#${channel.name} (${typeLabel})`;
}

export default function DiscordChannelSelect({
  id,
  label = "Discord channel",
  value,
  onChange,
  defaultChannelId = "",
  placeholder = "Select a channel",
  disabled = false,
  onDefaultsLoaded,
}) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    api.discord
      .channels()
      .then((res) => {
        if (cancelled) return;
        const channelList = res?.data || [];
        const defaults = res?.defaults || {};
        setChannels(channelList);
        onDefaultsLoaded?.(defaults);
        debugLog({
          location: "DiscordChannelSelect.jsx:channels",
          message: "Discord channels loaded",
          hypothesisId: "A",
          data: {
            channelCount: channelList.length,
            hasGuidesDefault: Boolean(defaults.guidesChannelId),
          },
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err.message);
        debugLog({
          location: "DiscordChannelSelect.jsx:channels",
          message: "Discord channels load failed",
          hypothesisId: "A",
          data: { error: err.message },
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (value || !defaultChannelId || loading) return;
    onChange?.(defaultChannelId);
  }, [value, defaultChannelId, loading, onChange]);

  const grouped = useMemo(() => {
    const map = new Map();

    for (const channel of channels) {
      const key = channel.parentName || "Uncategorized";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(channel);
    }

    return [...map.entries()];
  }, [channels]);

  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="field-input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled || loading}
      >
        <option value="">
          {loading ? "Loading channels..." : placeholder}
        </option>
        {grouped.map(([category, items]) => (
          <optgroup key={category} label={category}>
            {items.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channelLabel(channel)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {loadError && (
        <p className="field-hint field-hint-error">
          Could not load channels: {loadError}. Enter a channel ID in admin
          settings or check the bot token.
        </p>
      )}
      {!loadError && !loading && channels.length === 0 && (
        <p className="field-hint">
          No postable channels found. Ensure the bot can see your server
          channels.
        </p>
      )}
    </div>
  );
}
