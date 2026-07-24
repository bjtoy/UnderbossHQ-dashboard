import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

const GRANT_PRESETS = [
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "1 year", days: 365 },
];

const OVERVIEW_ROWS = [
  {
    type: "Server subscription",
    who: "Everyone on the selected Discord server",
    how: "Revolut checkout, Stripe subscription, or manual grant (section 2–3)",
  },
  {
    type: "Complimentary user",
    who: "One specific Discord user, on any server",
    how: "Add their Discord ID in section 4",
  },
  {
    type: "Platform owner",
    who: "You (the operator)",
    how: "Always has access — no payment needed",
  },
];

function sourceLabel(source) {
  if (source === "revolut") return "Paid via Revolut";
  if (source === "stripe") return "Stripe subscription";
  if (source === "manual") return "Manual grant";
  return "None";
}

function sourceBadgeClass(source) {
  if (source === "revolut") return "billing-badge billing-badge-revolut";
  if (source === "stripe") return "billing-badge billing-badge-stripe";
  if (source === "manual") return "billing-badge billing-badge-manual";
  return "billing-badge billing-badge-inactive";
}

function SectionHeader({ number, title, id }) {
  return (
    <div className="billing-section-header" id={id}>
      <h3 className="billing-section-title">
        <span className="billing-section-number">{number}</span>
        {title}
      </h3>
    </div>
  );
}

