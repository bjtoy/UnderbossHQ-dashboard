import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [editNames, setEditNames] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", discordId: "" });

  function loadUsers(query = search) {
    setLoading(true);
    setError(null);

    api.users
      .list(query)
      .then((data) => setUsers(data?.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const term = search.trim();
    const timer = window.setTimeout(() => {
      loadUsers(term);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  function startEdit(user) {
    setEditNames((prev) => ({ ...prev, [user.id]: user.username }));
  }

  async function saveEdit(userId) {
    const username = editNames[userId]?.trim();
    if (!username) {
      setMessage("Username cannot be empty.");
      return;
    }

    setSavingId(userId);
    setMessage("");
    setError(null);

    try {
      const result = await api.users.update(userId, { username });
      const updated = result?.data;
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, ...updated } : user))
      );
      setEditNames((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      setMessage("User updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(user) {
    if (
      !window.confirm(
        `Delete profile for ${user.username}? This removes the dashboard record only.`
      )
    ) {
      return;
    }

    setSavingId(user.id);
    setMessage("");
    setError(null);

    try {
      await api.users.remove(user.id);
      setUsers((prev) => prev.filter((entry) => entry.id !== user.id));
      setMessage("User deleted.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();

    if (!newUser.username.trim()) {
      setMessage("Username is required.");
      return;
    }

    setSavingId("new");
    setMessage("");
    setError(null);

    try {
      const result = await api.users.create({
        username: newUser.username.trim(),
        discordId: newUser.discordId.trim() || undefined,
      });
      const created = result?.data;
      if (created) {
        setUsers((prev) => [created, ...prev]);
      }
      setNewUser({ username: "", discordId: "" });
      setShowCreate(false);
      setMessage("User profile created.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title="User Management"
        subtitle="Discord member profiles synced to the dashboard."
        actions={
          <button
            type="button"
            className="btn btn-outline-red btn-sm"
            onClick={() => setShowCreate((open) => !open)}
          >
            {showCreate ? "Cancel" : "Add Profile"}
          </button>
        }
      />

      {error && <ErrorCard message={error} />}
      {message && <div className="message-banner success">{message}</div>}

      <div className="page-body page-stack">
        {showCreate && (
          <form className="card page-stack" onSubmit={handleCreate}>
            <h3>Add profile</h3>
            <p className="muted">
              Usually created automatically when members join or roles sync. Add
              manually only if needed.
            </p>
            <div className="field-group">
              <label className="field-label" htmlFor="new-username">
                Username
              </label>
              <input
                id="new-username"
                className="field-input"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, username: e.target.value }))
                }
                placeholder="Display name"
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="new-discord-id">
                Discord ID (optional)
              </label>
              <input
                id="new-discord-id"
                className="field-input"
                value={newUser.discordId}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, discordId: e.target.value }))
                }
                placeholder="Leave blank to auto-generate"
              />
            </div>
            <button
              type="submit"
              className="btn btn-outline-red btn-sm"
              disabled={savingId === "new"}
            >
              {savingId === "new" ? "Creating..." : "Create"}
            </button>
          </form>
        )}

        <div className="card action-row">
          <input
            className="field-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Discord name"
            aria-label="Search by Discord name"
          />
          <button
            type="button"
            className="btn btn-outline-red btn-sm"
            onClick={() => setSearch("")}
          >
            Clear
          </button>
        </div>

        {loading && <Loader />}

        {!loading && users.length === 0 && (
          <div className="card empty-state">
            No user profiles found. Run <strong>Sync Roles</strong> on the admin
            dashboard to import guild members.
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Discord name</th>
                  <th>Discord ID</th>
                  <th>Warnings</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isEditing = editNames[user.id] !== undefined;

                  return (
                    <tr key={user.id}>
                      <td>
                        {isEditing ? (
                          <input
                            className="field-input"
                            value={editNames[user.id]}
                            onChange={(e) =>
                              setEditNames((prev) => ({
                                ...prev,
                                [user.id]: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          user.username
                        )}
                      </td>
                      <td>
                        <code>{user.discordId}</code>
                      </td>
                      <td>{user.guildWarnings ?? user.warnings ?? 0}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-row">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-outline-red btn-sm"
                                disabled={savingId === user.id}
                                onClick={() => saveEdit(user.id)}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-red btn-sm"
                                onClick={() =>
                                  setEditNames((prev) => {
                                    const next = { ...prev };
                                    delete next[user.id];
                                    return next;
                                  })
                                }
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="btn btn-outline-red btn-sm"
                                onClick={() => startEdit(user)}
                              >
                                Edit
                              </button>
                              <Link
                                to={`/moderator/user-lookup?userId=${user.discordId}`}
                                className="btn btn-outline-red btn-sm"
                              >
                                Moderate
                              </Link>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                disabled={savingId === user.id}
                                onClick={() => handleDelete(user)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
