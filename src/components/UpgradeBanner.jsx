import { Link } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import { getPremiumAccessState } from "../utils/premiumAccess.js";
import SubscribeActions from "./SubscribeActions.jsx";

export default function UpgradeBanner({ compact = false }) {
  const {
    user,
    guildId,
    dashboardAccess,
    billingProvider,
    billingConfigured,
    billingCheckout,
  } = useRoles();

  const access = getPremiumAccessState({
    user,
    guildId,
    dashboardAccess,
    billingProvider,
    billingConfigured,
    billingCheckout,
  });

  if (!access.needsUpgrade) {
    return null;
  }

  const guildName =
    user?.guilds?.find((entry) => entry.id === guildId)?.name || null;

  if (compact) {
    return (
      <div className="upgrade-banner upgrade-banner-compact" role="status">
        <p className="upgrade-banner-text">
          <strong>Premium required</strong>
          {guildName ? (
            <>
              {" "}
              for <strong>{guildName}</strong>
            </>
          ) : (
            " for this server"
          )}
          .{" "}
          <Link to="/premium">Subscribe</Link>
          {" · "}
          <Link to="/pricing">Pricing</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="upgrade-banner card page-stack" role="status">
      <div className="upgrade-banner-header">
        <span className="billing-badge billing-badge-inactive">Premium required</span>
        {access.billingConfigured && access.billingProvider === "revolut" && (
          <span className="billing-badge billing-badge-revolut">Revolut checkout</span>
        )}
      </div>
      <h3 className="upgrade-banner-title">Unlock the full dashboard</h3>
      <p className="muted">
        {guildName ? (
          <>
            <strong>{guildName}</strong> needs an active server subscription before
            members can use premium tools — guides, moderation, admin panel, and
            Discord publishing.
          </>
        ) : (
          <>
            Select a server and subscribe to unlock premium tools for your whole
            Discord community.
          </>
        )}
      </p>
      {access.canSubscribe ? (
        <p className="muted">
          You have <strong>Manage Server</strong> permission and can pay for everyone
          on this server.
        </p>
      ) : (
        <p className="muted">
          Ask someone with <strong>Administrator</strong> or{" "}
          <strong>Manage Server</strong> on this Discord to subscribe, or contact
          support for complimentary access.
        </p>
      )}
      <SubscribeActions
        canSubscribe={access.canSubscribe}
        revolutCheckoutAvailable={access.revolutCheckoutAvailable}
        billingConfigured={access.billingConfigured}
        billingProvider={access.billingProvider}
        billingCheckout={access.billingCheckout}
        showPremiumLink
      />
    </div>
  );
}
