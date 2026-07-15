import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api.js";
import { useRoles } from "../../context/RoleContext.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import DiscordChannelSelect from "../../components/DiscordChannelSelect.jsx";
import { GuideContentPreview } from "../../components/GuideContent.jsx";

export default function GuidesList() {
  const { hasAnyRole, hasPermission } = useRoles();
  const canManage = hasAnyRole(["Admin", "Mod", "Moderator", "Enforcer"]);
  const canPostToDiscord = hasPermission("PUBLISH_GUIDE");

  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [discordChannelId, setDiscordChannelId] = useState("");
  const [postingId, setPostingId] = useState(null);

  useEffect(() => {
    api.guides
      .list()
      .then((data) => setGuides(data?.data || []))
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
      await api.guides.post(id, { channelId: discordChannelId });
      setMessage("Guide posted to Discord.");
    } catch (err) {
      setError(err.message);
    } finally {
      setPostingId(null);
    }
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Guides"
        subtitle="Faction guides — save in the dashboard, post to Discord."
        actions={
          canManage ? (
            <Link to="/guides/new" className="btn btn-outline-red">
              Create Guide
            </Link>
          ) : null
        }
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      {!loading && !error && (
        <div className="page-body">
          {canPostToDiscord && guides.length > 0 && (
            <div className="card page-stack">
              <DiscordChannelSelect
                id="guides-list-channel"
                label="Discord channel for quick post"
                value={discordChannelId}
                onChange={setDiscordChannelId}
                disabled={postingId !== null}
              />
            </div>
          )}

          {guides.length === 0 ? (
            <div className="card empty-state">No guides yet.</div>
          ) : (
            <div className="page-stack">
              {guides.map((guide) => (
                <div key={guide.id} className="card">
                  <h3>{guide.title}</h3>
                  <p className="muted">
                    Updated {new Date(guide.updatedAt).toLocaleString()}
                  </p>
                  <p className="guide-preview muted">
                    <GuideContentPreview content={guide.content} maxLength={180} />
                  </p>
                  <div className="action-row">
                    <Link
                      to={`/guides/${guide.id}`}
                      className="btn btn-outline-red btn-sm"
                    >
                      View
                    </Link>
                    {canManage && (
                      <>
                        <Link
                          to={`/guides/${guide.id}/edit`}
                          className="btn btn-outline-red btn-sm"
                        >
                          Edit
                        </Link>
                        {canPostToDiscord && (
                          <button
                            type="button"
                            className="btn btn-outline-red btn-sm"
                            disabled={!discordChannelId || postingId === guide.id}
                            onClick={() => handleQuickPost(guide.id)}
                          >
                            {postingId === guide.id
                              ? "Posting..."
                              : "Post to Discord"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
