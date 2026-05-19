export default function ErrorCard({ message = "Something went wrong." }) {
  return (
    <div
      className="card"
      style={{
        borderColor: "var(--red-neon)",
        boxShadow: "0 0 12px rgba(255, 46, 46, 0.3)",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ color: "var(--red-neon)", marginBottom: "10px" }}>
        Error
      </h3>

      <p style={{ color: "var(--text-muted)" }}>{message}</p>
    </div>
  );
}
