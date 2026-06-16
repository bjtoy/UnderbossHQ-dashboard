import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

const TABS = [
  { id: "guide", label: "Guide generator" },
  { id: "announcement", label: "Announcement draft" },
  { id: "moderation", label: "Moderation assistant" },
];

export default function AdminAITools() {
  const { isPlatformOwner } = useRoles();
  const [tab, setTab] = useState("guide");
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [guideTopic, setGuideTopic] = useState("");
  const [guideTone, setGuideTone] = useState("helpful");
  const [guideResult, setGuideResult] = useState(null);

  const [announceTopic, setAnnounceTopic] = useState("");
  const [announceTone, setAnnounceTone] = useState("professional");
  const [announceResult, setAnnounceResult] = useState(null);

  const [modUserId, setModUserId] = useState("");
  const [modResult, setModResult] = useState(null);

  useEffect(() => {
    api.ai
      .status()
      .then((res) => setStatus(res?.data || null))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingStatus(false));
  }, []);

  const aiReady =
    status?.configured && (status?.premium?.active ?? false);

  async function runGuideDraft() {
    setGenerating(true);
    setError(null);
    setMessage("");
    setGuideResult(null);

    try {
      const res = await api.ai.guideDraft({
        topic: guideTopic,
        tone: guideTone,
      });
      setGuideResult(res?.data || null);
      setMessage("Guide draft generated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function runAnnouncementDraft() {
    setGenerating(true);
    setError(null);
    setMessage("");
    setAnnounceResult(null);

    try {
      const res = await api.ai.announcementDraft({
        topic: announceTopic,
        tone: announceTone,
        includeCallToAction: true,
      });
      setAnnounceResult(res?.data || null);
      setMessage("Announcement draft generated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function runModerationSummary() {
    setGenerating(true);
    setError(null);
    setMessage("");
    setModResult(null);

    try {
      const res = await api.ai.moderationSummary({ userId: modUserId });
      setModResult(res?.data || null);
      setMessage("Case summary generated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title="AI Tools"
        subtitle="Draft guides and announcements, or summarize moderation cases."
      />

      {loadingStatus && <Loader />}
      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      {!loadingStatus && status && (
        <div className="page-body page-stack">
          <div className="card page-stack">
            <h3>Status</h3>
            {status.configured ? (
              <p className="muted">
                AI is enabled — model <code>{status.model}</code> (
                {status.provider})
              </p>
            ) : (
              <p className="muted">
                AI is disabled. Set <code>OPENAI_API_KEY</code> on the backend
                to enable these tools.
              </p>
            )}
            {status.premium && !status.premium.active && (
              <p className="muted">
                This server needs an active premium membership to generate
                content.
                {isPlatformOwner ? (
                  <>
                    {" "}
                    <Link to="/admin/premium">Manage premium</Link>
                  </>
                ) : (
                  " Contact your UnderbossHQ platform operator to enable it."
                )}
              </p>
            )}
            {status.premium?.active && (
              <p className="muted">
                Premium active — {status.premium.daysRemaining} day(s)
                remaining.
              </p>
            )}
          </div>

          <div className="action-row">
            {TABS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`btn btn-outline-red btn-sm${
                  tab === entry.id ? " active" : ""
                }`}
                onClick={() => setTab(entry.id)}
              >
                {entry.label}
              </button>
            ))}
          </div>

          {tab === "guide" && (
            <div className="card page-stack">
              <h3>Guide generator</h3>
              <p className="muted">
                Generates guide content using UnderbossHQ markup (banners,
                colors, callouts).
              </p>
              <div className="field-group">
                <label className="field-label" htmlFor="guide-topic">
                  Topic
                </label>
                <input
                  id="guide-topic"
                  className="field-input"
                  value={guideTopic}
                  onChange={(e) => setGuideTopic(e.target.value)}
                  placeholder="e.g. How to join weekly raids"
                />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="guide-tone">
                  Tone
                </label>
                <input
                  id="guide-tone"
                  className="field-input"
                  value={guideTone}
                  onChange={(e) => setGuideTone(e.target.value)}
                  placeholder="helpful, formal, casual..."
                />
              </div>
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={generating || !guideTopic.trim() || !aiReady}
                onClick={runGuideDraft}
              >
                {generating ? "Generating..." : "Generate guide"}
              </button>

              {guideResult && (
                <div className="page-stack">
                  <div className="field-group">
                    <label className="field-label">Suggested title</label>
                    <input
                      className="field-input"
                      readOnly
                      value={guideResult.title || ""}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Content</label>
                    <textarea
                      className="field-textarea guide-editor-textarea"
                      readOnly
                      rows={16}
                      value={guideResult.content || ""}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "announcement" && (
            <div className="card page-stack">
              <h3>Announcement draft</h3>
              <div className="field-group">
                <label className="field-label" htmlFor="announce-topic">
                  Topic
                </label>
                <input
                  id="announce-topic"
                  className="field-input"
                  value={announceTopic}
                  onChange={(e) => setAnnounceTopic(e.target.value)}
                  placeholder="e.g. Server maintenance this Saturday"
                />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="announce-tone">
                  Tone
                </label>
                <input
                  id="announce-tone"
                  className="field-input"
                  value={announceTone}
                  onChange={(e) => setAnnounceTone(e.target.value)}
                  placeholder="professional, urgent, friendly..."
                />
              </div>
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={
                  generating || !announceTopic.trim() || !aiReady
                }
                onClick={runAnnouncementDraft}
              >
                {generating ? "Generating..." : "Generate announcement"}
              </button>

              {announceResult && (
                <div className="page-stack">
                  <div className="field-group">
                    <label className="field-label">Title</label>
                    <input
                      className="field-input"
                      readOnly
                      value={announceResult.title || ""}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Description</label>
                    <textarea
                      className="field-textarea"
                      readOnly
                      rows={6}
                      value={announceResult.description || ""}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "moderation" && (
            <div className="card page-stack">
              <h3>Moderation assistant</h3>
              <p className="muted">
                Summarizes a member&apos;s case file and suggests next steps.
              </p>
              <div className="field-group">
                <label className="field-label" htmlFor="mod-user-id">
                  Discord user ID
                </label>
                <input
                  id="mod-user-id"
                  className="field-input"
                  value={modUserId}
                  onChange={(e) => setModUserId(e.target.value)}
                  placeholder="123456789012345678"
                />
              </div>
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={generating || !modUserId.trim() || !aiReady}
                onClick={runModerationSummary}
              >
                {generating ? "Analyzing..." : "Summarize case"}
              </button>

              {modResult && (
                <div className="page-stack">
                  <p className="muted">
                    {modResult.username || "Unknown member"} —{" "}
                    {modResult.warningCount} warning(s)
                  </p>
                  <textarea
                    className="field-textarea"
                    readOnly
                    rows={12}
                    value={modResult.summary || ""}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
