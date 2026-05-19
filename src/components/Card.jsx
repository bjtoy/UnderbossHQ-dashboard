export default function Card({
  title = null,
  subtitle = null,
  children,
  style = {},
}) {
  return (
    <div
      style={{
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "16px",
        boxShadow: "0 0 10px rgba(255, 46, 46, 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {title && (
            <div
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "var(--red-neon)",
                textShadow: "0 0 6px rgba(255, 46, 46, 0.6)",
              }}
            >
              {title}
            </div>
          )}

          {subtitle && (
            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}
export default function Card({
  title = null,
  subtitle = null,
  children,
  style = {},
}) {
  return (
    <div
      style={{
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "16px",
        boxShadow: "0 0 10px rgba(255, 46, 46, 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {title && (
            <div
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "var(--red-neon)",
                textShadow: "0 0 6px rgba(255, 46, 46, 0.6)",
              }}
            >
              {title}
            </div>
          )}

          {subtitle && (
            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}
