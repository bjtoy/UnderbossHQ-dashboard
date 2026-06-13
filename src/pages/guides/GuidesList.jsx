import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api.js";
import { useRoles } from "../../context/RoleContext.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";

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
    <div>
      <div className="action-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>
          Guides
        </h1>
        {canManage ? (
          <Link to="/guides/new" className="btn btn-gold">
            Create Guide
          </Link>
        ) : null}
      </div>

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && guides.length === 0 && (
        <div className="card empty-state">No guides yet.</div>
      )}

      {!loading && !error && guides.length > 0 && (
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
                <Link to={`/guides/${guide.id}`} className="btn btn-outline-gold btn-sm">
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
  );
}
