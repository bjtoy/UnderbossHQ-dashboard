import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";

export default function AuthCallback() {
  const navigate = useNavigate();

  const {
    user,
    loading,
  } = useRoles();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", {
        replace: true,
      });
      return;
    }

    const guildId =
      localStorage.getItem("guildId");

    console.log("AuthCallback: user is loaded, guildId is", guildId);

    if (!guildId) {
      navigate("/select-guild", {
        replace: true,
      });
    } else {
      navigate("/member", {
        replace: true,
      });
    }

  }, [
    user,
    loading,
    navigate,
  ]);

  return (
    <div className="loading-screen">
      Authenticating...
    </div>
  );
}