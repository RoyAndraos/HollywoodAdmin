import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./components/contexts/NotficationContext";
import { IsMobileProvider } from "./components/contexts/IsMobileContext";
import { LoginRoleProvider } from "./components/contexts/LoginRoleContext";
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <LoginRoleProvider>
      <NotificationProvider>
        <IsMobileProvider>
          <BrowserRouter basename="/">
            <App />
          </BrowserRouter>
        </IsMobileProvider>
      </NotificationProvider>
    </LoginRoleProvider>
  </React.StrictMode>
);
