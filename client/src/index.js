import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/contexts/UserContext";
import { ReservationProvider } from "./components/contexts/ReservationContext";
import { ServicesProvider } from "./components/contexts/ServicesContext";
import { TextProvider } from "./components/contexts/TextContext";
import { ImageProvider } from "./components/contexts/ImageContext";
import { NotificationProvider } from "./components/contexts/NotficationContext";
import { NotificationLogsProvider } from "./components/contexts/NotificationLogsContext";
import { IsMobileProvider } from "./components/contexts/IsMobileContext";
import { LoginRoleProvider } from "./components/contexts/LoginRoleContext";
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProvider>
      <LoginRoleProvider>
        <ImageProvider>
          <TextProvider>
            <ReservationProvider>
              <ServicesProvider>
                <NotificationProvider>
                  <NotificationLogsProvider>
                    <IsMobileProvider>
                      <BrowserRouter basename="/">
                        <App />
                      </BrowserRouter>
                    </IsMobileProvider>
                  </NotificationLogsProvider>
                </NotificationProvider>
              </ServicesProvider>
            </ReservationProvider>
          </TextProvider>
        </ImageProvider>
      </LoginRoleProvider>
    </UserProvider>
  </React.StrictMode>
);
