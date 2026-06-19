import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api.js";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import DiscordChannelSelect from "../../components/DiscordChannelSelect.jsx";

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
  const [discordChannelId, setDiscordChannelId] = useState("");
  const [defaultAnnouncementsChannelId, setDefaultAnnouncementsChannelId] =
    useState("");

  function applyChannelDefaults(defaults = {}) {
    if (defaults.announcementsChannelId) {
      setDefaultAnnouncementsChannelId(defaults.announcementsChannelId);
    }
  }

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
      return null;
    }

    setSaving(true);
    setMessage("");
    setError(null);

    try {
      if (isNew) {
        const result = await api.announcements.create({ title, description });
        navigate(`/announcements/${result.id}/edit`, { replace: true });
        setMessage("Announcement created.");
        return result.id;
      }

      await api.announcements.update(id, { title, description });
      setMessage("Announcement saved.");
      return id;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handlePostToDiscord(postId = id) {
    const targetId = postId || id;

    if (!targetId || targetId === "new") {
      setMessage("Save the announcement before posting to Discord.");
      return;
    }

    if (!discordChannelId) {
      setMessage("Select a Discord channel first.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await api.announcements.post(targetId, { channelId: discordChannelId });
      setMessage("Announcement posted to Discord.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAndPost() {
    if (!discordChannelId) {
      setMessage("Select a Discord channel first.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setMessage("Title and description are required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError(null);

    try {
      let targetId = isNew ? null : id;

      if (isNew) {
        const result = await api.announcements.create({ title, description });
        targetId = result.id;
      } else {
        await api.announcements.update(id, { title, description });
      }

      await api.announcements.post(targetId, { channelId: discordChannelId });

      if (isNew) {
        navigate(`/announcements/${targetId}/edit`, { replace: true });
      }

      setMessage("Announcement saved and posted to Discord.");
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

  if (loading) {
    return (
      <div className="dashboard-page">
        <PageHeader title={isNew ? "New Announcement" : "Edit Announcement"} />
        <Loader />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title={isNew ? "New Announcement" : "Edit Announcement"}
        actions={
          <Link to="/announcements" className="btn btn-outline-red btn-sm">
            Back to Announcements
          </Link>
        }
      />

      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      <div className="page-body">
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

          <DiscordChannelSelect
            id="announcement-discord-channel"
            label="Post to Discord channel"
            value={discordChannelId}
            onChange={setDiscordChannelId}
            defaultChannelId={defaultAnnouncementsChannelId}
            disabled={saving}
            onDefaultsLoaded={applyChannelDefaults}
          />

          <div className="action-row">
            <button
              type="button"
              className="btn btn-outline-red"
              onClick={() => handleSave()}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {discordChannelId && (
              <button
                type="button"
                className="btn btn-outline-red"
                onClick={handleSaveAndPost}
                disabled={saving}
              >
                Save & post to Discord
              </button>
            )}
            {!isNew && (
              <>
                <button
                  type="button"
                  className="btn btn-outline-red"
                  onClick={() => handlePostToDiscord()}
                  disabled={saving || !discordChannelId}
                >
                  Post to Discord
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
