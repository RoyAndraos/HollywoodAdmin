import React, { useState, useEffect, useContext } from "react";
import BarberProfiles from "./barber_profiles/BarberProfiles";
import ToolBar from "./ToolBar";
import styled from "styled-components";
import WebsiteText from "./website_text/WebsiteText";
import Clients from "./clients/Clients";
import { UserContext } from "../contexts/UserContext";
import { ReservationContext } from "../contexts/ReservationContext";
import { ServicesContext } from "../contexts/ServicesContext";
import { TextContext } from "../contexts/TextContext";
import Cookies from "js-cookie";
import Loader from "../Loader";
import Services from "./services/Services";
import { LoginRoleContext } from "../contexts/LoginRoleContext";
import { EmployeeServicesContext } from "../contexts/EmployeeServicesContext";
import { ClientsContext } from "../contexts/ClientsContext";

const WebsiteTools = () => {
  const [selectedOption, setSelectedOption] = useState("barberProfiles");
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { setReservations, reservations } = useContext(ReservationContext);
  const { setServices, services } = useContext(ServicesContext);
  const { setText, text } = useContext(TextContext);
  const { role, setRole } = useContext(LoginRoleContext);
  const { servicesEmp, setServicesEmp } = useContext(EmployeeServicesContext);
  const { clients, setClients } = useContext(ClientsContext);
  useEffect(() => {
    if (!role) {
      const cookieRole = Cookies.get("role");
      setRole(cookieRole);
    }
  }, [role, setRole]);
  useEffect(() => {
    if (!userInfo) {
      const token = Cookies.get("token");
      if (!token) {
        return;
      } else {
        const headers = {
          authorization: token,
        };
        fetch(`https://hollywood-fairmount-admin.onrender.com/getUserInfo`, {
          headers,
        })
          .then((res) => res.json())
          .then((result) => {
            setUserInfo(result.userInfo);
            setReservations(result.reservations);
            setServices(result.services);
            setText(result.text);
            setServicesEmp(result.employeeServices);
            setClients(result.clients);
          });
      }
    }
  }, [
    setReservations,
    setServices,
    setUserInfo,
    setText,
    userInfo,
    setServicesEmp,
    setClients,
  ]);
  if (
    !userInfo ||
    !reservations ||
    !services ||
    !text ||
    !servicesEmp ||
    !clients
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
