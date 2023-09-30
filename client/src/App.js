import Homepage from "./components/login/Homepage";
import RequireAuth from "./components/login/RequireAuth";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar";
import BusinessData from "./components/BusinessData";
import WebsiteTools from "./components/websiteTools/WebsiteTools";
import Schedule from "./components/schedule/Schedule";
import AvailabilityComponent from "./components/availability/AvailabilityComponent";
import Check from "./components/login/Check";
import NotGrant from "./components/login/NotGrant";
import TakeTimeOff from "./components/availability/TakeTimeOff";
import EditRsvp from "./components/schedule/rsvpComponents/editRsvpFolder/EditRsvp";
import { NotificationContext } from "./components/contexts/NotficationContext";
import { useContext } from "react";
import styled from "styled-components";
import { useEffect } from "react";
const App = () => {
  const { notification, setNotification } = useContext(NotificationContext);
  const location = useLocation();
  useEffect(() => {
    if (notification !== "") {
      setTimeout(() => {
        setNotification("");
      }, 3000);
    }
  }, [notification, setNotification]);
  return (
    <div>
      {location.pathname !== "/dashboard/check" &&
        location.pathname.includes("/dashboard") && <NavBar />}
      {notification !== "" && <Notification>{notification}</Notification>}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/404" element={<NotGrant />} />
      </Routes>
      <RequireAuth>
        <Routes>
          <Route path="/dashboard/check" element={<Check />} />
          <Route path="/dashboard/data" element={<BusinessData />} />
          <Route path="/dashboard/websiteTools" element={<WebsiteTools />} />
          <Route
            path="/dashboard/availability"
            element={<AvailabilityComponent />}
          />
          <Route
            path="/dashboard/timeOff/:barberId"
            element={<TakeTimeOff />}
          />
          <Route path="/dashboard/schedule" element={<Schedule />} />
          <Route path="/dashboard/schedule/:_id" element={<EditRsvp />} />
        </Routes>
      </RequireAuth>
    </div>
  );
};
const Notification = styled.div`
  position: fixed;
  font-family: "Roboto", sans-serif;
  z-index: 1000;
  bottom: 0;
  right: 0;
  width: 300px;
  height: 80px;
  background-color: #e7e7e7;
  color: #035e3f;
  padding: 16px;
  margin: 16px;
  border-top: 5px solid #035e3f;
  border-radius: 3px;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 1px;
`;
export default App;
