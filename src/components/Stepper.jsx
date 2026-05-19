export default function Stepper({
  value = 0,
  onChange = () => {},
  min = -Infinity,
  max = Infinity,
  step = 1,
  size = "medium",
  style = {},
}) {
  const sizes = {
    small: { fontSize: 12, padding: "4px 8px", btnSize: 22 },
    medium: { fontSize: 14, padding: "6px 10px", btnSize: 28 },
    large: { fontSize: 16, padding: "8px 12px", btnSize: 34 },
  };

  const s = sizes[size] || sizes.medium;

  const canDecrement = value - step >= min;
  const canIncrement = value + step <= max;

  const buttonStyle = (enabled) => ({
    width: s.btnSize,
    height: s.btnSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    background: enabled
      ? "rgba(255,255,255,0.1)"
      : "rgba(255,255,255,0.05)",
    border: `1px solid ${
      enabled ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)"
    }`,
    color: enabled ? "#fff" : "rgba(255,255,255,0.3)",
    cursor: enabled ? "pointer" : "not-allowed",
    transition: "0.2s ease",
    userSelect: "none",
    fontSize: s.fontSize,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        ...style,
      }}
    >
      {/* Decrement */}
      <div
        style={buttonStyle(canDecrement)}
        onClick={() => canDecrement && onChange(value - step)}
      >
        –
      </div>

      {/* Value */}
      <div
        style={{
          minWidth: 40,
          textAlign: "center",
          fontSize: s.fontSize,
          padding: s.padding,
          borderRadius: 6,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          userSelect: "none",
        }}
      >
        {value}
      </div>

      {/* Increment */}
      <div
        style={buttonStyle(canIncrement)}
        onClick={() => canIncrement && onChange(value + step)}
      >
        +
      </div>
    </div>
  );
}
