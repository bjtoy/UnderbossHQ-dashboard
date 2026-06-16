import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/api.js";
import { useRoles } from "../../context/RoleContext.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import GuideContent from "../../components/GuideContent.jsx";

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

  if (loading) {
    return (
      <div className="dashboard-page">
        <PageHeader title="Guide" />
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <PageHeader title="Guide" />
        <ErrorCard message={error} />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title={guide.title}
        subtitle={`Updated ${new Date(guide.updatedAt).toLocaleString()}`}
        actions={
          <>
            <Link to="/guides" className="btn btn-outline-red btn-sm">
              Back
            </Link>
            {canManage && (
              <Link
                to={`/guides/${guide.id}/edit`}
                className="btn btn-outline-red btn-sm"
              >
                Edit
              </Link>
            )}
          </>
        }
      />

      <div className="page-body">
        <div className="card">
          <GuideContent content={guide.content} />
        </div>
      </div>
    </div>
  );
}
