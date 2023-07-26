import Homepage from "./components/login/Homepage";
import RequireAuth from "./components/login/RequireAuth";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar";
import BusinessData from "./components/BusinessData";
import Services from "./components/websiteTools/Services";
import Schedule from "./components/schedule/Schedule";
import AvailabilityComponent from "./components/availability/AvailabilityComponent";
import Check from "./components/login/Check";
import NotGrant from "./components/login/NotGrant";
import TakeTimeOff from "./components/availability/TakeTimeOff";
import SeeImages from "./components/websiteTools/SeeImages";
const App = () => {
  const location = useLocation();
  return (
    <div>
      {location.pathname !== "/dashboard/check" &&
        location.pathname.includes("/dashboard") && <NavBar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/404" element={<NotGrant />} />
      </Routes>
      <RequireAuth>
        <Routes>
          <Route path="/dashboard/check" element={<Check />} />
          <Route path="/dashboard/data" element={<BusinessData />} />
          <Route path="/dashboard/services" element={<Services />} />
          <Route
            path="/dashboard/availability"
            element={<AvailabilityComponent />}
          />
          <Route
            path="/dashboard/timeOff/:barberId"
            element={<TakeTimeOff />}
          />
          <Route path="/dashboard/schedule" element={<Schedule />} />
          <Route path="/websiteTools/seeImages" element={<SeeImages />} />
        </Routes>
      </RequireAuth>
    </div>
  );
};

export default App;
