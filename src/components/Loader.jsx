export default function Loader() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(255, 46, 46, 0.2)",
          borderTopColor: "var(--red-neon)",
          borderRadius: "50%",
          margin: "0 auto",
          animation: "spin 0.8s linear infinite",
        }}
      ></div>

      <p style={{ marginTop: "10px", color: "var(--text-muted)" }}>
        Loading...
      </p>

      {/* Spinner animation */}
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
