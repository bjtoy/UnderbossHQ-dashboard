import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api.js";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";

export default function GuideEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isNew) return;

    api.guides
      .get(id)
      .then((data) => {
        const guide = data?.data;
        if (!guide) throw new Error("Guide not found");
        setTitle(guide.title);
        setContent(guide.content);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setMessage("Title and content are required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError(null);

    try {
      if (isNew) {
        const result = await api.guides.create({ title, content });
        navigate(`/guides/${result.id}/edit`, { replace: true });
        setMessage("Guide created.");
      } else {
        await api.guides.update(id, { title, content });
        setMessage("Guide saved.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (isNew) {
      setMessage("Save the guide before publishing.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await api.guides.publish(id);
      setMessage("Guide published.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew || !window.confirm("Delete this guide?")) return;

    setSaving(true);
    setError(null);

    try {
      await api.guides.remove(id);
      navigate("/guides", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <PageHeader title={isNew ? "Create Guide" : "Edit Guide"} />
        <Loader />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title={isNew ? "Create Guide" : "Edit Guide"}
        actions={
          <Link to="/guides" className="btn btn-outline-gold btn-sm">
            Back to Guides
          </Link>
        }
      />

      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      <div className="page-body">
        <div className="card page-stack">
          <div className="field-group">
            <label className="field-label" htmlFor="guide-title">
              Title
            </label>
            <input
              id="guide-title"
              className="field-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Guide title"
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="guide-content">
              Content
            </label>
            <textarea
              id="guide-content"
              className="field-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the guide content..."
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
              <>
                <button
                  type="button"
                  className="btn btn-outline-gold"
                  onClick={handlePublish}
                  disabled={saving}
                >
                  Publish
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