export default function AdminPremium() {
  const { user, guildId } = useRoles();
  const [status, setStatus] = useState(null);
  const [complimentaryUsers, setComplimentaryUsers] = useState([]);
  const [customDays, setCustomDays] = useState("30");
  const [compDiscordId, setCompDiscordId] = useState("");
  const [compUsername, setCompUsername] = useState("");
  const [compNote, setCompNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const guildName =
    user?.guilds?.find((g) => g.id === guildId)?.name || "Selected server";

  function loadAll() {
    setLoading(true);
    setError(null);

    Promise.all([api.premium.status(), api.premium.listComplimentary()])
      .then(([statusRes, compRes]) => {
        setStatus(statusRes?.data || null);
        setComplimentaryUsers(compRes?.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function grant(days) {
    setActing(true);
    setMessage("");
    setError(null);

    try {
      const res = await api.premium.grant({ days });
      setStatus(res?.data || null);
      setMessage(
        `Added ${days} day(s) of premium for "${guildName}" — all members on that server can use the dashboard.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  }

  async function revoke() {
    if (
      !window.confirm(
        `Revoke premium for "${guildName}"? All members will lose dashboard access unless they have complimentary access.`
      )
    ) {
      return;
    }

    setActing(true);
    setMessage("");
    setError(null);

    try {
      const res = await api.premium.revoke();
      setStatus(res?.data || null);
      setMessage(`Premium revoked for "${guildName}".`);
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  }

  async function openBillingPortal() {
    setActing(true);
    setMessage("");
    setError(null);

    try {
      const res = await api.billing.portal();
      if (res?.url) {
        window.location.href = res.url;
        return;
      }
      throw new Error("Billing portal URL not returned");
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  }

  async function addComplimentary(event) {
    event.preventDefault();

    if (!compDiscordId.trim()) {
      setMessage("Discord user ID is required.");
      return;
    }

    setActing(true);
    setMessage("");
    setError(null);

    try {
      await api.premium.grantComplimentary({
        discordId: compDiscordId.trim(),
        username: compUsername.trim() || undefined,
        note: compNote.trim() || undefined,
      });
      setCompDiscordId("");
      setCompUsername("");
      setCompNote("");
      setMessage(
        "Complimentary access granted — that user can use the dashboard on any server without paying."
      );
      const compRes = await api.premium.listComplimentary();
      setComplimentaryUsers(compRes?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  }

  async function removeComplimentary(discordId) {
    if (
      !window.confirm(
        `Remove complimentary access for ${discordId}? They will need server premium or their own comp access again.`
      )
    ) {
      return;
    }

    setActing(true);
    setMessage("");
    setError(null);

    try {
      await api.premium.revokeComplimentary(discordId);
      setMessage("Complimentary access removed.");
      const compRes = await api.premium.listComplimentary();
      setComplimentaryUsers(compRes?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  }

  return (
    <div className="dashboard-page billing-page">
      <PageHeader
        title="Premium & Billing"
        subtitle="Platform operator tools — manage who can use the dashboard and how they pay."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      {!loading && status && (
        <div className="page-body page-stack">
          <div className="card page-stack">
            <h3>How dashboard access works</h3>
            <p className="muted billing-section-lead">
              There are three separate ways someone gets in. They do not overlap
              — pick the right tool below.
            </p>
            <div className="table-scroll">
              <table className="data-table billing-overview-table">
                <thead>
                  <tr>
                    <th>Access type</th>
                    <th>Who it affects</th>
                    <th>How you set it</th>
                  </tr>
                </thead>
                <tbody>
                  {OVERVIEW_ROWS.map((row) => (
                    <tr key={row.type}>
                      <td>{row.type}</td>
                      <td>{row.who}</td>
                      <td>{row.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <nav className="billing-toc" aria-label="Billing sections">
              <a href="#billing-server">1. Server status</a>
              <a href="#billing-checkout">2. Customer checkout</a>
              <a href="#billing-manual">3. Manual server grant</a>
              <a href="#billing-complimentary">4. Complimentary users</a>
              <a href="#billing-deploy">5. Deploy settings</a>
            </nav>
          </div>

          <section className="card page-stack billing-section" id="billing-server">
            <SectionHeader
              number="1"
              title="Selected server — subscription status"
            />
            <p className="muted billing-section-lead">
              Applies to <strong>{guildName}</strong> (the server shown in the
              top bar). When active, <em>every member</em> of that Discord server
              can use the dashboard.
            </p>

            <div className="billing-meta-grid">
              <div className="billing-meta-item">
                <p className="billing-meta-label">Status</p>
                <p className="billing-meta-value">
                  <span
                    className={
                      status.active
                        ? "billing-badge billing-badge-active"
                        : "billing-badge billing-badge-inactive"
                    }
                  >
                    {status.active ? "Active" : "Not active"}
                  </span>
                </p>
              </div>
              <div className="billing-meta-item">
                <p className="billing-meta-label">Paid via</p>
                <p className="billing-meta-value">
                  <span className={sourceBadgeClass(status.source)}>
                    {sourceLabel(status.source)}
                  </span>
                </p>
              </div>
              <div className="billing-meta-item">
                <p className="billing-meta-label">Expires</p>
                <p className="billing-meta-value">
                  {status.premiumUntil
                    ? new Date(status.premiumUntil).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div className="billing-meta-item">
                <p className="billing-meta-label">Days remaining</p>
                <p className="billing-meta-value">
                  {status.active ? status.daysRemaining : 0}
                </p>
              </div>
            </div>

            {!status.active && (
              <p className="billing-callout muted">
                This server has no active subscription. Members see the paywall
                unless they are on the complimentary list (section 4) or you
                grant time manually (section 3).
              </p>
            )}
          </section>

          <section className="card page-stack billing-section" id="billing-checkout">
            <SectionHeader number="2" title="Customer checkout (self-serve)" />
            <p className="muted billing-section-lead">
              Server owners/admins pay from the dashboard paywall. You do not
              charge them from this page — you only configure the payment
              provider on the backend.
            </p>

            {status.billingConfigured ? (
              <>
                <p className="muted">
                  <strong>Checkout:</strong>{" "}
                  {status.billingProvider === "revolut"
                    ? "Revolut — one payment extends premium for the configured period (default 30 days)."
                    : "Stripe — recurring subscription; renews automatically until cancelled."}
                </p>
                <p className="muted">
                  <strong>Who can pay:</strong> Discord users with Administrator
                  or Manage Server on that guild.
                </p>
              </>
            ) : (
              <p className="billing-callout muted">
                Checkout is off. Server admins cannot pay yet — use manual grants
                (section 3) or set up Revolut/Stripe in section 5.
              </p>
            )}

            {status?.source === "stripe" && status?.subscriptionId && (
              <div className="page-stack">
                <p className="muted">
                  This server has an active Stripe subscription. Open the Stripe
                  customer portal to update card, cancel, or view invoices.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-gold btn-sm"
                  disabled={acting}
                  onClick={openBillingPortal}
                >
                  Open Stripe billing portal
                </button>
              </div>
            )}

            {status?.source === "revolut" && status?.active && (
              <p className="muted">
                Last payment was via Revolut. When premium expires, the server
                owner pays again from the paywall — there is no auto-renewal
                portal for Revolut.
              </p>
            )}
          </section>

          <section className="card page-stack billing-section" id="billing-manual">
            <SectionHeader number="3" title="Manual server grant" />
            <p className="muted billing-section-lead">
              <strong>Operator override</strong> — add premium time for{" "}
              <strong>{guildName}</strong> only. Stacks on top of any existing
              expiry. Does not charge anyone; use for trials, comps, or before
              checkout is live.
            </p>

            <div className="action-row">
              {GRANT_PRESETS.map((preset) => (
                <button
                  key={preset.days}
                  type="button"
                  className="btn btn-outline-red btn-sm"
                  disabled={acting}
                  onClick={() => grant(preset.days)}
                >
                  +{preset.label}
                </button>
              ))}
            </div>

            <div className="dashboard-grid dashboard-grid-3">
              <input
                className="field-input"
                type="number"
                min="1"
                max="3650"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                placeholder="Custom days"
                aria-label="Custom days to grant"
              />
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={acting}
                onClick={() => grant(Number(customDays) || 30)}
              >
                Grant custom days
              </button>
            </div>

            {status.active && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                disabled={acting}
                onClick={revoke}
              >
                Revoke server premium
              </button>
            )}
          </section>

          <section
            className="card page-stack billing-section"
            id="billing-complimentary"
          >
            <SectionHeader number="4" title="Complimentary users" />
            <p className="muted billing-section-lead">
              <strong>Per person, not per server.</strong> Listed users bypass
              the paywall on <em>any</em> Discord server. Everyone else still
              needs an active server subscription (sections 1–3) or checkout
              (section 2).
            </p>

            <form className="page-stack" onSubmit={addComplimentary}>
              <div className="dashboard-grid dashboard-grid-3">
                <div className="field-group">
                  <label className="field-label" htmlFor="comp-discord-id">
                    Discord user ID
                  </label>
                  <input
                    id="comp-discord-id"
                    className="field-input"
                    value={compDiscordId}
                    onChange={(e) => setCompDiscordId(e.target.value)}
                    placeholder="e.g. 123456789012345678"
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="comp-username">
                    Label (optional)
                  </label>
                  <input
                    id="comp-username"
                    className="field-input"
                    value={compUsername}
                    onChange={(e) => setCompUsername(e.target.value)}
                    placeholder="Display name in this list"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="comp-note">
                    Note (optional)
                  </label>
                  <input
                    id="comp-note"
                    className="field-input"
                    value={compNote}
                    onChange={(e) => setCompNote(e.target.value)}
                    placeholder="e.g. Beta tester"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-outline-red btn-sm"
                disabled={acting}
              >
                Add complimentary user
              </button>
            </form>

            {complimentaryUsers.length === 0 ? (
              <p className="muted empty-state">No complimentary users yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Note</th>
                    <th>Listed in</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {complimentaryUsers.map((entry) => (
                    <tr key={entry.discordId}>
                      <td>
                        {entry.username || entry.discordId}
                        {entry.username ? (
                          <span className="muted"> · {entry.discordId}</span>
                        ) : null}
                      </td>
                      <td>{entry.note || "—"}</td>
                      <td>
                        {entry.source === "env"
                          ? "Server env var"
                          : "This dashboard"}
                      </td>
                      <td>
                        {entry.source !== "env" ? (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            disabled={acting}
                            onClick={() =>
                              removeComplimentary(entry.discordId)
                            }
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="muted" title="Set in COMPLIMENTARY_DISCORD_IDS on the backend">
                            Env only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="card page-stack billing-section" id="billing-deploy">
            <SectionHeader number="5" title="Deploy settings (backend env)" />
            <p className="muted billing-section-lead">
              These are not changed in the dashboard — set them on your Render
              backend and redeploy.
            </p>

            <div className="table-scroll">
              <table className="data-table billing-env-table">
                <thead>
                  <tr>
                    <th>Variable</th>
                    <th>What it does</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>DASHBOARD_REQUIRES_PREMIUM</code>
                    </td>
                    <td>
                      When <code>true</code> (default in production), members
                      need server premium or complimentary access. Set{" "}
                      <code>false</code> to disable the paywall entirely.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>COMPLIMENTARY_DISCORD_IDS</code>
                    </td>
                    <td>
                      Comma-separated Discord user IDs with free access (same
                      as section 4, but via env). Shows as &quot;Env only&quot;
                      in the table above.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>REVOLUT_*</code>
                    </td>
                    <td>
                      Enables Revolut checkout (section 2). Webhook:{" "}
                      <code>/api/revolut/webhook</code>, event{" "}
                      <code>ORDER_COMPLETED</code>.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>STRIPE_*</code>
                    </td>
                    <td>
                      Legacy Stripe subscriptions. Webhook:{" "}
                      <code>/api/stripe/webhook</code>.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>BILLING_PROVIDER</code>
                    </td>
                    <td>
                      Optional: <code>revolut</code> or <code>stripe</code>. If
                      unset, Revolut is used when configured, else Stripe.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="muted">
              Need to test as a customer?{" "}
              <Link to="/member">Open the member dashboard</Link> on a
              non-premium server to see the paywall.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
