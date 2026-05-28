import { useEffect, useState } from "react";
import { api } from "../api/api.js";

function SelectGuild() {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const data = await api.guilds.list();

        if (!data?.success) {
          setError("Failed to load guilds.");
          setLoading(false);
          return;
        }

        setGuilds(Array.isArray(data.guilds) ? data.guilds : []);
      } catch (err) {
        console.error("Guild fetch error:", err);
        setError("Unable to fetch guilds.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuilds();
  }, []);

  const selectGuild = (guildId) => {
    if (!guildId) return;

    console.log("Saving guildId:", guildId);

    localStorage.setItem("guildId", guildId);

    // HARD REFRESH SO CONTEXT RELOADS
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="loading-screen">
        Loading your servers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        {error}
      </div>
    );
  }

  if (!guilds || guilds.length === 0) {
    return (
      <div className="loading-screen">
        <div>
          <h1>No Manageable Servers Found</h1>

          <p style={{ marginTop: "14px" }}>
            You must have Manage Server permissions
            and the bot must exist in the server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="app-container"
      style={{
        marginLeft: "0",
        maxWidth: "100%",
      }}
    >
      <h1
        className="header-title"
        style={{
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Select Your Server
      </h1>

      <div className="dashboard-grid">
        {guilds.map((guild, index) => {
          const safeId = guild?.id || `guild-${index}`;
          const safeName = guild?.name || "Unknown Server";
          const safeIcon = guild?.icon;

          return (
            <div
              key={safeId}
              className="card"
              onClick={() => selectGuild(guild.id)}
              style={{
                cursor: "pointer",
                transition: "0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
              >
                {safeIcon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${safeIcon}.png?size=128`}
                    alt={safeName}
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      border: "2px solid var(--red-deep)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: "#1a0507",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "26px",
                      border: "2px solid var(--red-deep)",
                    }}
                  >
                    {safeName.charAt(0)}
                  </div>
                )}

                <div>
                  <h2>{safeName}</h2>

                  <p
                    style={{
                      color: "var(--text-muted)",
                      marginTop: "6px",
                    }}
                  >
                    Click to manage server
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

export default SelectGuild;
