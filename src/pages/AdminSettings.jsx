import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import DiscordChannelSelect from "../components/DiscordChannelSelect.jsx";

const EMPTY = {
  prefix: "!",
  welcomeChannelId: "",
  logChannelId: "",
  autoRoleId: "",
  guidesChannelId: "",
  rulesChannelId: "",
  announcementsChannelId: "",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.settings
      .get()
      .then((data) => {
        const row = data?.data;
        if (row) {
          setSettings({
            prefix: row.prefix ?? "!",
            welcomeChannelId: row.welcomeChannelId ?? "",
            logChannelId: row.logChannelId ?? "",
            autoRoleId: row.autoRoleId ?? "",
            guidesChannelId: row.guidesChannelId ?? "",
            rulesChannelId: row.rulesChannelId ?? "",
            announcementsChannelId: row.announcementsChannelId ?? "",
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function updateField(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError(null);

    try {
      const result = await api.settings.update(settings);
      const row = result?.data;
      if (row) {
        setSettings({
          prefix: row.prefix ?? "!",
          welcomeChannelId: row.welcomeChannelId ?? "",
          logChannelId: row.logChannelId ?? "",
          autoRoleId: row.autoRoleId ?? "",
          guidesChannelId: row.guidesChannelId ?? "",
          rulesChannelId: row.rulesChannelId ?? "",
          announcementsChannelId: row.announcementsChannelId ?? "",
        });
      }
      setMessage("Settings saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Server Settings"
        subtitle="Guild bot configuration for the selected server."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      {!loading && (
        <div className="page-body">
          <form className="card page-stack" onSubmit={handleSave}>
            <div className="field-group">
              <label className="field-label" htmlFor="settings-prefix">
                Command prefix
              </label>
              <input
                id="settings-prefix"
                className="field-input"
                value={settings.prefix}
                onChange={(e) => updateField("prefix", e.target.value)}
                placeholder="!"
              />
            </div>

            <DiscordChannelSelect
              id="settings-welcome"
              label="Welcome channel"
              value={settings.welcomeChannelId}
              onChange={(value) => updateField("welcomeChannelId", value)}
              disabled={saving}
            />

            <DiscordChannelSelect
              id="settings-log"
              label="Log channel"
              value={settings.logChannelId}
              onChange={(value) => updateField("logChannelId", value)}
              disabled={saving}
            />

            <div className="field-group">
              <label className="field-label" htmlFor="settings-autorole">
                Auto-role ID
              </label>
              <input
                id="settings-autorole"
                className="field-input"
                value={settings.autoRoleId}
                onChange={(e) => updateField("autoRoleId", e.target.value)}
                placeholder="Discord role ID"
              />
            </div>

            <p className="field-label">Default Discord post channels</p>
            <p className="field-hint">
              Used as the pre-selected channel when posting guides and
              announcements from the dashboard.
            </p>

            <DiscordChannelSelect
              id="settings-guides"
              label="Guides channel"
              value={settings.guidesChannelId}
              onChange={(value) => updateField("guidesChannelId", value)}
              disabled={saving}
            />

            <DiscordChannelSelect
              id="settings-rules"
              label="Rules channel"
              value={settings.rulesChannelId}
              onChange={(value) => updateField("rulesChannelId", value)}
              disabled={saving}
            />

            <DiscordChannelSelect
              id="settings-announcements"
              label="Announcements channel"
              value={settings.announcementsChannelId}
              onChange={(value) => updateField("announcementsChannelId", value)}
              disabled={saving}
            />

            <div className="action-row">
              <button type="submit" className="btn btn-outline-red btn-sm" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
