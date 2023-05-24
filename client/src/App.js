import Homepage from "./components/Homepage";
import RequireAuth from "./components/RequireAuth";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar";
import BusinessData from "./components/BusinessData";
import Services from "./components/Services";
import Schedule from "./components/Schedule";
import AvailabilityComponent from "./components/AvailabilityComponent.js";
import Check from "./components/Check";
import NotGrant from "./components/NotGrant";
const App = () => {
  const location = useLocation();
  return (
    <div>
      {location.pathname !== "/dashboard/check" && location.pathname.includes('/dashboard') && <NavBar />}
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
          <Route path="/dashboard/schedule" element={<Schedule />} />
        </Routes>
      </RequireAuth>
    </div>
  );
};

export default App;
