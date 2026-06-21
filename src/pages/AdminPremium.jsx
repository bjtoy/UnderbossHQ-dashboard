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

  const [complimentaryUsers, setComplimentaryUsers] = useState([]);

  const [customDays, setCustomDays] = useState("30");

  const [compDiscordId, setCompDiscordId] = useState("");

  const [compUsername, setCompUsername] = useState("");

  const [compNote, setCompNote] = useState("");

  const [loading, setLoading] = useState(true);

  const [acting, setActing] = useState(false);

  const [error, setError] = useState(null);

  const [message, setMessage] = useState("");



  function loadAll() {

    setLoading(true);

    setError(null);



    Promise.all([

      api.premium.status(),

      api.premium.listComplimentary(),

    ])

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

      setMessage(`Premium extended by ${days} day(s) for this server.`);

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

      setMessage("Premium revoked for this server.");

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

      setMessage("Complimentary access granted.");

      const compRes = await api.premium.listComplimentary();

      setComplimentaryUsers(compRes?.data || []);

    } catch (err) {

      setError(err.message);

    } finally {

      setActing(false);

    }

  }



  async function removeComplimentary(discordId) {

    if (!window.confirm(`Remove complimentary access for ${discordId}?`)) return;



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

    <div className="dashboard-page">

      <PageHeader

        title="Premium & Billing"

        subtitle="Grant server subscriptions or complimentary access for specific people."

      />



      {loading && <Loader />}

      {error && <ErrorCard message={error} />}

      {message && <div className="message-banner success">{message}</div>}



      {!loading && status && (

        <div className="page-body page-stack">

          <div className="dashboard-grid dashboard-grid-3">

            <div className="card">

              <h3>Server status</h3>

              <div className="value">{status.active ? "Active" : "Free"}</div>

              <p className="muted">Selected server subscription</p>

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

            <h3>Complimentary users (free dashboard)</h3>

            <p className="muted">

              These Discord users can use the dashboard on any server without

              paying. Everyone else needs an active server subscription.

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

                    placeholder="Display name"

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

                Add complimentary access

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

                    <th>Source</th>

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

                      <td>{entry.source || "database"}</td>

                      <td>

                        {entry.source !== "env" ? (

                          <button

                            type="button"

                            className="btn btn-danger btn-sm"

                            disabled={acting}

                            onClick={() => removeComplimentary(entry.discordId)}

                          >

                            Remove

                          </button>

                        ) : (

                          <span className="muted">Env var</span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>



          <div className="card page-stack">

            <h3>Grant server premium (manual)</h3>

            <p className="muted">

              Unlocks the dashboard for everyone on the currently selected

              server. Use until Stripe billing is connected.

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

                Revoke server premium

              </button>

            )}

          </div>



          <div className="card page-stack">

            <h3>Billing setup</h3>

            {status.stripeConfigured ? (

              <p className="muted">Stripe is configured on the backend.</p>

            ) : (

              <p className="muted">

                Stripe is not configured yet — use manual server grants and

                complimentary users until self-serve checkout is live.

              </p>

            )}

            <p className="muted">

              In production, set <code>DASHBOARD_REQUIRES_PREMIUM=true</code> on

              the backend (default in production). Use{" "}

              <code>COMPLIMENTARY_DISCORD_IDS</code> for bootstrap free access.

            </p>

          </div>

        </div>

      )}

    </div>

  );

}


