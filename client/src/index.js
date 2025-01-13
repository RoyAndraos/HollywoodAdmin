import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/contexts/UserContext";
import { ReservationProvider } from "./components/contexts/ReservationContext";
import { ServicesProvider } from "./components/contexts/ServicesContext";
import { TextProvider } from "./components/contexts/TextContext";
import { NotificationProvider } from "./components/contexts/NotficationContext";
import { NotificationLogsProvider } from "./components/contexts/NotificationLogsContext";
import { IsMobileProvider } from "./components/contexts/IsMobileContext";
import { LoginRoleProvider } from "./components/contexts/LoginRoleContext";
// import { EmployeeServicesProvider } from "./components/contexts/EmployeeServicesContext";
import { BlockedSlotsProvider } from "./components/contexts/BlockedSlotsContext";
import { ClientsProvider } from "./components/contexts/ClientsContext";
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProvider>
      <LoginRoleProvider>
        <TextProvider>
          <ReservationProvider>
            <ServicesProvider>
              {/* <EmployeeServicesProvider> */}
              <BlockedSlotsProvider>
                <NotificationProvider>
                  <NotificationLogsProvider>
                    <IsMobileProvider>
                      <ClientsProvider>
                        <BrowserRouter basename="/">
                          <App />
                        </BrowserRouter>
                      </ClientsProvider>
                    </IsMobileProvider>
                  </NotificationLogsProvider>
                </NotificationProvider>
              </BlockedSlotsProvider>
              {/* </EmployeeServicesProvider> */}
            </ServicesProvider>
          </ReservationProvider>
        </TextProvider>
      </LoginRoleProvider>
    </UserProvider>
  </React.StrictMode>
);
