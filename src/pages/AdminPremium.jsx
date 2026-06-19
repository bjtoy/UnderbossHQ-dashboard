import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

const GRANT_PRESETS = [
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "1 year", days: 365 },
];

export default function AdminPremium() {
  const [status, setStatus] = useState(null);
  const [customDays, setCustomDays] = useState("30");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  function loadStatus() {
    setLoading(true);
    api.premium
      .status()
      .then((res) => setStatus(res?.data || null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function grant(days) {
    setActing(true);
    setMessage("");
    setError(null);

    try {
      const res = await api.premium.grant({ days });
      setStatus(res?.data || null);
      setMessage(`Premium extended by ${days} day(s).`);
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  }

  async function revoke() {
    if (!window.confirm("Revoke premium for this server?")) return;

    setActing(true);
    setMessage("");
    setError(null);

    try {
      const res = await api.premium.revoke();
      setStatus(res?.data || null);
      setMessage("Premium revoked.");
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(false);
    }
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Premium"
        subtitle="Platform billing — grant or revoke premium for a server (operator only)."
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      {!loading && status && (
        <div className="page-body page-stack">
          <div className="dashboard-grid dashboard-grid-3">
            <div className="card">
              <h3>Status</h3>
              <div className="value">{status.active ? "Active" : "Free"}</div>
            </div>
            <div className="card">
              <h3>Expires</h3>
              <div className="value" style={{ fontSize: "1.25rem" }}>
                {status.premiumUntil
                  ? new Date(status.premiumUntil).toLocaleDateString()
                  : "—"}
              </div>
            </div>
            <div className="card">
              <h3>Days left</h3>
              <div className="value">{status.active ? status.daysRemaining : 0}</div>
            </div>
          </div>

          <div className="card page-stack">
            <h3>Grant premium (manual)</h3>
            <p className="muted">
              Use this until Stripe billing is connected. Extensions stack on
              top of any remaining time.
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
              />
              <button
                type="button"
                className="btn btn-outline-red btn-sm"
                disabled={acting}
                onClick={() => grant(Number(customDays) || 30)}
              >
                Grant custom
              </button>
            </div>
            {status.active && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                disabled={acting}
                onClick={revoke}
              >
                Revoke premium
              </button>
            )}
          </div>

          <div className="card page-stack">
            <h3>Included today</h3>
            <ul className="muted page-stack" style={{ paddingLeft: "1.2rem" }}>
              <li>More premium features will unlock here as Section J grows</li>
            </ul>
            {status.stripeConfigured ? (
              <p className="muted">Stripe is configured on the backend.</p>
            ) : (
              <p className="muted">
                Stripe is not configured yet — billing uses manual grants only.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
