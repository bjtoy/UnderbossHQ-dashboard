export default function ProgressBar({
  value = 0,
  color = "var(--red-neon)",
  height = 10,
  style = {},
}) {
  const safeValue = Math.min(100, Math.max(0, value)); // clamp 0–100

  return (
    <div
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "999px",
        overflow: "hidden",
        height,
        ...style,
      }}
    >
      <div
        style={{
          width: `${safeValue}%`,
          height: "100%",
          background: color,
          boxShadow: `0 0 10px ${color}`,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}
