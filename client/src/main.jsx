import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ThemeContextWrapper from "./context/ThemeContextWrapper.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SpeedInsights />
    <BrowserRouter>
      <ThemeContextWrapper>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeContextWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
