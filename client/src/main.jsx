import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ThemeContextWrapper from "./context/ThemeContextWrapper.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SpeedInsights />
    <Analytics />
    <BrowserRouter>
      <ThemeContextWrapper>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeContextWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
