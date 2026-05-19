export default function Select({
  label = null,
  error = null,
  helper = null,
  options = [],
  style = {},
  ...props
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          style={{
            color: "#fff",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {label}
        </label>
      )}

      <select
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          background: "#0f0f0f",
          border: error
            ? "2px solid var(--red-neon)"
            : "2px solid rgba(255,255,255,0.15)",
          color: "#fff",
          fontSize: "15px",
          outline: "none",
          transition: "0.2s ease",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          ...style,
        }}
        {...props}
      >
        {options.map((opt, i) => (
          <option
            key={i}
            value={opt.value}
            style={{
              background: "#0f0f0f",
              color: "#fff",
            }}
          >
            {opt.label}
          </option>
        ))}
      </select>

      {helper && !error && (
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {helper}
        </div>
      )}

      {error && (
        <div
          style={{
            fontSize: "12px",
            color: "var(--red-neon)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
