import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api.js";
import { useRoles } from "../../context/RoleContext.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";

export default function AnnouncementsList() {
  const { hasAnyRole } = useRoles();
  const canManage = hasAnyRole(["Admin", "Mod", "Moderator"]);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.announcements
      .list()
      .then((data) => setAnnouncements(data?.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Announcements"
        subtitle="Server news and updates."
        actions={
          canManage ? (
            <Link to="/announcements/new" className="btn btn-gold">
              New Announcement
            </Link>
          ) : null
        }
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="page-body">
          {announcements.length === 0 ? (
            <div className="card empty-state">No announcements yet.</div>
          ) : (
            <div className="page-stack">
              {announcements.map((item) => (
                <div key={item.id} className="card">
                  <h3>{item.title}</h3>
                  <p className="muted">
                    Posted {new Date(item.createdAt).toLocaleString()}
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
                        className="btn btn-outline-gold btn-sm"
                      >
                        Edit
                      </Link>
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
