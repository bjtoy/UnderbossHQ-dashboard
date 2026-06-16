import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api.js";
import { useRoles } from "../../context/RoleContext.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import DiscordChannelSelect from "../../components/DiscordChannelSelect.jsx";

export default function AnnouncementsList() {
  const { hasAnyRole } = useRoles();
  const canManage = hasAnyRole(["Admin", "Mod", "Moderator"]);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [discordChannelId, setDiscordChannelId] = useState("");
  const [postingId, setPostingId] = useState(null);

  useEffect(() => {
    api.announcements
      .list()
      .then((data) => setAnnouncements(data?.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleQuickPost(id) {
    if (!discordChannelId) {
      setMessage("Select a Discord channel first.");
      return;
    }

    setPostingId(id);
    setMessage("");
    setError(null);

    try {
      await api.announcements.post(id, { channelId: discordChannelId });
      setMessage("Announcement posted to Discord.");
    } catch (err) {
      setError(err.message);
    } finally {
      setPostingId(null);
    }
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Announcements"
        subtitle="Server news and updates — save in the dashboard, post to Discord."
        actions={
          canManage ? (
            <Link to="/announcements/new" className="btn btn-outline-red">
              New Announcement
            </Link>
          ) : null
        }
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      {!loading && !error && (
        <div className="page-body">
          {canManage && announcements.length > 0 && (
            <div className="card page-stack">
              <DiscordChannelSelect
                id="announcements-list-channel"
                label="Discord channel for quick post"
                value={discordChannelId}
                onChange={setDiscordChannelId}
                disabled={postingId !== null}
              />
            </div>
          )}

          {announcements.length === 0 ? (
            <div className="card empty-state">No announcements yet.</div>
          ) : (
            <div className="page-stack">
              {announcements.map((item) => (
                <div key={item.id} className="card">
                  <h3>{item.title}</h3>
                  <p className="muted">
                    Saved {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <p className="guide-preview">
                    {item.description.length > 220
                      ? `${item.description.slice(0, 220)}…`
                      : item.description}
                  </p>
                  {canManage && (
                    <div className="action-row">
                      <Link
                        to={`/announcements/${item.id}/edit`}
                        className="btn btn-outline-red btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-red btn-sm"
                        disabled={!discordChannelId || postingId === item.id}
                        onClick={() => handleQuickPost(item.id)}
                      >
                        {postingId === item.id
                          ? "Posting..."
                          : "Post to Discord"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
