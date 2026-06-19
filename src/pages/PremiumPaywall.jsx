import { Link } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function PremiumPaywall() {
  const { user, isPlatformOwner, dashboardAccess } = useRoles();

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Premium required"
        subtitle="This server does not have an active UnderbossHQ subscription."
      />

      <div className="page-body page-stack">
        <div className="card page-stack">
          <p className="muted">
            {user?.username ? (
              <>
                Signed in as <strong>{user.username}</strong>.
              </>
            ) : (
              "You are signed in."
            )}{" "}
            To use the dashboard on this server, the server needs premium billing
            — or you need complimentary access from the platform operator.
          </p>

          {dashboardAccess?.premiumRequired === false ? (
            <p className="muted">
              Billing enforcement is disabled in this environment.
            </p>
          ) : (
            <ul className="muted page-stack" style={{ paddingLeft: "1.2rem" }}>
              <li>
                Server owners can purchase premium when self-serve billing is
                connected.
              </li>
              <li>
                Operators can grant complimentary access to specific Discord
                users who should use the dashboard for free.
              </li>
              <li>
                Paying servers unlock access for all members on that server.
              </li>
            </ul>
          )}

          <div className="action-row">
            <Link to="/select-guild" className="btn btn-outline-red btn-sm">
              Change server
            </Link>
            {isPlatformOwner && (
              <Link to="/admin/premium" className="btn btn-outline-red btn-sm">
                Manage billing
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
