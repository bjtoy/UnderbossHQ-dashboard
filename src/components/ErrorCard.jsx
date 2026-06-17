export default function ErrorCard({ message = "Something went wrong." }) {
  return (
    <div
      className="card"
      style={{
        border: "1px solid var(--border-strong)",
        boxShadow: "var(--glow-red)",
        padding: "20px 22px",
        marginBottom: "22px",
        borderRadius: "12px",
      }}
    >
      <h3
        style={{
          color: "var(--brand-red-glow)",
          marginBottom: "10px",
          fontSize: "20px",
          textShadow: "none",
        }}
      >
        Error
      </h3>

      <p
        style={{
          color: "var(--text-secondary)",
          textShadow: "none",
          fontSize: "15px",
          lineHeight: "1.5",
        }}
      >
        {message}
      </p>
    </div>
  );
}
