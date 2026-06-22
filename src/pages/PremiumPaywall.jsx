import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import { canManageGuildBilling } from "../utils/guildBillingAuth.js";
import PageHeader from "../components/PageHeader.jsx";

export default function PremiumPaywall() {
  const { user, guildId, isPlatformOwner, dashboardAccess } = useRoles();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubscribe = canManageGuildBilling(user, guildId);

  async function handleSubscribe() {
    setCheckoutLoading(true);
    setError(null);

    try {
      const res = await api.stripe.checkout();
      if (res?.url) {
        window.location.href = res.url;
        return;
      }
      throw new Error("Checkout URL not returned");
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  }

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
                Server owners and admins can subscribe to unlock the dashboard
                for everyone on this server.
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

          {error && <p className="muted">{error}</p>}

          <div className="action-row">
            {canSubscribe && (
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={checkoutLoading}
                onClick={handleSubscribe}
              >
                {checkoutLoading ? "Redirecting…" : "Subscribe with Stripe"}
              </button>
            )}
            <Link to="/select-guild" className="btn btn-outline-red btn-sm">
              Change server
            </Link>
            {isPlatformOwner && (
              <Link to="/admin/premium" className="btn btn-outline-red btn-sm">
                Manage billing
              </Link>
            )}
          </div>

          {!canSubscribe && dashboardAccess?.premiumRequired !== false && (
            <p className="muted">
              Ask a server owner or admin with Manage Server permission to
              subscribe for this server.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
