import { useState } from "react";

export default function RatingStars({
  value = 0,
  max = 5,
  size = 22,
  color = "var(--yellow-neon, #ffcc00)",
  onChange = null,
  style = {},
}) {
  const [hoverValue, setHoverValue] = useState(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const stars = Array.from({ length: max }, (_, i) => i + 1);

  const starStyle = (filled) => ({
    fontSize: size,
    cursor: onChange ? "pointer" : "default",
    color: filled ? color : "rgba(255,255,255,0.25)",
    filter: filled ? `drop-shadow(0 0 6px ${color})` : "none",
    transition: "0.2s ease",
    userSelect: "none",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        alignItems: "center",
        ...style,
      }}
    >
      {stars.map((star) => {
        const filled = star <= displayValue;

        return (
          <div
            key={star}
            style={starStyle(filled)}
            onMouseEnter={() => onChange && setHoverValue(star)}
            onMouseLeave={() => onChange && setHoverValue(null)}
            onClick={() => onChange && onChange(star)}
          >
            ★
          </div>
        );
      })}
    </div>
  );
}
