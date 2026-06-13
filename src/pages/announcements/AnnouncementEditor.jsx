import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api.js";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";

export default function AnnouncementEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isNew) return;

    api.announcements
      .get(id)
      .then((data) => {
        const announcement = data?.data;
        if (!announcement) throw new Error("Announcement not found");
        setTitle(announcement.title);
        setDescription(announcement.description);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  async function handleSave() {
    if (!title.trim() || !description.trim()) {
      setMessage("Title and description are required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError(null);

    try {
      if (isNew) {
        const result = await api.announcements.create({ title, description });
        navigate(`/announcements/${result.id}/edit`, { replace: true });
        setMessage("Announcement created.");
      } else {
        await api.announcements.update(id, { title, description });
        setMessage("Announcement saved.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew || !window.confirm("Delete this announcement?")) return;

    setSaving(true);
    setError(null);

    try {
      await api.announcements.remove(id);
      navigate("/announcements", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div>
      <div
        className="action-row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1 className="section-title" style={{ marginBottom: 0 }}>
          {isNew ? "New Announcement" : "Edit Announcement"}
        </h1>
        <Link to="/announcements" className="btn btn-outline-gold btn-sm">
          Back to Announcements
        </Link>
      </div>

      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      <div className="card page-stack">
        <div className="field-group">
          <label className="field-label" htmlFor="announcement-title">
            Title
          </label>
          <input
            id="announcement-title"
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title"
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="announcement-description">
            Description
          </label>
          <textarea
            id="announcement-description"
            className="field-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write the announcement..."
          />
        </div>

        <div className="action-row">
          <button
            type="button"
            className="btn btn-gold"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {!isNew && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
