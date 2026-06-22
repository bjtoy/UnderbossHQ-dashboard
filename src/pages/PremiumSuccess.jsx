import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import { getDefaultRoute } from "../utils/getDefaultRoute.js";
import PageHeader from "../components/PageHeader.jsx";

export default function PremiumSuccess() {
  const navigate = useNavigate();
  const { refreshUser, roles } = useRoles();
  const [message, setMessage] = useState("Activating your subscription…");

  useEffect(() => {
    let cancelled = false;

    async function activate() {
      try {
        const access = await refreshUser();
        if (cancelled) return;

        if (access?.dashboardAccess?.allowed) {
          setMessage("Premium is active. Redirecting to your dashboard…");
          navigate(getDefaultRoute(access.roles || roles), { replace: true });
          return;
        }

        setMessage(
          "Payment received. Premium may take a moment to activate — refresh or try again shortly."
        );
      } catch {
        if (!cancelled) {
          setMessage("Payment received. Return to the dashboard to continue.");
        }
      }
    }

    activate();

    return () => {
      cancelled = true;
    };
  }, [navigate, refreshUser, roles]);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Subscription confirmed"
        subtitle="Thank you for supporting UnderbossHQ."
      />
      <div className="page-body page-stack">
        <div className="card page-stack">
          <p className="muted">{message}</p>
          <div className="action-row">
            <Link to="/member" className="btn btn-outline-red btn-sm">
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
