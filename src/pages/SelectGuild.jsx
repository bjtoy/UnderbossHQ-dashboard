import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api.js";

export default function SelectGuild() {

  const navigate = useNavigate();

  const [
    guilds,
    setGuilds,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);

  useEffect(() => {

    api.guilds
      .list()
      .then((data) => {
        if (!data || !data.success) {
          throw new Error(data?.message || "Failed to fetch guilds");
        }

        const guildList =
          data.guilds || [];

        setGuilds(guildList);
        
        // Auto-select if only one guild
        if (guildList.length === 1) {
          selectGuild(guildList[0]);
        }
      })
      .catch((err) => {
        console.error("Guild list error:", err);
        setError(err.message || "Failed to load servers. Please ensure you have the 'Manage Server' permission on at least one Discord server.");
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  function selectGuild(guild) {

    localStorage.setItem(
      "guildId",
      guild.id
    );

    navigate(
      "/member",
      {
        replace: true,
      }
    );
  }

  if (loading) {
    return (
      <div className="loading-screen">
        Loading guilds...
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

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>
        Select Server
      </h1>

      <div
        style={{
          display: "grid",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {guilds.map((guild) => (
          <button
            key={guild.id}
            className="btn"
            onClick={() =>
              selectGuild(guild)
            }
          >
            {guild.name}
          </button>
        ))}
      </div>
    </div>
  );
}