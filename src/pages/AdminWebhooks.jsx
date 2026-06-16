import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

const EVENT_OPTIONS = [
  { id: "member.joined", label: "Member joined" },
  { id: "moderation.action", label: "Moderation action" },
  { id: "announcement.created", label: "Announcement created" },
  { id: "event.scheduled", label: "Event scheduled" },
];

const EMPTY_FORM = {
  name: "",
  url: "",
  enabled: true,
  events: ["announcement.created"],
};

export default function AdminWebhooks() {
  const [hooks, setHooks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  function loadHooks() {
    setLoading(true);
    api.webhooks
      .list()
      .then((res) => setHooks(res?.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadHooks();
  }, []);

  function toggleEvent(eventId) {
    setForm((prev) => {
      const events = prev.events.includes(eventId)
        ? prev.events.filter((entry) => entry !== eventId)
        : [...prev.events, eventId];
      return { ...prev, events };
    });
  }

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError(null);

    try {
      await api.webhooks.create(form);
      setForm(EMPTY_FORM);
      setMessage("Webhook created.");
      loadHooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled(hook) {
    setError(null);
    try {
      await api.webhooks.update(hook.id, { enabled: !hook.enabled });
      loadHooks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleTest(id) {
    setMessage("");
    setError(null);

    try {
      const res = await api.webhooks.test(id);
      setMessage(res?.message || "Test webhook sent.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this webhook?")) return;

    try {
      await api.webhooks.remove(id);
      setMessage("Webhook deleted.");
      loadHooks();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Webhooks"
        subtitle="Send Discord or HTTPS notifications when server events occur."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      {!loading && (
        <div className="page-body page-stack">
          <form className="card page-stack" onSubmit={handleCreate}>
            <h3>Add webhook</h3>
            <p className="muted">
              Use a Discord channel webhook URL or any HTTPS endpoint.
            </p>

            <div className="field-group">
              <label className="field-label" htmlFor="webhook-name">
                Name
              </label>
              <input
                id="webhook-name"
                className="field-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Mod log channel"
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="webhook-url">
                Webhook URL
              </label>
              <input
                id="webhook-url"
                className="field-input"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://discord.com/api/webhooks/..."
              />
            </div>

            <div className="field-group">
              <span className="field-label">Events</span>
              <div className="action-row">
                {EVENT_OPTIONS.map((option) => (
                  <label key={option.id} className="muted">
                    <input
                      type="checkbox"
                      checked={form.events.includes(option.id)}
                      onChange={() => toggleEvent(option.id)}
                    />{" "}
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-outline-red btn-sm"
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Webhook"}
            </button>
          </form>

          <div className="card">
            <h3>Configured webhooks</h3>
            {hooks.length === 0 ? (
              <p className="muted empty-state">No webhooks configured.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Events</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hooks.map((hook) => (
                    <tr key={hook.id}>
                      <td>{hook.name}</td>
                      <td>{hook.events?.join(", ") || "—"}</td>
                      <td>{hook.enabled ? "Enabled" : "Disabled"}</td>
                      <td>
                        <div className="action-row">
                          <button
                            type="button"
                            className="btn btn-outline-red btn-sm"
                            onClick={() => toggleEnabled(hook)}
                          >
                            {hook.enabled ? "Disable" : "Enable"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-red btn-sm"
                            onClick={() => handleTest(hook.id)}
                          >
                            Test
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(hook.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
