export default function Divider({
  orientation = "horizontal",
  thickness = 1,
  color = "rgba(255,255,255,0.15)",
  length = "100%",
  style = {},
}) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      style={{
        width: isHorizontal ? length : thickness,
        height: isHorizontal ? thickness : length,
        background: color,
        borderRadius: "2px",
        boxShadow: `0 0 6px ${color}`,
        ...style,
      }}
    />
  );
}
