import { Link } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import { canManageGuildBilling } from "../utils/guildBillingAuth.js";
import { getPremiumAccessState } from "../utils/premiumAccess.js";
import SubscribeActions from "../components/SubscribeActions.jsx";
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

  const premiumAccess = getPremiumAccessState({
    user,
    guildId,
    dashboardAccess,
    billingProvider,
    billingConfigured,
  });

  const canSubscribe = canManageGuildBilling(user, guildId);
  const guildName =
    user?.guilds?.find((g) => g.id === guildId)?.name || "this server";

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Premium required"
        subtitle={`${guildName} needs an active subscription before members can use the dashboard.`}
      />

      <div className="page-body page-stack">
        <div className="card page-stack">
          <div className="upgrade-banner-header">
            <span className="billing-badge billing-badge-inactive">No active subscription</span>
            {premiumAccess.billingConfigured &&
              premiumAccess.billingProvider === "revolut" && (
                <span className="billing-badge billing-badge-revolut">Revolut</span>
              )}
          </div>

          <h3>What you can do</h3>

          {canSubscribe ? (
            <>
              <p className="muted">
                You have <strong>Manage Server</strong> on{" "}
                <strong>{guildName}</strong>. Paying unlocks the dashboard for{" "}
                <em>everyone</em> on that Discord server — not just you.
              </p>
              {premiumAccess.revolutCheckoutAvailable ? (
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
                  platform operator to set{" "}
                  <code>REVOLUT_MERCHANT_SECRET_KEY</code>,{" "}
                  <code>REVOLUT_PREMIUM_AMOUNT</code>, and{" "}
                  <code>REVOLUT_PREMIUM_CURRENCY</code>, or request a manual
                  grant / complimentary access.
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

          {!guildId && (
            <p className="billing-callout muted">
              Select a Discord server first so checkout can be linked to the
              right community.
            </p>
          )}

          {dashboardAccess?.premiumRequired === false && (
            <p className="muted">
              Note: billing enforcement is disabled in this environment.
            </p>
          )}

          <SubscribeActions
            canSubscribe={canSubscribe && Boolean(guildId)}
            revolutCheckoutAvailable={premiumAccess.revolutCheckoutAvailable}
            billingConfigured={premiumAccess.billingConfigured}
            billingProvider={premiumAccess.billingProvider}
            showPricingLink
          />

          <div className="action-row">
            <Link to="/select-guild" className="btn btn-outline-red btn-sm">
              {guildId ? "Change server" : "Select server"}
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
