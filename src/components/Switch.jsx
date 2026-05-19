import { useState } from "react";

export default function Switch({
  checked = false,
  onChange = () => {},
  size = "medium",
  color = "var(--red-neon, #ff2e2e)",
  style = {},
}) {
  const sizes = {
    small: { width: 34, height: 18, thumb: 14 },
    medium: { width: 44, height: 24, thumb: 20 },
    large: { width: 56, height: 30, thumb: 26 },
  };

  const s = sizes[size] || sizes.medium;

  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: s.width,
        height: s.height,
        borderRadius: s.height,
        background: checked
          ? color
          : "rgba(255,255,255,0.15)",
        border: `1px solid ${
          checked ? color : "rgba(255,255,255,0.25)"
        }`,
        boxShadow: checked ? `0 0 10px ${color}` : "none",
        position: "relative",
        cursor: "pointer",
        transition: "0.25s ease",
        ...style,
      }}
    >
      {/* Thumb */}
      <div
        style={{
          width: s.thumb,
          height: s.thumb,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: checked ? s.width - s.thumb - 3 : 3,
          transition: "0.25s ease",
          boxShadow: checked
            ? `0 0 8px ${color}`
            : "0 0 4px rgba(255,255,255,0.4)",
        }}
      />
    </div>
  );
}
