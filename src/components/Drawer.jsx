import { useEffect } from "react";

export default function Drawer({
  open = false,
  onClose = () => {},
  side = "right",
  width = 380,
  height = 300,
  title = null,
  children,
  style = {},
}) {
  // Close on ESC key
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  // Positioning logic
  const drawerStyle = {
    position: "fixed",
    background: "#0d0d0d",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 0 20px rgba(255, 46, 46, 0.35)",
    zIndex: 10000,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "16px",
    ...style,
  };

  const sideStyles = {
    right: {
      top: 0,
      right: 0,
      height: "100%",
      width,
      transform: "translateX(100%)",
      animation: "slideInRight 0.3s ease forwards",
    },
    left: {
      top: 0,
      left: 0,
      height: "100%",
      width,
      transform: "translateX(-100%)",
      animation: "slideInLeft 0.3s ease forwards",
    },
    bottom: {
      bottom: 0,
      left: 0,
      width: "100%",
      height,
      transform: "translateY(100%)",
      animation: "slideInUp 0.3s ease forwards",
    },
    top: {
      top: 0,
      left: 0,
      width: "100%",
      height,
      transform: "translateY(-100%)",
      animation: "slideInDown 0.3s ease forwards",
    },
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          animation: "fadeIn 0.25s ease",
        }}
      />

      {/* Drawer */}
      <div style={{ ...drawerStyle, ...sideStyles[side] }}>
        {/* Header */}
        {title && (
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "var(--red-neon)",
              textShadow: "0 0 6px rgba(255, 46, 46, 0.6)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {title}

            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
                opacity: 0.8,
                transition: "0.2s ease",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{ overflowY: "auto", flex: 1 }}>{children}</div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }

          @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }

          @keyframes slideInUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }

          @keyframes slideInDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
}
