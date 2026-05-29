import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api/api.js";
import { useRoles } from "../context/RoleContext.jsx";

export default function SelectGuild() {
  const navigate = useNavigate();

  const { setGuildId } = useRoles();

  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGuilds() {
      try {
        const data = await api.guilds.list();

        if (data?.success) {
          setGuilds(data.guilds || []);
        }
      } catch (error) {
        console.error(
          "Failed to load guilds:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadGuilds();
  }, []);

  function selectGuild(guild) {
    localStorage.setItem(
      "guildId",
      guild.id
    );

    // IMPORTANT
    setGuildId(guild.id);

    navigate("/", {
      replace: true,
    });
  }

  if (loading) {
    return (
      <div className="loading-screen">
        Loading servers...
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="header-title">
        Select Your Server
      </h1>

      <div className="dashboard-grid">
        {guilds.map((guild) => (
          <div
            key={guild.id}
            className="card"
            onClick={() => selectGuild(guild)}
            style={{
              cursor: "pointer",
            }}
          >
            <h2>{guild.name}</h2>

            <p>
              Click to manage this server
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}