import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/contexts/UserContext";
import { ReservationProvider } from "./components/contexts/ReservationContext";
import { ServicesProvider } from "./components/contexts/ServicesContext";
import { TextProvider } from "./components/contexts/TextContext";
import { ImageProvider } from "./components/contexts/ImageContext";
import { NotificationProvider } from "./components/contexts/NotficationContext";
import { NotificationLogsProvider } from "./components/contexts/NotificationLogsContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-ccwc5cx3jqzk54hd.us.auth0.com"
      clientId="cvxYaWG4Jpulz1t14zLkZr7LvhwEep9O"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <UserProvider>
        <ImageProvider>
          <TextProvider>
            <ReservationProvider>
              <ServicesProvider>
                <NotificationProvider>
                  <NotificationLogsProvider>
                    <BrowserRouter>
                      <App>{Children}</App>
                    </BrowserRouter>
                  </NotificationLogsProvider>
                </NotificationProvider>
              </ServicesProvider>
            </ReservationProvider>
          </TextProvider>
        </ImageProvider>
      </UserProvider>
    </Auth0Provider>
  </React.StrictMode>
);
