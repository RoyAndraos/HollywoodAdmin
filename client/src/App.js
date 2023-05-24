import Homepage from "./components/Homepage";
import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import BusinessData from "./components/BusinessData";
import Services from "./components/Services";
import Schedule from "./components/Schedule";
import AvailabilityComponent from "./components/AvailabilityComponent.js";
import Check from "./components/Check";
const App = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <div>
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
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
