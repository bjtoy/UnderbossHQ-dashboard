export default function ErrorCard({ message = "Something went wrong." }) {
  return (
    <div
      className="card"
      style={{
        border: "1px solid var(--red-neon)",
        boxShadow: "0 0 14px rgba(255, 46, 46, 0.35)",
        padding: "20px 22px",
        marginBottom: "22px",
        borderRadius: "12px",
      }}
    >
      <h3
        style={{
          color: "var(--red-neon)",
          marginBottom: "10px",
          fontSize: "20px",
          textShadow: "0 0 8px rgba(255, 46, 46, 0.6)",
        }}
      >
        Error
      </h3>

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "15px",
          lineHeight: "1.5",
        }}
      >
        {message}
      </p>
    </div>
  );
}
