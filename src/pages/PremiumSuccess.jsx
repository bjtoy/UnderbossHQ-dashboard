import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import { getDefaultRoute } from "../utils/getDefaultRoute.js";
import PageHeader from "../components/PageHeader.jsx";

function readOrderId(searchParams) {
  return (
    searchParams.get("order_id") ||
    searchParams.get("orderId") ||
    searchParams.get("_order_id") ||
    null
  );
}

export default function PremiumSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser, roles } = useRoles();
  const [message, setMessage] = useState("Activating your subscription…");

  useEffect(() => {
    let cancelled = false;
    const provider = searchParams.get("provider");
    const orderId = readOrderId(searchParams);

    async function activate() {
      try {
        if (provider === "revolut" && orderId) {
          try {
            await api.revolut.confirm(orderId);
          } catch {
            // Webhook may activate premium shortly after redirect.
          }
        }

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
  }, [navigate, refreshUser, roles, searchParams]);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Payment confirmed"
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
