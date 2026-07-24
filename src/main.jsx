import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

/* GLOBAL UNDERBOSSHQ STYLES */
import "./styles/styles.css";

/* CONTEXT PROVIDERS */
import { RoleProvider } from "./context/RoleContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <RoleProvider>
          <App />
        </RoleProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
