import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toastRef } from "../utils/toastRef.js";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    toastRef.showToast = showToast;
    return () => {
      toastRef.showToast = null;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: "14px 20px",
              borderRadius: "10px",
              background: "#1a0507",
              border: "2px solid var(--red-neon)",
              color: "#fff",
              boxShadow: "0 0 12px rgba(255, 46, 46, 0.4)",
              fontSize: "14px",
              minWidth: "220px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
