export default function Loader() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Neon Spinner */}
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(164, 40, 72, 0.2)",
          borderTopColor: "var(--brand-red-glow)",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
          boxShadow: "var(--glow-red)",
        }}
      ></div>

      <p
        style={{
          marginTop: "14px",
          color: "var(--text-secondary)",
          textShadow: "none",
          fontSize: "15px",
          letterSpacing: "0.5px",
        }}
      >
        Loading…
      </p>

      {/* Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
