import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api.js";
import { useRoles } from "../../context/RoleContext.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorCard from "../../components/ErrorCard.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import { eventStatus, formatEventRange } from "../../utils/eventDates.js";

export default function EventsList() {
  const { hasAnyRole } = useRoles();
  const canManage = hasAnyRole(["Admin", "Mod", "Moderator"]);

  const [events, setEvents] = useState([]);
  const [showPast, setShowPast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.events
      .list(!showPast)
      .then((data) => setEvents(data?.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [showPast]);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Events"
        subtitle="Scheduled faction events and activities."
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline-red btn-sm"
              onClick={() => setShowPast((value) => !value)}
            >
              {showPast ? "Upcoming only" : "Show past"}
            </button>
            {canManage ? (
              <Link to="/events/new" className="btn btn-outline-red btn-sm">
                Schedule Event
              </Link>
            ) : null}
          </>
        }
      />

      {loading && <Loader />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className="page-body">
          {events.length === 0 ? (
            <div className="card empty-state">No events scheduled.</div>
          ) : (
            <div className="page-stack">
              {events.map((item) => {
                const status = eventStatus(item.startsAt, item.endsAt);

                return (
                  <div key={item.id} className="card">
                    <div className="action-row" style={{ justifyContent: "space-between" }}>
                      <h3>{item.title}</h3>
                      <span className={`log-level log-${status}`}>{status}</span>
                    </div>
                    <p className="muted">
                      {formatEventRange(item.startsAt, item.endsAt)}
                    </p>
                    {item.location ? (
                      <p className="muted">Location: {item.location}</p>
                    ) : null}
                    <p className="guide-preview">
                      {item.description.length > 220
                        ? `${item.description.slice(0, 220)}…`
                        : item.description}
                    </p>
                    {canManage && (
                      <div className="action-row">
                        <Link
                          to={`/events/${item.id}/edit`}
                          className="btn btn-outline-red btn-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
