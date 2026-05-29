import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function AuthCallback() {
  const navigate = useNavigate();

  const {
    refreshUser,
    guildId,
  } = useRoles();

  useEffect(() => {
    let mounted = true;

    async function finishLogin() {
      try {
        // Load authenticated user
        await refreshUser();

        if (!mounted) return;

        // Check stored guild
        const storedGuild =
          localStorage.getItem("guildId");

        // If no guild selected yet
        if (!storedGuild) {
          navigate("/select-guild", {
            replace: true,
          });

          return;
        }

        // Otherwise continue to dashboard
        navigate("/", {
          replace: true,
        });

      } catch (error) {
        console.error(
          "OAuth callback failed:",
          error
        );

        if (!mounted) return;

        navigate("/login", {
          replace: true,
        });
      }
    }

    finishLogin();

    return () => {
      mounted = false;
    };
  }, [navigate, refreshUser, guildId]);

  return (
    <div className="loading-screen">
      Signing you in...
    </div>
  );
}