import PublicShell from "../components/PublicShell.jsx";
import { BUSINESS } from "../content/business.js";

export default function ContactPage() {
  return (
    <PublicShell
      title="Contact"
      subtitle="Reach the UnderbossHQ operator. No account or password required to view this page."
    >
      <section className="card page-stack public-business-card">
        <h2 className="public-section-title">Business details</h2>
        <table className="billing-overview-table">
          <tbody>
            <tr>
              <th>Business / product name</th>
              <td>{BUSINESS.name}</td>
            </tr>
            <tr>
              <th>Service</th>
              <td>{BUSINESS.productDescription}</td>
            </tr>
            <tr>
              <th>Website</th>
              <td>
                <a href={BUSINESS.website}>{BUSINESS.website}</a>
              </td>
            </tr>
            <tr>
              <th>Contact email</th>
              <td>
                <a href={`mailto:${BUSINESS.contactEmail}`}>
                  {BUSINESS.contactEmail}
                </a>
              </td>
            </tr>
            <tr>
              <th>Country</th>
              <td>{BUSINESS.country}</td>
            </tr>
            <tr>
              <th>Pricing currency</th>
              <td>{BUSINESS.currency}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card page-stack">
        <h2 className="public-section-title">Public pages (no login)</h2>
        <p className="muted">
          The following pages are available without a password or Discord
          account — suitable for business verification and customer review:
        </p>
        <ul className="help-list">
          <li>
            <a href="/">Home</a> — product overview
          </li>
          <li>
            <a href="/pricing">Pricing</a> — plans in AUD
          </li>
          <li>
            <a href="/terms">Terms of Service</a>
          </li>
          <li>
            <a href="/privacy">Privacy Policy</a>
          </li>
          <li>
            <a href="/help/public">Help (public)</a>
          </li>
          <li>
            <a href="/demo">Demo guide</a>
          </li>
        </ul>
        <p className="muted">
          Optional sign-in uses Discord OAuth for server administrators who
          manage their communities. Premium subscriptions are described on the
          pricing page.
        </p>
      </section>
    </PublicShell>
  );
}
