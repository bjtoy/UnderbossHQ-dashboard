export default function Badge({
  children,
  variant = "default",
  style = {},
}) {
  const variants = {
    default: {
      background: "rgba(255,255,255,0.12)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.18)",
    },
    success: {
      background: "rgba(0, 255, 120, 0.15)",
      color: "#00ff78",
      border: "1px solid rgba(0, 255, 120, 0.4)",
    },
    warning: {
      background: "rgba(255, 200, 0, 0.15)",
      color: "#ffcc00",
      border: "1px solid rgba(255, 200, 0, 0.4)",
    },
    danger: {
      background: "rgba(255, 46, 46, 0.15)",
      color: "var(--red-neon)",
      border: "1px solid rgba(255, 46, 46, 0.4)",
    },
    info: {
      background: "rgba(0, 180, 255, 0.15)",
      color: "#00b4ff",
      border: "1px solid rgba(0, 180, 255, 0.4)",
    },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        fontSize: "13px",
        fontWeight: "500",
        borderRadius: "999px",
        whiteSpace: "nowrap",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
