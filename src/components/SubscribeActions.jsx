import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";

export default function SubscribeActions({
  canSubscribe = false,
  revolutCheckoutAvailable = false,
  billingConfigured = false,
  billingProvider = null,
  size = "sm",
  showPricingLink = true,
  showPremiumLink = false,
  className = "",
}) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const btnClass = size === "sm" ? "btn btn-sm" : "btn";

  async function handleCheckout() {
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
      setError(err.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className={`subscribe-actions${className ? ` ${className}` : ""}`}>
      <div className="action-row">
        {showPricingLink && (
          <Link to="/pricing" className={`${btnClass} btn-outline-gold`}>
            View pricing
          </Link>
        )}
        {showPremiumLink && (
          <Link to="/premium" className={`${btnClass} btn-outline-gold`}>
            Subscription options
          </Link>
        )}
        {canSubscribe && revolutCheckoutAvailable && (
          <button
            type="button"
            className={`${btnClass} btn-outline-red`}
            disabled={checkoutLoading}
            onClick={handleCheckout}
          >
            {checkoutLoading ? "Redirecting…" : "Pay with Revolut"}
          </button>
        )}
      </div>
      {canSubscribe && !revolutCheckoutAvailable && billingConfigured === false && (
        <p className="muted subscribe-actions-note">
          Online checkout is not configured yet. See pricing for plan details, or
          ask your server admin to contact{" "}
          <a href="mailto:underbosshq@outlook.com.au">support</a>.
        </p>
      )}
      {canSubscribe &&
        billingConfigured &&
        billingProvider === "stripe" &&
        !revolutCheckoutAvailable && (
          <p className="muted subscribe-actions-note">
            This server uses Stripe billing. Open{" "}
            <Link to="/premium">subscription options</Link> from the dashboard.
          </p>
        )}
      {error && <p className="muted subscribe-actions-error">{error}</p>}
    </div>
  );
}
