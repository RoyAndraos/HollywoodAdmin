import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./components/contexts/NotficationContext";
import { IsMobileProvider } from "./components/contexts/IsMobileContext";
import { LoginRoleProvider } from "./components/contexts/LoginRoleContext";
import { NotificationLogsProvider } from "./components/contexts/NotificationLogsContext";
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <LoginRoleProvider>
      <NotificationLogsProvider>
        <NotificationProvider>
          <IsMobileProvider>
            <BrowserRouter basename="/">
              <App />
            </BrowserRouter>
          </IsMobileProvider>
        </NotificationProvider>
      </NotificationLogsProvider>
    </LoginRoleProvider>
  </React.StrictMode>
);
