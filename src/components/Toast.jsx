export default function Toast({
  id,
  message,
  variant = "info",
  onClose = () => {},
}) {
  const colors = {
    success: "var(--green-neon, #00ff78)",
    error: "var(--red-neon, #ff2e2e)",
    warning: "var(--yellow-neon, #ffcc00)",
    info: "var(--blue-neon, #4db8ff)",
  };

  const color = colors[variant] || colors.info;

  return (
    <div
      style={{
        padding: "12px 16px",
        background: "rgba(0,0,0,0.85)",
        border: `1px solid ${color}`,
        borderRadius: "8px",
        color: "#fff",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: `0 0 12px ${color}`,
        animation: "toast-slide-in 0.25s ease",
        position: "relative",
        minWidth: "240px",
      }}
    >
      <div style={{ flex: 1 }}>{message}</div>

      <button
        onClick={() => onClose(id)}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: "16px",
          padding: 0,
          opacity: 0.7,
        }}
      >
        ✕
      </button>

      <style>
        {`
          @keyframes toast-slide-in {
            from { transform: translateX(40px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes toast-fade-out {
            from { opacity: 1; }
            to { opacity: 0; transform: translateX(40px); }
          }
        `}
      </style>
    </div>
  );
}
