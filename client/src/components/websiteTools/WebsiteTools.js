import React, { useState, useEffect, useContext } from "react";
import BarberProfiles from "./barber_profiles/BarberProfiles";
import ToolBar from "./ToolBar";
import styled from "styled-components";
import WebsiteText from "./website_text/WebsiteText";
import Clients from "./clients/Clients";
import { UserContext } from "../contexts/UserContext";
import { ServicesContext } from "../contexts/ServicesContext";
import { TextContext } from "../contexts/TextContext";
import Cookies from "js-cookie";
import Loader from "../Loader";
import Services from "./services/Services";
import { LoginRoleContext } from "../contexts/LoginRoleContext";
// import { EmployeeServicesContext } from "../contexts/EmployeeServicesContext";
import { ClientsContext } from "../contexts/ClientsContext";
import { ReservationContext } from "../contexts/ReservationContext";
import { BlockedSlotsContext } from "../contexts/BlockedSlotsContext";

const WebsiteTools = () => {
  const [selectedOption, setSelectedOption] = useState("barberProfiles");
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { setServices, services } = useContext(ServicesContext);
  const { setText, text } = useContext(TextContext);
  const { role, setRole } = useContext(LoginRoleContext);
  // const { servicesEmp, setServicesEmp } = useContext(EmployeeServicesContext);
  const { clients, setClients } = useContext(ClientsContext);
  const { reservations, setReservations } = useContext(ReservationContext);
  const { blockedSlots, setBlockedSlots } = useContext(BlockedSlotsContext);
  useEffect(() => {
    if (!role) {
      const cookieRole = Cookies.get("role");
      setRole(cookieRole);
    }
  }, [role, setRole]);
  useEffect(() => {
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/getUserInfoInWebTools`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user info");
        }
        return res.json();
      })
      .then((result) => {
        setUserInfo(result.userInfo);
        setServices(result.services);
        setText(result.text);
        // setServicesEmp(result.employeeServices);
        setClients(result.clients);
        setReservations(result.reservations);
        setBlockedSlots(result.blockedSlots);
      })
      .catch((error) => console.error(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (
    (!userInfo ||
      !services ||
      !text ||
      !blockedSlots ||
      // || !servicesEmp
      !clients,
    !reservations)
  )
    return <Loader />;
  return (
    <Wrapper>
      <ToolBar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <div style={{ position: "relative" }}>
        <RestWrapper>
          {selectedOption === "websiteText" && <WebsiteText />}
          {selectedOption === "barberProfiles" && <BarberProfiles />}
          {selectedOption === "clients" && <Clients />}
          {selectedOption === "services" && <Services />}
        </RestWrapper>
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 95vw;
  position: relative;
`;

const RestWrapper = styled.div`
  width: 80%;
  position: absolute;

  right: -2%;
`;

export default WebsiteTools;
