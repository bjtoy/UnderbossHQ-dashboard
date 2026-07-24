import { Link } from "react-router-dom";
import PublicShell from "../components/PublicShell.jsx";
import { BUSINESS } from "../content/business.js";

export default function PublicHome() {
  return (
    <PublicShell
      title="Discord server management, done properly"
      subtitle="Guides, moderation, and bot tools in one control panel. Browse pricing and help without an account — sign in when you are ready."
    >
      <section className="public-hero card page-stack">
        <p>
          UnderbossHQ gives faction and community servers a real dashboard:
          styled guides, announcements, case files, and a Discord bot that
          shares the same data.
        </p>
        <div className="public-hero-actions action-row">
          <Link to="/pricing" className="btn btn-outline-gold">
            View pricing (AUD)
          </Link>
          <Link to="/demo" className="btn btn-outline-red btn-sm">
            See demo guide
          </Link>
          <Link to="/login" className="btn btn-outline-red btn-sm">
            Sign in with Discord
          </Link>
        </div>
      </section>

      <section className="public-business-card card page-stack">
        <h2 className="public-section-title">About {BUSINESS.name}</h2>
        <p className="muted">{BUSINESS.productDescription}</p>
        <p className="muted">
          <strong>No password required</strong> to browse this site, our{" "}
          <Link to="/pricing">pricing</Link>, <Link to="/terms">terms</Link>,{" "}
          <Link to="/privacy">privacy policy</Link>, or{" "}
          <Link to="/contact">contact</Link> page. Sign-in is optional and only
          needed for server administrators using the dashboard.
        </p>
        <p className="muted">
          Contact:{" "}
          <a href={`mailto:${BUSINESS.contactEmail}`}>{BUSINESS.contactEmail}</a>
          {" · "}
          <a href={`tel:${BUSINESS.contactPhone}`}>
            {BUSINESS.contactPhoneDisplay}
          </a>
        </p>
      </section>

      <section className="public-grid dashboard-grid dashboard-grid-3">
        <div className="card page-stack">
          <h2 className="public-card-title">No login needed</h2>
          <p className="muted">
            Open <Link to="/pricing">pricing</Link>,{" "}
            <Link to="/help/public">public help</Link>, and our{" "}
            <Link to="/demo">sample guide</Link> before you create an account.
          </p>
        </div>
        <div className="card page-stack">
          <h2 className="public-card-title">Free with Discord</h2>
          <p className="muted">
            Sign in to access member home, full Help, and basic bot commands.
            Discord is the primary sign-in method for dashboard access.
          </p>
        </div>
        <div className="card page-stack">
          <h2 className="public-card-title">Premium when you need it</h2>
          <p className="muted">
            Choose <strong>App</strong> and/or <strong>Bot</strong> premium for
            individuals or whole servers — from <strong>$9 AUD/mo</strong>.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
