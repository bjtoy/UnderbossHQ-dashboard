export default function Pagination({
  page = 1,
  totalPages = 1,
  onChange = () => {},
  style = {},
}) {
  const pages = [];

  // Generate page numbers (simple version: show all pages)
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const buttonStyle = (isActive) => ({
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    background: isActive ? "var(--red-neon)" : "rgba(255,255,255,0.08)",
    border: isActive
      ? "1px solid var(--red-neon)"
      : "1px solid rgba(255,255,255,0.15)",
    color: isActive ? "#000" : "#fff",
    textShadow: isActive ? "none" : "0 0 4px rgba(255,255,255,0.4)",
    boxShadow: isActive ? "0 0 10px var(--red-neon)" : "none",
    transition: "0.2s ease",
  });

  const disabledStyle = {
    opacity: 0.4,
    cursor: "not-allowed",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        ...style,
      }}
    >
      {/* Previous */}
      <div
        onClick={() => page > 1 && onChange(page - 1)}
        style={{
          ...buttonStyle(false),
          ...(page === 1 ? disabledStyle : {}),
        }}
      >
        Prev
      </div>

      {/* Page numbers */}
      {pages.map((p) => (
        <div
          key={p}
          onClick={() => onChange(p)}
          style={buttonStyle(p === page)}
        >
          {p}
        </div>
      ))}

      {/* Next */}
      <div
        onClick={() => page < totalPages && onChange(page + 1)}
        style={{
          ...buttonStyle(false),
          ...(page === totalPages ? disabledStyle : {}),
        }}
      >
        Next
      </div>
    </div>
  );
}
