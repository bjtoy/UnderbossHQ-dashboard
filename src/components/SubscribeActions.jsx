import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import { describeCheckoutAmount } from "../utils/customerCurrency.js";

export default function SubscribeActions({
  canSubscribe = false,
  revolutCheckoutAvailable = false,
  billingConfigured = false,
  billingProvider = null,
  billingCheckout = null,
  planId = null,
  size = "sm",
  showPricingLink = true,
  showPremiumLink = false,
  className = "",
}) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const btnClass = size === "sm" ? "btn btn-sm" : "btn";
  const checkoutLabel = describeCheckoutAmount(billingCheckout, { planId });

  async function handleCheckout() {
    setCheckoutLoading(true);
    setError(null);

    try {
      const res = await api.billing.checkout(planId);
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
            {checkoutLoading
              ? "Redirecting…"
              : checkoutLabel
                ? `Pay ${checkoutLabel} with Revolut`
                : "Pay with Revolut"}
          </button>
        )}
      </div>
      {canSubscribe && revolutCheckoutAvailable && checkoutLabel && (
        <p className="muted subscribe-actions-note">
          Amount shown in your local currency where possible. Revolut checkout
          settles in the merchant currency shown in parentheses when different.
        </p>
      )}
      {canSubscribe && !revolutCheckoutAvailable && billingConfigured === false && (
        <p className="muted subscribe-actions-note">
          Online checkout is not configured yet. See pricing for plan details, or
          ask your server admin to contact{" "}
          <a href="mailto:underbosshq@outlook.com.au">support</a>.
        </p>
      )}
      {error && <p className="muted subscribe-actions-error">{error}</p>}
    </div>
  );
}
