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
          border: "4px solid rgba(255, 46, 46, 0.15)",
          borderTopColor: "var(--red-neon)",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
          boxShadow: "0 0 12px rgba(255, 46, 46, 0.6)",
        }}
      ></div>

      <p
        style={{
          marginTop: "14px",
          color: "var(--text-red-soft)",
          textShadow: "var(--text-glow-red-soft)",
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
