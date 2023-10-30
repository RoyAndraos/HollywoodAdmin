// import Homepage from "./components/login/Homepage";
// // import RequireAuth from "./components/login/RequireAuth";
// import Check from "./components/login/Check";
// import BusinessData from "./components/BusinessData";
// import NotGrant from "./components/login/NotGrant";

import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import WebsiteTools from "./components/websiteTools/WebsiteTools";
import Schedule from "./components/schedule/Schedule";
import TakeTimeOff from "./components/availability/TakeTimeOff";
import EditRsvp from "./components/schedule/rsvpComponents/editRsvpFolder/EditRsvp";
import { NotificationContext } from "./components/contexts/NotficationContext";
import { useContext } from "react";
import styled from "styled-components";
import { useEffect } from "react";
import TimeSelect from "./components/availability/TimeSelect";

const App = () => {
  const { notification, setNotification } = useContext(NotificationContext);
  // const location = useLocation();

  useEffect(() => {
    if (notification !== "") {
      setTimeout(() => {
        setNotification("");
      }, 3000);
    }
  }, [notification, setNotification]);
  return (
    <div>
      <NavBar />
      {notification !== "" && <Notification>{notification}</Notification>}
      <Routes>
        <Route path="/" element={<Schedule />} />
        {/* <Route path="/404" element={<NotGrant />} /> */}
        {/* </Routes>
      <RequireAuth>
        <Routes> */}
        {/* <Route path="/check" element={<Check />} /> */}
        {/* <Route path="/data" element={<BusinessData />} /> */}
        <Route path="/websiteTools" element={<WebsiteTools />} />
        <Route path="/availability" element={<TimeSelect />} />
        <Route path="/timeOff/:barberId" element={<TakeTimeOff />} />
        <Route path="/schedule/:_id" element={<EditRsvp />} />
      </Routes>
      {/* </RequireAuth> */}
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
