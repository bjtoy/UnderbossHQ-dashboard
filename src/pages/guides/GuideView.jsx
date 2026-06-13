import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/api.js";
import { useRoles } from "../../context/RoleContext.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";

export default function GuideView() {
  const { id } = useParams();
  const { hasAnyRole } = useRoles();
  const canManage = hasAnyRole(["Admin", "Mod", "Moderator", "Enforcer"]);

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.guides
      .get(id)
      .then((data) => {
        if (!data?.data) throw new Error("Guide not found");
        setGuide(data.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorCard message={error} />;

  return (
    <div>
      <div className="action-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>
          {guide.title}
        </h1>
        <div className="action-row">
          <Link to="/guides" className="btn btn-outline-gold btn-sm">
            Back
          </Link>
          {canManage && (
            <Link to={`/guides/${guide.id}/edit`} className="btn btn-gold btn-sm">
              Edit
            </Link>
          )}
        </div>
      </div>

      <div className="card">
        <p className="muted mb-3">
          Updated {new Date(guide.updatedAt).toLocaleString()}
        </p>
        <div className="guide-preview">{guide.content}</div>
      </div>
    </div>
  );
}
