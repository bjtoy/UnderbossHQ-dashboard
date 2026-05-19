import { useRoles } from "../context/RoleContext.jsx";

export default function MemberHome() {
  const { user, roles } = useRoles();

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        Welcome, {user?.username || "Member"}
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        You are logged in and ready to use the dashboard.
      </p>

      <div
        style={{
          display: "inline-block",
          padding: "16px 24px",
          background: "#1e1e1e",
          color: "white",
          borderRadius: "10px",
          fontSize: "16px",
        }}
      >
        <strong>Your Roles:</strong>
        <br />
        {roles.length > 0 ? roles.join(", ") : "No roles assigned"}
      </div>
    </div>
  );
}
