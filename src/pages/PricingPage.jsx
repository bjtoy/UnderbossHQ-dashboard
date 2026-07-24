import { Link } from "react-router-dom";
import PublicShell from "../components/PublicShell.jsx";
import {
  ACCESS_LEVELS,
  PREMIUM_PLANS,
  FEATURE_MATRIX,
  FOUNDING_OFFER,
  formatMonthly,
  formatAnnual,
  formatAud,
} from "../content/pricing.js";

function PlanCard({ plan }) {
  const isServerCheckout = plan.checkoutAvailable;

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
      <p className="pricing-plan-price">{formatMonthly(plan)}</p>
      <p className="pricing-plan-annual muted">{formatAnnual(plan)}</p>
      {plan.saveVsSeparate ? (
        <p className="pricing-plan-save">
          Save {formatAud(plan.saveVsSeparate)}/mo vs separate
        </p>
      ) : null}
      <p className="muted">{plan.bestFor}</p>
      <ul className="help-list">
        {plan.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {isServerCheckout ? (
        <Link to="/login" className="btn btn-outline-gold btn-sm">
          Sign in to subscribe
        </Link>
      ) : (
        <p className="muted pricing-plan-soon">
          Individual plans: email contact@underbosshq.com or sign in for server
          subscription.
        </p>
      )}
    </article>
  );
}

export default function PricingPage() {
  return (
    <PublicShell
      title="Pricing"
      subtitle="All prices in AUD. Public pages are free. Premium unlocks app and/or bot features for individuals or whole servers."
    >
      <section className="page-stack">
        <h2 className="public-section-title">Free access</h2>
        <div className="public-grid dashboard-grid dashboard-grid-2">
          {ACCESS_LEVELS.map((level) => (
            <div key={level.id} className="card page-stack">
              <h3>{level.title}</h3>
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

      <section className="page-stack">
        <h2 className="public-section-title">Premium plans</h2>
        <p className="muted">
          <strong>App</strong> = web dashboard · <strong>Bot</strong> = Discord
          slash commands (requires bot in server).{" "}
          <strong>Server</strong> plans unlock for everyone on that community.
        </p>
        <div className="pricing-plan-grid">
          {PREMIUM_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      <section className="card page-stack">
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

      <section className="card page-stack billing-callout">
        <h3>{FOUNDING_OFFER.label}</h3>
        <p className="muted">
          Individual bundle {formatAud(FOUNDING_OFFER.individualBundleMonthly)}
          /mo · Server bundle{" "}
          {formatAud(FOUNDING_OFFER.serverBundleMonthly)}/mo —{" "}
          {FOUNDING_OFFER.note}
        </p>
        <Link to="/login" className="btn btn-outline-red btn-sm">
          Sign in to get started
        </Link>
      </section>
    </PublicShell>
  );
}
