export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  loadingText = null,
  style = {},
  ...props
}) {
  const variantStyles = {
    primary: {
      background: "var(--red-neon)",
      color: "#fff",
      border: "2px solid var(--red-neon)",
      boxShadow: "0 0 8px rgba(255, 46, 46, 0.4)",
    },
    danger: {
      background: "#3a0000",
      color: "var(--red-neon)",
      border: "2px solid var(--red-neon)",
      boxShadow: "0 0 8px rgba(255, 46, 46, 0.4)",
    },
    ghost: {
      background: "transparent",
      color: "var(--red-neon)",
      border: "2px solid transparent",
    },
    outline: {
      background: "transparent",
      color: "var(--red-neon)",
      border: "2px solid var(--red-neon)",
    },
  };

  const sizeStyles = {
    sm: { padding: "6px 12px", fontSize: "13px" },
    md: { padding: "10px 16px", fontSize: "15px" },
    lg: { padding: "14px 20px", fontSize: "17px" },
  };

  const spinner = (
    <span
      style={{
        width: "16px",
        height: "16px",
        border: "3px solid rgba(255, 46, 46, 0.3)",
        borderTopColor: "var(--red-neon)",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );

  return (
    <>
      <button
        className="btn"
        disabled={loading || props.disabled}
        style={{
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style,
        }}
        {...props}
      >
        {loading ? (
          <>
            {spinner}
            {loadingText ? loadingText : null}
          </>
        ) : (
          children
        )}
      </button>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}
