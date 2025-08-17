import { useState, useEffect, useContext } from "react";
import BarberProfiles from "./barber_profiles/BarberProfiles";
import ToolBar from "./ToolBar";
import styled from "styled-components";
import WebsiteText from "./website_text/WebsiteText";
import Cookies from "js-cookie";
import Loader from "../Loader";
import Services from "./services/Services";
import { LoginRoleContext } from "../contexts/LoginRoleContext";
import NewClients from "./newClients/NewClients";

const WebsiteTools = () => {
  const [selectedOption, setSelectedOption] = useState("barberProfiles");
  const [userInfo, setUserInfo] = useState([]);
  const [services, setServices] = useState([]);
  const [text, setText] = useState([]);
  const { role, setRole } = useContext(LoginRoleContext);
  const [clients, setClients] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  useEffect(() => {
    if (!role) {
      const cookieRole = Cookies.get("role");
      setRole(cookieRole);
    }
  }, [role, setRole]);
  useEffect(() => {
    fetch(`http://localhost:4000/getUserInfoInWebTools`)
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
          {selectedOption === "websiteText" && (
            <WebsiteText text={text} setText={setText} />
          )}
          {selectedOption === "barberProfiles" && (
            <BarberProfiles userInfo={userInfo} setUserInfo={setUserInfo} />
          )}
          {selectedOption === "clients" && <NewClients />}
          {selectedOption === "services" && (
            <Services services={services} setServices={setServices} />
          )}
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
