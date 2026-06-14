import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api.js";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import { toDatetimeLocalValue } from "../../utils/eventDates.js";

function defaultStartValue() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  return toDatetimeLocalValue(date.toISOString());
}

export default function EventEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState(defaultStartValue());
  const [endsAt, setEndsAt] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isNew) return;

    api.events
      .get(id)
      .then((data) => {
        const event = data?.data;
        if (!event) throw new Error("Event not found");
        setTitle(event.title);
        setDescription(event.description);
        setLocation(event.location || "");
        setStartsAt(toDatetimeLocalValue(event.startsAt));
        setEndsAt(toDatetimeLocalValue(event.endsAt));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  async function handleSave() {
    if (!title.trim() || !description.trim() || !startsAt) {
      setMessage("Title, description, and start time are required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError(null);

    const payload = {
      title,
      description,
      location,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : null,
    };

    try {
      if (isNew) {
        const result = await api.events.create(payload);
        const created = result?.data;
        navigate(`/events/${created?.id || result.id}/edit`, { replace: true });
        setMessage("Event scheduled.");
      } else {
        await api.events.update(id, payload);
        setMessage("Event saved.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew || !window.confirm("Delete this event?")) return;

    setSaving(true);
    setError(null);

    try {
      await api.events.remove(id);
      navigate("/events", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <PageHeader title={isNew ? "Schedule Event" : "Edit Event"} />
        <Loader />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title={isNew ? "Schedule Event" : "Edit Event"}
        actions={
          <Link to="/events" className="btn btn-outline-red btn-sm">
            Back to Events
          </Link>
        }
      />

      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      <div className="page-body">
        <div className="card page-stack">
          <div className="field-group">
            <label className="field-label" htmlFor="event-title">
              Title
            </label>
            <input
              id="event-title"
              className="field-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="event-description">
              Description
            </label>
            <textarea
              id="event-description"
              className="field-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this event about?"
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="event-location">
              Location (optional)
            </label>
            <input
              id="event-location"
              className="field-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Discord channel, voice chat, or in-game"
            />
          </div>

          <div className="dashboard-grid dashboard-grid-2">
            <div className="field-group">
              <label className="field-label" htmlFor="event-starts">
                Starts
              </label>
              <input
                id="event-starts"
                type="datetime-local"
                className="field-input"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="event-ends">
                Ends (optional)
              </label>
              <input
                id="event-ends"
                type="datetime-local"
                className="field-input"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
          </div>

          <div className="action-row">
            <button
              type="button"
              className="btn btn-outline-red btn-sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {!isNew && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={saving}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
