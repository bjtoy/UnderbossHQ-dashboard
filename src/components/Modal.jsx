import { useEffect } from "react";

export default function Modal({
  open = false,
  onClose = () => {},
  title = null,
  width = 480,
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

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d0d0d",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px",
          padding: "22px",
          width: "90%",
          maxWidth: width,
          boxShadow: "0 0 20px rgba(255, 46, 46, 0.35)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          transform: "scale(0.92)",
          animation: "modalPop 0.25s ease forwards",
          ...style,
        }}
      >
        {/* Header */}
        {title && (
          <div
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "var(--red-neon)",
              textShadow: "0 0 6px rgba(255, 46, 46, 0.6)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {title}

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
                lineHeight: 1,
                opacity: 0.8,
                transition: "0.2s ease",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes modalPop {
            from { transform: scale(0.92); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
