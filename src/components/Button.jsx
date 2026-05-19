export default function Button({
  children,
  variant = "primary",
  size = "md",
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

  return (
    <button
      className="btn"
      style={{
        borderRadius: "8px",
        cursor: "pointer",
        transition: "0.2s ease",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
