import { useEffect, useId, useRef, useState } from "react";
import { api } from "../api/api.js";

const SNOWFLAKE_RE = /^\d{17,20}$/;

export default function MemberSearchField({
  label = "Search member",
  placeholder = "Type a Discord name…",
  selectedMember = null,
  onSelect,
  initialDiscordId = "",
  disabled = false,
}) {
  const listId = useId();
  const rootRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    if (!initialDiscordId || selectedMember) return;

    api.bot.mod
      .memberProfile(initialDiscordId)
      .then((res) => {
        if (res?.data) {
          onSelect?.(res.data);
        }
      })
      .catch(() => {});
  }, [initialDiscordId, selectedMember, onSelect]);

  useEffect(() => {
    const term = query.trim();

    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (SNOWFLAKE_RE.test(term)) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSearchError(null);

    const timer = window.setTimeout(() => {
      api.bot.mod
        .searchMembers(term)
        .then((res) => {
          setResults(res?.data || []);
          setOpen(true);
        })
        .catch((err) => {
          setResults([]);
          setSearchError(err.message);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleQueryChange(value) {
    setQuery(value);
    setOpen(true);

    const trimmed = value.trim();
    if (SNOWFLAKE_RE.test(trimmed)) {
      onSelect?.({
        discordId: trimmed,
        username: trimmed,
      });
    } else if (!trimmed && selectedMember) {
      onSelect?.(null);
    }
  }

  function pickMember(member) {
    onSelect?.(member);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  function clearSelection() {
    onSelect?.(null);
    setQuery("");
    setResults([]);
  }

  return (
    <div className="member-search field-group" ref={rootRef}>
      <label className="field-label" htmlFor={`${listId}-input`}>
        {label}
      </label>

      {selectedMember ? (
        <div className="member-search-selected">
          <div>
            <strong>{selectedMember.username}</strong>
            <span className="muted"> · {selectedMember.discordId}</span>
          </div>
          <button
            type="button"
            className="btn btn-outline-red btn-sm"
            onClick={clearSelection}
            disabled={disabled}
          >
            Change
          </button>
        </div>
      ) : (
        <>
          <input
            id={`${listId}-input`}
            className="field-input"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={`${listId}-listbox`}
          />
          <p className="field-hint">
            Search by server nickname or username. Paste a Discord ID if you
            already have it.
          </p>
          {loading && <p className="field-hint">Searching…</p>}
          {searchError && (
            <p className="field-hint field-hint-error">{searchError}</p>
          )}
          {open && results.length > 0 && (
            <ul
              id={`${listId}-listbox`}
              className="member-search-results"
              role="listbox"
            >
              {results.map((member) => (
                <li key={member.discordId}>
                  <button
                    type="button"
                    className="member-search-option"
                    role="option"
                    onClick={() => pickMember(member)}
                  >
                    <span className="member-search-option-name">
                      {member.username}
                    </span>
                    <span className="member-search-option-id muted">
                      {member.discordId}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {open && !loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="field-hint">
              No members found. Run <strong>Sync Roles</strong> on the admin
              dashboard to import guild members.
            </p>
          )}
        </>
      )}
    </div>
  );
}
