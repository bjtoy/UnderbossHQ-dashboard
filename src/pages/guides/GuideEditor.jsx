import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api.js";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import GuideEditorToolbar from "../../components/GuideEditorToolbar.jsx";
import GuideContent from "../../components/GuideContent.jsx";
import { bannerSnippet } from "../../utils/guideMarkup.js";

const STARTER_TEMPLATE = `${bannerSnippet("fancy", "Guide Title")}

Write your introduction here.

:::section
Section Title
:::

:::color-red
Important red text
:::

:::tip
Helpful tip for readers
:::`;

export default function GuideEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(isNew ? STARTER_TEMPLATE : "");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [aiTopic, setAiTopic] = useState("");

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

  async function handleAiDraft() {
    const topic = aiTopic.trim() || title.trim();
    if (!topic) {
      setMessage("Enter a title or AI topic first.");
      return;
    }

    setGenerating(true);
    setMessage("");
    setError(null);

    try {
      const res = await api.ai.guideDraft({ topic });
      const draft = res?.data;
      if (draft?.title) setTitle(draft.title);
      if (draft?.content) setContent(draft.content);
      setMessage("AI draft applied — review before saving.");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
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
        subtitle="Use banners, colored text, and callouts to style your guide."
        actions={
          <Link to="/guides" className="btn btn-outline-red btn-sm">
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

          <GuideEditorToolbar
            content={content}
            onChange={setContent}
            textareaRef={textareaRef}
          />

          <div className="card page-stack ai-inline-panel">
            <p className="field-label">AI draft (optional topic override)</p>
            <div className="dashboard-grid dashboard-grid-3">
              <input
                className="field-input"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder={title || "Guide topic for AI..."}
              />
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={generating}
                onClick={handleAiDraft}
              >
                {generating ? "Generating..." : "Generate with AI"}
              </button>
            </div>
          </div>

          <div className="guide-editor-layout">
            <div className="field-group">
              <label className="field-label" htmlFor="guide-content">
                Content
              </label>
              <textarea
                id="guide-content"
                ref={textareaRef}
                className="field-textarea guide-editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the guide content..."
                rows={18}
              />
            </div>

            <div className="guide-preview-panel">
              <p className="guide-preview-panel-title">Live preview</p>
              <GuideContent content={content} />
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
              <>
                <button
                  type="button"
                  className="btn btn-outline-red btn-sm"
                  onClick={handlePublish}
                  disabled={saving}
                >
                  Publish
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
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
