export default function BadgeCounter({
  count = 0,
  max = null,
  variant = "default",
  size = "medium",
  style = {},
}) {
  const colors = {
    default: "rgba(255,255,255,0.25)",
    success: "var(--green-neon, #00ff78)",
    warning: "var(--yellow-neon, #ffcc00)",
    error: "var(--red-neon, #ff2e2e)",
    info: "var(--blue-neon, #4db8ff)",
  };

  const sizes = {
    small: { fontSize: 10, padding: "2px 6px", minWidth: 16 },
    medium: { fontSize: 12, padding: "4px 8px", minWidth: 20 },
    large: { fontSize: 14, padding: "6px 10px", minWidth: 26 },
  };

  const color = colors[variant] || colors.default;
  const sizeStyle = sizes[size] || sizes.medium;

  const displayValue =
    max && count > max ? `${max}+` : count.toString();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        border: `1px solid ${color}`,
        color: "#fff",
        borderRadius: "999px",
        boxShadow: `0 0 8px ${color}`,
        fontWeight: "600",
        lineHeight: 1,
        ...sizeStyle,
        ...style,
      }}
    >
      {displayValue}
    </div>
  );
}
