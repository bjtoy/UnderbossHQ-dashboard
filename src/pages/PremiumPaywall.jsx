import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import { canManageGuildBilling } from "../utils/guildBillingAuth.js";
import PageHeader from "../components/PageHeader.jsx";

export default function PremiumPaywall() {
  const { user, guildId, isPlatformOwner, dashboardAccess } = useRoles();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [billingProvider, setBillingProvider] = useState(null);
  const [error, setError] = useState(null);

  const canSubscribe = canManageGuildBilling(user, guildId);
  const guildName =
    user?.guilds?.find((g) => g.id === guildId)?.name || "this server";

  useEffect(() => {
    api.billing
      .config()
      .then((res) => setBillingProvider(res?.data?.provider || null))
      .catch(() => setBillingProvider(null));
  }, []);

  async function handleSubscribe() {
    setCheckoutLoading(true);
    setError(null);

    try {
      const res = await api.billing.checkout();
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

  const subscribeLabel =
    billingProvider === "revolut"
      ? "Pay with Revolut"
      : billingProvider === "stripe"
        ? "Subscribe with Stripe"
        : "Subscribe";

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
              {billingProvider ? (
                <p className="muted">
                  Checkout via{" "}
                  <strong>
                    {billingProvider === "revolut" ? "Revolut" : "Stripe"}
                  </strong>
                  . After payment, premium activates automatically.
                </p>
              ) : (
                <p className="billing-callout muted">
                  Online checkout is not set up yet. Ask the platform operator
                  to connect billing, or request a manual grant / complimentary
                  access.
                </p>
              )}
            </>
          ) : (
            <p className="muted">
              You cannot purchase for this server. Ask someone with{" "}
              <strong>Administrator</strong> or <strong>Manage Server</strong>{" "}
              on <strong>{guildName}</strong> to subscribe, or ask the platform
              operator for complimentary access.
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
            {canSubscribe && billingProvider && (
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={checkoutLoading}
                onClick={handleSubscribe}
              >
                {checkoutLoading ? "Redirecting…" : subscribeLabel}
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
              <Link to="/pricing">Individual and server plans (App, Bot, bundles)</Link>{" "}
              — see full AUD pricing before you subscribe.
            </li>
            <li>
              <strong>Server subscription</strong> — one payment covers all
              members (you pay if you have Manage Server).
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
