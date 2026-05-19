export default function SearchBar({
  value = "",
  onChange = () => {},
  placeholder = "Search...",
  style = {},
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 12px",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "8px",
        color: "#fff",
        transition: "0.2s ease",
        boxShadow: "0 0 0 transparent",
        ...style,
      }}
    >
      {/* Search Icon */}
      <div
        style={{
          fontSize: "16px",
          opacity: 0.7,
          userSelect: "none",
        }}
      >
        🔍
      </div>

      {/* Input */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#fff",
          fontSize: "14px",
        }}
      />

      <style>
        {`
          input::placeholder {
            color: rgba(255,255,255,0.4);
          }
          div:focus-within {
            border-color: var(--red-neon);
            box-shadow: 0 0 10px var(--red-neon);
          }
        `}
      </style>
    </div>
  );
}
