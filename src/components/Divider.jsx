export default function Divider({
  thickness = "2px",
  color = "rgba(255,255,255,0.15)",
  margin = "16px 0",
  style = {},
}) {
  return (
    <div
      style={{
        width: "100%",
        height: thickness,
        background: color,
        margin,
        borderRadius: "2px",
        ...style,
      }}
    />
  );
}
