import { Link } from "react-router-dom";
import PublicShell from "../components/PublicShell.jsx";
import SubscribeActions from "../components/SubscribeActions.jsx";
import { useRoles } from "../context/RoleContext.jsx";
import { useCustomerPricing } from "../hooks/useCustomerPricing.js";
import { BUSINESS } from "../content/business.js";
import { getPremiumAccessState } from "../utils/premiumAccess.js";
import {
  ACCESS_LEVELS,
  PREMIUM_PLANS,
  FEATURE_MATRIX,
  FOUNDING_OFFER,
} from "../content/pricing.js";

function PlanCard({ plan, premiumAccess, guildId, pricing }) {
  const isServerCheckout = plan.checkoutAvailable;
  const { user, loading } = useRoles();
  const loggedIn = !loading && Boolean(user);
  const showCheckout =
    loggedIn &&
    isServerCheckout &&
    guildId &&
    premiumAccess.needsUpgrade &&
    premiumAccess.canSubscribe;

  return (
    <article
      className={`pricing-plan card page-stack${plan.highlight ? " pricing-plan-highlight" : ""}`}
    >
      {plan.highlight ? (
        <span className="billing-badge billing-badge-active">Best value</span>
      ) : null}
      <p className="pricing-plan-meta muted">
        {plan.audience} · {plan.product}
      </p>
      <h2 className="pricing-plan-name">{plan.name}</h2>
      <p className="pricing-plan-price">{pricing.formatMonthly(plan)}</p>
      <p className="pricing-plan-annual muted">{pricing.formatAnnual(plan)}</p>
      {plan.saveVsSeparate ? (
        <p className="pricing-plan-save">
          Save {pricing.formatPrice(plan.saveVsSeparate)}/mo vs separate
        </p>
      ) : null}
      <p className="muted">{plan.bestFor}</p>
      <ul className="help-list">
        {plan.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {isServerCheckout ? (
        showCheckout ? (
          <SubscribeActions
            canSubscribe={premiumAccess.canSubscribe}
            revolutCheckoutAvailable={premiumAccess.revolutCheckoutAvailable}
            billingConfigured={premiumAccess.billingConfigured}
            billingProvider={premiumAccess.billingProvider}
            billingCheckout={premiumAccess.billingCheckout}
            planId={plan.id}
            showPricingLink={false}
            showPremiumLink
          />
        ) : loggedIn ? (
          <div className="page-stack">
            {!guildId ? (
              <Link to="/select-guild" className="btn btn-outline-gold btn-sm">
                Select a server to subscribe
              </Link>
            ) : premiumAccess.premiumActive ? (
              <p className="muted pricing-plan-soon">
                Your selected server already has premium access.
              </p>
            ) : !premiumAccess.canSubscribe ? (
              <p className="muted pricing-plan-soon">
                Server checkout requires <strong>Manage Server</strong> on your
                Discord. Ask an admin to subscribe, or open{" "}
                <Link to="/premium">subscription options</Link>.
              </p>
            ) : (
              <Link to="/premium" className="btn btn-outline-gold btn-sm">
                Subscribe for your server
              </Link>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn btn-outline-gold btn-sm">
            Sign in to subscribe
          </Link>
        )
      ) : (
        <p className="muted pricing-plan-soon">
          Individual plans: email {BUSINESS.contactEmail} or sign in for server
          subscription.
        </p>
      )}
    </article>
  );
}

export default function PricingPage() {
  const {
    user,
    guildId,
    dashboardAccess,
    billingProvider,
    billingConfigured,
    billingCheckout,
    loading,
  } = useRoles();
  const premiumAccess = getPremiumAccessState({
    user,
    guildId,
    dashboardAccess,
    billingProvider,
    billingConfigured,
    billingCheckout,
  });
  const pricing = useCustomerPricing(billingCheckout);
  const loggedIn = !loading && Boolean(user);

  return (
    <PublicShell
      title="Pricing"
      subtitle={pricing.pricingSubtitle}
    >
      {loggedIn && premiumAccess.needsUpgrade && (
        <section className="public-section">
          <div className="card page-stack billing-callout">
            <h2 className="public-section-title">Subscribe from your account</h2>
            <p className="muted">
              You are signed in
              {guildId ? " with a server selected" : ""}. Server plans unlock the
              dashboard for everyone on that Discord community.
            </p>
            <SubscribeActions
              canSubscribe={premiumAccess.canSubscribe}
              revolutCheckoutAvailable={premiumAccess.revolutCheckoutAvailable}
              billingConfigured={premiumAccess.billingConfigured}
              billingProvider={premiumAccess.billingProvider}
              billingCheckout={premiumAccess.billingCheckout}
              showPremiumLink
            />
          </div>
        </section>
      )}

      <section className="public-section page-stack">
        <h2 className="public-section-title">Free access</h2>
        <div className="public-grid dashboard-grid dashboard-grid-2">
          {ACCESS_LEVELS.map((level) => (
            <div key={level.id} className="card page-stack">
              <h3 className="public-card-title">{level.title}</h3>
              <p className="pricing-plan-price">{level.price}</p>
              <p className="muted">{level.description}</p>
              <ul className="help-list">
                {level.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="public-section page-stack">
        <h2 className="public-section-title">Premium plans</h2>
        <p className="muted">
          <strong>App</strong> = web dashboard · <strong>Bot</strong> = Discord
          slash commands (requires bot in server).{" "}
          <strong>Server</strong> plans unlock for everyone on that community.
        </p>
        <div className="pricing-plan-grid">
          {PREMIUM_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              premiumAccess={premiumAccess}
              guildId={guildId}
              pricing={pricing}
            />
          ))}
        </div>
      </section>

      <section className="card page-stack public-section">
        <h2 className="public-section-title">Feature comparison</h2>
        <div className="table-scroll">
          <table className="data-table billing-overview-table">
            <thead>
              <tr>
                {FEATURE_MATRIX.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_MATRIX.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={`${row[0]}-${i}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card page-stack billing-callout public-section">
        <h2 className="public-section-title">{FOUNDING_OFFER.label}</h2>
        <p className="muted">
          Individual bundle {pricing.formatPrice(FOUNDING_OFFER.individualBundleMonthly)}
          /mo · Server bundle{" "}
          {pricing.formatPrice(FOUNDING_OFFER.serverBundleMonthly)}/mo —{" "}
          {FOUNDING_OFFER.note}
        </p>
        {loggedIn ? (
          <Link to="/premium" className="btn btn-outline-red btn-sm">
            Open subscription options
          </Link>
        ) : (
          <Link to="/login" className="btn btn-outline-red btn-sm">
            Sign in to get started
          </Link>
        )}
      </section>
    </PublicShell>
  );
}
