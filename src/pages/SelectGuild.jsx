import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { api } from "../api/api.js";

import {
  useRoles,
} from "../context/RoleContext.jsx";

export default function SelectGuild() {

  const navigate = useNavigate();

  const {
    setGuildId,
  } = useRoles();

  // =========================
  // STATE
  // =========================
  const [guilds, setGuilds] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const mountedRef = useRef(true);

  // =========================
  // LOAD GUILDS
  // =========================
  useEffect(() => {

    mountedRef.current = true;

    async function loadGuilds() {

      try {

        setLoading(true);

        const data =
          await api.guilds.list();

        if (!mountedRef.current) return;

        if (!data?.success) {

          throw new Error(
            "Failed to fetch guilds"
          );
        }

        setGuilds(
          Array.isArray(data.guilds)
            ? data.guilds
            : []
        );

      } catch (error) {

        console.error(
          "Failed to load guilds:",
          error
        );

        if (!mountedRef.current) return;

        setError(
          "Unable to load Discord servers."
        );

      } finally {

        if (!mountedRef.current) return;

        setLoading(false);
      }
    }

    loadGuilds();

    return () => {
      mountedRef.current = false;
    };

  }, []);

  // =========================
  // SELECT GUILD
  // =========================
  function selectGuild(guild) {

    localStorage.setItem(
      "guildId",
      guild.id
    );

    setGuildId(guild.id);

    navigate("/", {
      replace: true,
    });
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <div className="loading-screen">
        Loading servers...
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {

    return (
      <div className="app-container">

        <h1 className="header-title">
          Select Your Server
        </h1>

        <div className="card">
          <p>{error}</p>
        </div>

      </div>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (guilds.length === 0) {

    return (
      <div className="app-container">

        <h1 className="header-title">
          Select Your Server
        </h1>

        <div className="card">

          <p>
            No manageable Discord
            servers were found.
          </p>

          <p
            style={{
              marginTop: "12px",
              opacity: 0.7,
            }}
          >
            Ensure the bot has been
            invited to your server and
            that you have the required
            Discord permissions.
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="app-container">

      <h1 className="header-title">
        Select Your Server
      </h1>

      <p
        style={{
          marginBottom: "30px",
          opacity: 0.7,
        }}
      >
        Choose a Discord server to
        manage.
      </p>

      <div className="dashboard-grid">

        {guilds.map((guild) => {

          const iconUrl = guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            : null;

          return (
            <div
              key={guild.id}
              className="card"
              onClick={() => selectGuild(guild)}
              style={{
                cursor: "pointer",
                transition:
                  "transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >

                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={guild.name}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                      fontSize: "22px",
                      fontWeight: "bold",
                      background:
                        "rgba(255,255,255,0.08)",
                    }}
                  >
                    {guild.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>
                )}

                <div>

                  <h2
                    style={{
                      marginBottom: "8px",
                    }}
                  >
                    {guild.name}
                  </h2>

                  <p
                    style={{
                      opacity: 0.7,
                    }}
                  >
                    Click to manage this
                    server
                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}