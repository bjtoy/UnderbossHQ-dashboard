import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api.js";
import { useRoles } from "../../context/RoleContext.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";

export default function GuidesList() {
  const { hasAnyRole } = useRoles();
  const canManage = hasAnyRole(["Admin", "Mod", "Moderator", "Enforcer"]);

  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.guides
      .list()
      .then((data) => setGuides(data?.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Guides"
        subtitle="Faction guides and reference material."
        actions={
          canManage ? (
            <Link to="/guides/new" className="btn btn-gold">
              Create Guide
            </Link>
          ) : null
        }
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="page-body">
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
                  <p className="guide-preview">
                    {guide.content.length > 180
                      ? `${guide.content.slice(0, 180)}…`
                      : guide.content}
                  </p>
                  <div className="action-row">
                    <Link
                      to={`/guides/${guide.id}`}
                      className="btn btn-outline-gold btn-sm"
                    >
                      View
                    </Link>
                    {canManage && (
                      <Link
                        to={`/guides/${guide.id}/edit`}
                        className="btn btn-gold btn-sm"
                      >
                        Edit
                      </Link>
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
