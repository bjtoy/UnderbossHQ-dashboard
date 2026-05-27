import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RoleProvider } from "./context/RoleContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <RoleProvider>
      <App />
    </RoleProvider>
  </ToastProvider>
);