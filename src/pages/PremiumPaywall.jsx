import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import { canManageGuildBilling } from "../utils/guildBillingAuth.js";
import PageHeader from "../components/PageHeader.jsx";

export default function PremiumPaywall() {
  const {
    user,
    guildId,
    isPlatformOwner,
    dashboardAccess,
    billingProvider,
    billingConfigured,
  } = useRoles();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubscribe = canManageGuildBilling(user, guildId);
  const guildName =
    user?.guilds?.find((g) => g.id === guildId)?.name || "this server";
  const revolutPaywall =
    billingConfigured && (billingProvider === "revolut" || !billingProvider);

  async function handleSubscribe() {
    setCheckoutLoading(true);
    setError(null);

    try {
      const res = await api.billing.checkout();
      if (res?.url) {
        window.location.href = res.url;
        return;
      }
      throw new Error("Revolut checkout URL not returned");
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
        subtitle={`${guildName} needs an active subscription before members can use the dashboard.`}
      />

      <div className="page-body page-stack">
        <div className="card page-stack">
          <h3>What you can do</h3>

          {canSubscribe ? (
            <>
              <p className="muted">
                You have <strong>Manage Server</strong> on{" "}
                <strong>{guildName}</strong>. Paying unlocks the dashboard for{" "}
                <em>everyone</em> on that Discord server — not just you.
              </p>
              {revolutPaywall ? (
                <p className="muted">
                  Checkout via{" "}
                  <strong className="billing-badge billing-badge-revolut">
                    Revolut
                  </strong>
                  . One payment extends server premium for the configured period.
                  After payment, access activates automatically.
                </p>
              ) : (
                <p className="billing-callout muted">
                  Revolut checkout is not configured on the server yet. Ask the
                  platform operator to connect Revolut Merchant billing, or
                  request a manual grant / complimentary access.
                </p>
              )}
            </>
          ) : (
            <p className="muted">
              You cannot purchase for this server. Ask someone with{" "}
              <strong>Administrator</strong> or <strong>Manage Server</strong>{" "}
              on <strong>{guildName}</strong> to subscribe via Revolut, or ask
              the platform operator for complimentary access.
            </p>
          )}

          {dashboardAccess?.premiumRequired === false && (
            <p className="muted">
              Note: billing enforcement is disabled in this environment.
            </p>
          )}

          {error && <p className="muted">{error}</p>}

          <div className="action-row">
            <Link to="/pricing" className="btn btn-outline-gold btn-sm">
              Full pricing (AUD)
            </Link>
            {canSubscribe && revolutPaywall && (
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={checkoutLoading}
                onClick={handleSubscribe}
              >
                {checkoutLoading ? "Redirecting to Revolut…" : "Pay with Revolut"}
              </button>
            )}
            <Link to="/select-guild" className="btn btn-outline-red btn-sm">
              Change server
            </Link>
            {isPlatformOwner && (
              <Link to="/admin/premium" className="btn btn-outline-red btn-sm">
                Operator billing tools
              </Link>
            )}
          </div>
        </div>

        <div className="card page-stack">
          <h3>Other ways to get access</h3>
          <ul className="help-list">
            <li>
              <Link to="/pricing">
                Individual and server plans (App, Bot, bundles)
              </Link>{" "}
              — see full AUD pricing before you subscribe.
            </li>
            <li>
              <strong>Server subscription (Revolut)</strong> — one payment
              covers all members (you pay if you have Manage Server).
            </li>
            <li>
              <strong>Complimentary user</strong> — the operator adds your
              Discord ID; you can use the dashboard on any server for free.
            </li>
            <li>
              <strong>Manual grant</strong> — the operator extends premium for
              this server without payment (trials, partners, etc.).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
